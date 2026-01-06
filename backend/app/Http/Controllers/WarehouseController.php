<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    /**
     * Liste des entrepôts avec pagination.
     */
    public function index(Request $request)
    {
        $query = Warehouse::with(['company']);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('address', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Créer un nouvel entrepôt.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'company_id' => 'nullable|exists:companies,id',
            'is_active' => 'boolean',
        ]);

        $warehouse = Warehouse::create($validated);

        return response()->json($warehouse, 201);
    }

    /**
     * Afficher un entrepôt avec ses stocks.
     */
    public function show($id)
    {
        $warehouse = Warehouse::with(['stocks.product', 'company'])->findOrFail($id);
        
        // Calculer les statistiques de l'entrepôt
        $totalProducts = $warehouse->stocks->count();
        $totalValue = $warehouse->stocks->sum(function ($stock) {
            return $stock->quantity * ($stock->product->price ?? 0);
        });
        $lowStockCount = $warehouse->stocks->where('quantity', '<=', 10)->count();

        return response()->json([
            'warehouse' => $warehouse,
            'stats' => [
                'total_products' => $totalProducts,
                'total_value' => $totalValue,
                'low_stock_count' => $lowStockCount,
            ]
        ]);
    }

    /**
     * Mettre à jour un entrepôt.
     */
    public function update(Request $request, $id)
    {
        $warehouse = Warehouse::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'company_id' => 'nullable|exists:companies,id',
            'is_active' => 'boolean',
        ]);

        $warehouse->update($validated);

        return response()->json($warehouse);
    }

    /**
     * Supprimer un entrepôt.
     */
    public function destroy($id)
    {
        $warehouse = Warehouse::findOrFail($id);
        
        // Vérifier si l'entrepôt a des stocks
        if ($warehouse->stocks()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer un entrepôt contenant des stocks'
            ], 422);
        }

        $warehouse->delete();

        return response()->json(['message' => 'Entrepôt supprimé avec succès']);
    }
}
