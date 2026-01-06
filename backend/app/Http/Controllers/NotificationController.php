<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Liste des notifications de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $query = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

        // Filtrer par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrer par statut de lecture
        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        $notifications = $query->paginate(20);

        // Compter les non lues
        $unreadCount = Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Marquer une notification comme lue.
     */
    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->update(['is_read' => true]);

        return response()->json([
            'message' => 'Notification marquée comme lue',
            'notification' => $notification,
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues.
     */
    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues'
        ]);
    }

    /**
     * Supprimer une notification.
     */
    public function destroy($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->delete();

        return response()->json([
            'message' => 'Notification supprimée'
        ]);
    }

    /**
     * Vérifier et générer les alertes de stock (à appeler via cron/scheduler).
     */
    public static function checkStockAlerts()
    {
        // Produits en stock bas
        $lowStockProducts = Stock::join('products', 'stocks.product_id', '=', 'products.id')
            ->whereRaw('stocks.quantity <= COALESCE(products.alert_threshold, 10)')
            ->where('stocks.quantity', '>', 0)
            ->select('stocks.*', 'products.name as product_name', 'products.alert_threshold')
            ->get();

        foreach ($lowStockProducts as $stock) {
            self::createStockNotification(
                $stock,
                'low_stock',
                "Stock bas pour {$stock->product_name}: {$stock->quantity} restants"
            );
        }

        // Produits en rupture
        $outOfStockProducts = Stock::join('products', 'stocks.product_id', '=', 'products.id')
            ->where('stocks.quantity', '<=', 0)
            ->select('stocks.*', 'products.name as product_name')
            ->get();

        foreach ($outOfStockProducts as $stock) {
            self::createStockNotification(
                $stock,
                'out_of_stock',
                "RUPTURE DE STOCK: {$stock->product_name}"
            );
        }

        return [
            'low_stock' => $lowStockProducts->count(),
            'out_of_stock' => $outOfStockProducts->count(),
        ];
    }

    /**
     * Créer une notification de stock (éviter les doublons).
     */
    private static function createStockNotification($stock, $type, $message)
    {
        // Éviter les doublons pour la même alerte du même jour
        $exists = Notification::where('type', $type)
            ->whereDate('created_at', now()->toDateString())
            ->where('data->product_id', $stock->product_id)
            ->exists();

        if (!$exists) {
            // Notifier les admins et managers
            $adminRoleIds = DB::table('roles')
                ->whereIn('name', ['admin', 'manager', 'magasinier'])
                ->pluck('id');

            $users = DB::table('users')
                ->whereIn('role_id', $adminRoleIds)
                ->pluck('id');

            foreach ($users as $userId) {
                Notification::create([
                    'user_id' => $userId,
                    'type' => $type,
                    'title' => $type === 'out_of_stock' ? 'Rupture de Stock' : 'Stock Bas',
                    'message' => $message,
                    'data' => json_encode([
                        'product_id' => $stock->product_id,
                        'current_quantity' => $stock->quantity,
                        'warehouse_id' => $stock->warehouse_id,
                    ]),
                    'is_read' => false,
                ]);
            }
        }
    }
}
