<?php

namespace App\Http\Controllers;

use App\Models\SaleItem;
use App\Models\Product;
use App\Models\AiPrediction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AIPredictionController extends Controller
{
    /**
     * Generate reorder recommendations based on sales history.
     */
    public function reorderRecommendations(Request $request)
    {
        $daysToAnalyze = $request->get('days', 30);
        $safetyLeadTime = $request->get('lead_time', 7); // Days it takes to receive order

        $products = Product::with(['stocks'])->get();
        $recommendations = [];

        foreach ($products as $product) {
            // Calculate Daily Sales Rate (DSR)
            $totalSold = SaleItem::where('product_id', $product->id)
                ->where('created_at', '>=', now()->subDays($daysToAnalyze))
                ->sum('quantity');

            $dsr = $totalSold / $daysToAnalyze;

            // Current Stock
            $currentStock = $product->stocks->sum('quantity');

            // Days until stock out
            $daysLeft = $dsr > 0 ? ($currentStock / $dsr) : 999;

            // Suggested Reorder
            $isAtRisk = $daysLeft <= $safetyLeadTime;
            
            if ($isAtRisk || $currentStock <= $product->min_stock) {
                // Calculate Economic Order Quantity (EOQ - simplified)
                // We'll suggest a quantity to cover the next 30 days
                $suggestedQty = ceil($dsr * 30);

                $recommendations[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'current_stock' => $currentStock,
                    'daily_sales_rate' => round($dsr, 2),
                    'days_remaining' => round($daysLeft, 1),
                    'suggested_quantity' => $suggestedQty,
                    'confidence_score' => $daysToAnalyze >= 30 ? 0.85 : 0.6,
                    'risk_level' => $daysLeft <= 3 ? 'high' : 'medium'
                ];
            }
        }

        return response()->json([
            'recommendations' => $recommendations,
            'analysis_period_days' => $daysToAnalyze,
        ]);
    }

    /**
     * Store a prediction for historical tracking.
     */
    public function storePrediction(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'prediction_result' => 'required|array',
            'confidence_score' => 'required|numeric',
        ]);

        $prediction = AiPrediction::create([
            'type' => $validated['type'],
            'input_data' => $request->get('input_data', []),
            'prediction_result' => $validated['prediction_result'],
            'confidence_score' => $validated['confidence_score'],
        ]);

        return response()->json($prediction, 201);
    }
}
