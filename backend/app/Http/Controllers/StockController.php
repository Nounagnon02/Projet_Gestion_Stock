<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'quantity' => 'required|integer', // Positive to add, negative to remove (or use type)
            'type' => 'required|in:in,out,adjustment',
            'reason' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $stock = Stock::firstOrCreate(
                [
                    'product_id' => $validated['product_id'],
                    'warehouse_id' => $validated['warehouse_id']
                ],
                ['quantity' => 0]
            );

            $previousQty = $stock->quantity;
            
            if ($validated['type'] === 'in') {
                $stock->increment('quantity', $validated['quantity']);
            } elseif ($validated['type'] === 'out') {
                $stock->decrement('quantity', $validated['quantity']);
            } else {
                // Adjustment: Set to specific quantity or relative? Assuming relative for now, or just use in/out
                // If adjustment means "set to X", logic changes. Let's assume quantity is the delta.
                if ($validated['quantity'] > 0) {
                     $stock->increment('quantity', $validated['quantity']);
                } else {
                     $stock->decrement('quantity', abs($validated['quantity']));
                }
            }

            StockMovement::create([
                'stock_id' => $stock->id,
                'user_id' => Auth::id(),
                'type' => $validated['type'],
                'quantity' => abs($validated['quantity']),
                'previous_quantity' => $previousQty,
                'new_quantity' => $stock->quantity,
                'reason' => $validated['reason'] ?? 'Manual Adjustment',
            ]);

            return response()->json($stock);
        });
    }

    public function alerts()
    {
        // Join with products to check against alert_threshold
        $lowStock = Stock::with(['product', 'warehouse'])
            ->whereHas('product', function ($query) {
                // Compare stock quantity with product alert_threshold
                // SQL-based comparison might be clearer: stocks.quantity <= products.alert_threshold
                $query->whereColumn('stocks.quantity', '<=', 'products.alert_threshold');
            })
            ->get();

        return response()->json($lowStock);
    }
}
