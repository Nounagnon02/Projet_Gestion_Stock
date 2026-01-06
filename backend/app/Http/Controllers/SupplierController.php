<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    /**
     * Liste des fournisseurs avec pagination.
     */
    public function index(Request $request)
    {
        $query = Supplier::withCount('products');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('contact_person', 'like', '%' . $search . '%');
            });
        }

        return response()->json($query->latest()->paginate(20));
    }

    /**
     * Créer un nouveau fournisseur.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:suppliers,email',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'contact_person' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['balance'] = 0; // Dette initiale à 0

        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    /**
     * Afficher un fournisseur avec ses produits et statistiques.
     */
    public function show($id)
    {
        $supplier = Supplier::findOrFail($id);
        
        // Produits fournis par ce fournisseur
        $products = Product::where('supplier_id', $id)
            ->select('id', 'name', 'sku', 'price', 'cost_price')
            ->get();

        // Statistiques
        $stats = [
            'total_products' => $products->count(),
            'total_purchases' => Purchase::where('supplier_id', $id)->sum('total_amount'),
            'purchase_count' => Purchase::where('supplier_id', $id)->count(),
            'last_purchase' => Purchase::where('supplier_id', $id)->latest()->first()?->created_at,
            'pending_payments' => Purchase::where('supplier_id', $id)
                ->where('payment_status', '!=', 'paid')
                ->sum('total_amount'),
        ];

        // Dernières commandes
        $recentOrders = Purchase::where('supplier_id', $id)
            ->with('items.product:id,name')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'supplier' => $supplier,
            'products' => $products,
            'stats' => $stats,
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * Mettre à jour un fournisseur.
     */
    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['nullable', 'email', Rule::unique('suppliers')->ignore($supplier->id)],
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'contact_person' => 'nullable|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return response()->json($supplier);
    }

    /**
     * Supprimer un fournisseur.
     */
    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);

        // Vérifier s'il a des produits associés
        $hasProducts = Product::where('supplier_id', $id)->exists();
        
        if ($hasProducts) {
            return response()->json([
                'message' => 'Ce fournisseur a des produits associés. Veuillez d\'abord les réassigner.'
            ], 422);
        }

        $supplier->delete();

        return response()->json(['message' => 'Fournisseur supprimé avec succès']);
    }

    /**
     * Liste des produits d'un fournisseur.
     */
    public function products($id)
    {
        $supplier = Supplier::findOrFail($id);
        
        $products = Product::where('supplier_id', $id)
            ->with(['category:id,name', 'stocks'])
            ->paginate(20);

        return response()->json($products);
    }

    /**
     * Historique des commandes auprès d'un fournisseur.
     */
    public function purchaseHistory($id, Request $request)
    {
        $supplier = Supplier::findOrFail($id);

        $query = Purchase::where('supplier_id', $id)
            ->with(['items.product:id,name,sku', 'user:id,name']);

        // Filtrer par période
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Filtrer par statut de paiement
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $purchases = $query->latest()->paginate(20);

        return response()->json($purchases);
    }

    /**
     * Comparatif des prix fournisseurs pour un produit.
     */
    public function priceComparison(Request $request)
    {
        $productName = $request->get('product_name');
        
        if (!$productName) {
            return response()->json(['message' => 'Nom de produit requis'], 422);
        }

        $products = Product::where('name', 'like', '%' . $productName . '%')
            ->with('supplier:id,name')
            ->select('id', 'name', 'sku', 'supplier_id', 'cost_price', 'price')
            ->get()
            ->groupBy('supplier_id')
            ->map(function ($products, $supplierId) {
                return [
                    'supplier' => $products->first()->supplier?->name ?? 'N/A',
                    'products' => $products->map(function ($p) {
                        return [
                            'name' => $p->name,
                            'sku' => $p->sku,
                            'cost_price' => $p->cost_price,
                            'selling_price' => $p->price,
                        ];
                    }),
                ];
            });

        return response()->json($products->values());
    }
}
