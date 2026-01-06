<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * Liste des clients avec pagination et recherche.
     */
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }

        // Filtrer par catégorie
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->latest()->paginate(20));
    }

    /**
     * Créer un nouveau client.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'category' => 'nullable|in:regular,vip,wholesale',
            'credit_limit' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['balance'] = 0; // Solde initial à 0
        $validated['loyalty_points'] = 0;

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    /**
     * Afficher un client avec son historique.
     */
    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        
        // Statistiques du client
        $stats = [
            'total_purchases' => Sale::where('customer_id', $id)->sum('total_amount'),
            'purchase_count' => Sale::where('customer_id', $id)->count(),
            'last_purchase' => Sale::where('customer_id', $id)->latest()->first()?->created_at,
            'average_basket' => Sale::where('customer_id', $id)->avg('total_amount') ?? 0,
        ];

        // Dernières commandes
        $recentOrders = Sale::where('customer_id', $id)
            ->with('items.product:id,name')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'customer' => $customer,
            'stats' => $stats,
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * Mettre à jour un client.
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['nullable', 'email', Rule::unique('customers')->ignore($customer->id)],
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'category' => 'nullable|in:regular,vip,wholesale',
            'credit_limit' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $customer->update($validated);

        return response()->json($customer);
    }

    /**
     * Supprimer un client.
     */
    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);

        // Vérifier s'il a des ventes
        $hasOrders = Sale::where('customer_id', $id)->exists();
        
        if ($hasOrders) {
            // Soft delete ou archivage plutôt que suppression
            return response()->json([
                'message' => 'Ce client a un historique de commandes. Il sera archivé.'
            ], 200);
        }

        $customer->delete();

        return response()->json(['message' => 'Client supprimé avec succès']);
    }

    /**
     * Historique des achats d'un client.
     */
    public function purchaseHistory($id, Request $request)
    {
        $customer = Customer::findOrFail($id);

        $query = Sale::where('customer_id', $id)
            ->with(['items.product:id,name,sku', 'user:id,name']);

        // Filtrer par période
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $purchases = $query->latest()->paginate(20);

        return response()->json($purchases);
    }

    /**
     * Ajuster le solde/crédit d'un client.
     */
    public function adjustBalance(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'amount' => 'required|numeric',
            'type' => 'required|in:credit,debit',
            'note' => 'nullable|string',
        ]);

        if ($validated['type'] === 'credit') {
            $customer->increment('balance', $validated['amount']);
        } else {
            $customer->decrement('balance', $validated['amount']);
        }

        return response()->json([
            'message' => 'Solde mis à jour',
            'new_balance' => $customer->fresh()->balance,
        ]);
    }
}
