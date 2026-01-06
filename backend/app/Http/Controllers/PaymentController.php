<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Sale;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['payable', 'processedBy']);

        if ($request->has('method')) {
            $query->where('method', $request->method);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'payable_id' => 'required',
            'payable_type' => 'required|in:sale,purchase',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|in:cash,card,bank_transfer,check,mobile_money',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $modelClass = $validated['payable_type'] === 'sale' ? Sale::class : Purchase::class;
        $payable = $modelClass::findOrFail($validated['payable_id']);

        return DB::transaction(function () use ($validated, $payable, $request) {
            $payment = Payment::create([
                'payment_number' => 'PAY-' . strtoupper(Str::random(8)),
                'payable_type' => get_class($payable),
                'payable_id' => $payable->id,
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'status' => 'completed', // For now, direct completion
                'reference' => $validated['reference'],
                'notes' => $validated['notes'],
                'processed_by' => $request->user()->id,
            ]);

            // Update payable status or balance if needed
            // For example, if it's a sale and totally paid, you might want to update a 'payment_status' field if you add one later.
            
            return response()->json($payment, 201);
        });
    }

    public function show(Payment $payment)
    {
        return response()->json($payment->load(['payable', 'processedBy']));
    }
}
