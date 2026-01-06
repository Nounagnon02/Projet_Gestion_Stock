<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with(['supplier', 'warehouse', 'user', 'items.product']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('purchase_number', 'like', "%{$search}%")
                  ->orWhereHas('supplier', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'status' => 'required|in:pending,received,ordered,cancelled',
            'notes' => 'nullable|string',
            'expected_date' => 'nullable|date',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $subtotal = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['unit_cost'];
            });

            $discount = $validated['discount_amount'] ?? 0;
            $tax = $validated['tax_amount'] ?? 0;
            $total = $subtotal - $discount + $tax;

            $purchase = Purchase::create([
                'purchase_number' => 'PUR-' . strtoupper(Str::random(8)),
                'supplier_id' => $validated['supplier_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'user_id' => $request->user()->id,
                'subtotal' => $subtotal,
                'tax_amount' => $tax,
                'discount_amount' => $discount,
                'total_amount' => $total,
                'status' => $validated['status'],
                'notes' => $validated['notes'],
                'expected_date' => $validated['expected_date'],
            ]);

            foreach ($validated['items'] as $item) {
                $purchaseItem = $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'total_cost' => $item['quantity'] * $item['unit_cost'],
                ]);

                if ($validated['status'] === 'received') {
                    $this->updateStock($purchase, $purchaseItem);
                }
            }

            return response()->json($purchase->load('items.product'), 201);
        });
    }

    public function show(Purchase $purchase)
    {
        return response()->json($purchase->load(['supplier', 'warehouse', 'user', 'items.product', 'payments']));
    }

    public function updateStatus(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,received,ordered,cancelled',
        ]);

        if ($purchase->status === 'received' && $validated['status'] !== 'received') {
            return response()->json(['message' => 'Cannot change status of a received purchase'], 422);
        }

        return DB::transaction(function () use ($purchase, $validated) {
            $oldStatus = $purchase->status;
            $purchase->update(['status' => $validated['status']]);

            if ($oldStatus !== 'received' && $validated['status'] === 'received') {
                foreach ($purchase->items as $item) {
                    $this->updateStock($purchase, $item);
                }
            }

            return response()->json($purchase);
        });
    }

    private function updateStock($purchase, $item)
    {
        $stock = Stock::firstOrCreate(
            ['product_id' => $item->product_id, 'warehouse_id' => $purchase->warehouse_id],
            ['quantity' => 0]
        );

        $prevQty = $stock->quantity;
        $stock->increment('quantity', $item->quantity);

        StockMovement::create([
            'product_id' => $item->product_id,
            'warehouse_id' => $purchase->warehouse_id,
            'type' => 'in',
            'quantity' => $item->quantity,
            'previous_quantity' => $prevQty,
            'new_quantity' => $stock->fresh()->quantity,
            'unit_cost' => $item->unit_cost,
            'reference_type' => Purchase::class,
            'reference_id' => $purchase->id,
            'user_id' => $purchase->user_id,
        ]);

        // Update product cost price (simplified WAC if needed hereafter)
        $product = Product::find($item->product_id);
        $product->update(['cost_price' => $item->unit_cost]);
    }
}
