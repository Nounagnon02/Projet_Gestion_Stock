<?php

namespace App\Http\Controllers;

use App\Models\StockTransfer;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockTransferController extends Controller
{
    public function index(Request $request)
    {
        $query = StockTransfer::with(['fromWarehouse', 'toWarehouse', 'user', 'approvedBy']);
        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_warehouse_id' => 'required|exists:warehouses,id|different:from_warehouse_id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        // Check if enough stock in from_warehouse
        $fromStock = Stock::where('product_id', $validated['product_id'])
            ->where('warehouse_id', $validated['from_warehouse_id'])
            ->first();

        if (!$fromStock || $fromStock->quantity < $validated['quantity']) {
            return response()->json(['message' => 'Insufficient stock in source warehouse'], 422);
        }

        return DB::transaction(function () use ($validated, $request, $fromStock) {
            $transfer = StockTransfer::create([
                'transfer_number' => 'TRF-' . strtoupper(Str::random(8)),
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'status' => 'pending',
                'notes' => $validated['notes'],
                'user_id' => $request->user()->id,
            ]);

            return response()->json($transfer, 201);
        });
    }

    public function approve(Request $request, StockTransfer $transfer)
    {
        if ($transfer->status !== 'pending') {
            return response()->json(['message' => 'Transfer is not pending'], 422);
        }

        return DB::transaction(function () use ($transfer, $request) {
            $fromStock = Stock::where('product_id', $transfer->product_id)
                ->where('warehouse_id', $transfer->from_warehouse_id)
                ->lockForUpdate()
                ->first();

            if ($fromStock->quantity < $transfer->quantity) {
                return response()->json(['message' => 'Insufficient stock during approval'], 422);
            }

            // Deduct from source
            $prevFromQty = $fromStock->quantity;
            $fromStock->decrement('quantity', $transfer->quantity);

            StockMovement::create([
                'product_id' => $transfer->product_id,
                'warehouse_id' => $transfer->from_warehouse_id,
                'type' => 'out',
                'quantity' => $transfer->quantity,
                'previous_quantity' => $prevFromQty,
                'new_quantity' => $fromStock->fresh()->quantity,
                'reference_type' => StockTransfer::class,
                'reference_id' => $transfer->id,
                'user_id' => $request->user()->id,
                'notes' => 'Stock transfer out',
            ]);

            // Add to destination
            $toStock = Stock::firstOrCreate(
                ['product_id' => $transfer->product_id, 'warehouse_id' => $transfer->to_warehouse_id],
                ['quantity' => 0]
            );
            
            $prevToQty = $toStock->quantity;
            $toStock->increment('quantity', $transfer->quantity);

            StockMovement::create([
                'product_id' => $transfer->product_id,
                'warehouse_id' => $transfer->to_warehouse_id,
                'type' => 'in',
                'quantity' => $transfer->quantity,
                'previous_quantity' => $prevToQty,
                'new_quantity' => $toStock->fresh()->quantity,
                'reference_type' => StockTransfer::class,
                'reference_id' => $transfer->id,
                'user_id' => $request->user()->id,
                'notes' => 'Stock transfer in',
            ]);

            $transfer->update([
                'status' => 'completed',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);

            return response()->json($transfer);
        });
    }
}
