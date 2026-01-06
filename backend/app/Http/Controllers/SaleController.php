<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SaleController extends Controller
{
    public function index()
    {
        // Add filters for date, cashier, etc.
        return response()->json(Sale::with(['user', 'items.product'])->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'amount_paid' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $totalAmount = 0;
            $itemsData = [];

            // 1. Calculate totals and prepare items
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                // Check stock
                $stock = Stock::where('product_id', $product->id)
                              ->where('warehouse_id', $validated['warehouse_id'])
                              ->first();

                if (!$stock || $stock->quantity < $item['quantity']) {
                    throw new \Exception("Stock insufficient for product: {$product->name}");
                }

                $lineTotal = $product->price * $item['quantity'];
                $totalAmount += $lineTotal;

                $itemsData[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $lineTotal,
                ];
            }

            // 2. Create Sale
            $sale = Sale::create([
                'user_id' => Auth::id(), // Cashier
                'warehouse_id' => $validated['warehouse_id'],
                'customer_id' => $validated['customer_id'] ?? null,
                'total_amount' => $totalAmount,
                'status' => 'completed',
                'payment_status' => 'paid', // Simplification for MVP
                'invoice_number' => 'INV-' . time(),
            ]);

            // 3. Create Items and Deduct Stock
            foreach ($itemsData as $data) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $data['product']->id,
                    'quantity' => $data['quantity'],
                    'unit_price' => $data['unit_price'],
                    'total_price' => $data['total_price'],
                ]);

                // Update Stock
                $stock = Stock::where('product_id', $data['product']->id)
                              ->where('warehouse_id', $validated['warehouse_id'])
                              ->first();
                $previousQty = $stock->quantity;
                $stock->decrement('quantity', $data['quantity']);

                // Log Movement
                StockMovement::create([
                    'stock_id' => $stock->id,
                    'user_id' => Auth::id(),
                    'type' => 'out',
                    'quantity' => $data['quantity'],
                    'previous_quantity' => $previousQty,
                    'new_quantity' => $stock->quantity,
                    'reason' => 'Sale: ' . $sale->invoice_number,
                ]);
            }

            // 4. Record Payment (Simplified)
            $sale->payments()->create([
                'amount' => $validated['amount_paid'],
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'user_id' => Auth::id(),
            ]);

            return response()->json($sale->load('items'), 201);
        });
    }

    public function dailyReport()
    {
        $date = request('date', now()->toDateString());
        $sales = Sale::whereDate('created_at', $date)->get();
        
        $total = $sales->sum('total_amount');
        $count = $sales->count();

        return response()->json([
            'date' => $date,
            'total_sales' => $total,
            'transaction_count' => $count,
        ]);
    }
}
