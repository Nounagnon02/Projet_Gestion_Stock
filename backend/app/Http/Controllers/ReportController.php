<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * KPIs consolidés pour le tableau de bord.
     */
    public function dashboard(Request $request)
    {
        $period = $request->get('period', 'today');
        $dateRange = $this->getDateRange($period);

        // Ventes de la période
        $sales = Sale::whereBetween('created_at', $dateRange)->get();
        $totalSales = $sales->sum('total_amount');
        $salesCount = $sales->count();

        // Bénéfice estimé
        $profit = SaleItem::whereHas('sale', function ($query) use ($dateRange) {
            $query->whereBetween('created_at', $dateRange);
        })->get()->sum(function ($item) {
            $costPrice = $item->product->cost_price ?? 0;
            return ($item->unit_price - $costPrice) * $item->quantity;
        });

        // Produits en alerte
        $lowStockProducts = Stock::where('quantity', '<=', DB::raw('COALESCE((SELECT min_stock FROM products WHERE products.id = stocks.product_id), 10)'))
            ->count();

        // Produits en rupture
        $outOfStock = Stock::where('quantity', '<=', 0)->count();

        // Valeur totale du stock
        $totalStockValue = Stock::join('products', 'stocks.product_id', '=', 'products.id')
            ->selectRaw('SUM(stocks.quantity * products.price) as total')
            ->value('total') ?? 0;

        // Tendance (comparaison avec la période précédente)
        $previousDateRange = $this->getPreviousDateRange($period);
        $previousSales = Sale::whereBetween('created_at', $previousDateRange)->sum('total_amount');
        $salesTrend = $previousSales > 0 
            ? (($totalSales - $previousSales) / $previousSales) * 100 
            : 0;

        return response()->json([
            'period' => $period,
            'total_sales' => $totalSales,
            'sales_count' => $salesCount,
            'profit' => $profit,
            'low_stock_count' => $lowStockProducts,
            'out_of_stock_count' => $outOfStock,
            'total_stock_value' => $totalStockValue,
            'sales_trend' => round($salesTrend, 2),
        ]);
    }

    /**
     * Rapport d'inventaire complet.
     */
    public function inventoryReport(Request $request)
    {
        $warehouseId = $request->get('warehouse_id');
        $categoryId = $request->get('category_id');

        $query = Stock::with(['product.category', 'warehouse']);

        if ($warehouseId) {
            $query->where('warehouse_id', $warehouseId);
        }

        if ($categoryId) {
            $query->whereHas('product', function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }

        $stocks = $query->get()->map(function ($stock) {
            return [
                'product_id' => $stock->product_id,
                'product_name' => $stock->product->name ?? 'N/A',
                'sku' => $stock->product->sku ?? 'N/A',
                'category' => $stock->product->category->name ?? 'N/A',
                'warehouse' => $stock->warehouse->name ?? 'N/A',
                'quantity' => $stock->quantity,
                'unit_price' => $stock->product->price ?? 0,
                'total_value' => $stock->quantity * ($stock->product->price ?? 0),
                'alert_threshold' => $stock->product->min_stock ?? 10,
                'status' => $this->getStockStatus($stock),
            ];
        });

        $totalValue = $stocks->sum('total_value');
        $totalItems = $stocks->sum('quantity');

        return response()->json([
            'stocks' => $stocks,
            'summary' => [
                'total_products' => $stocks->count(),
                'total_items' => $totalItems,
                'total_value' => $totalValue,
            ]
        ]);
    }

    /**
     * Rapport des ventes par période.
     */
    public function salesReport(Request $request)
    {
        $period = $request->get('period', 'month');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        if ($startDate && $endDate) {
            $dateRange = [$startDate, $endDate . ' 23:59:59'];
        } else {
            $dateRange = $this->getDateRange($period);
        }

        // Ventes groupées par jour
        $salesByDay = Sale::whereBetween('created_at', $dateRange)
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top vendeurs (cashiers)
        $topCashiers = Sale::whereBetween('created_at', $dateRange)
            ->with('user:id,name')
            ->selectRaw('user_id, SUM(total_amount) as total, COUNT(*) as count')
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Résumé
        $totalAmount = $salesByDay->sum('total');
        $totalCount = $salesByDay->sum('count');
        $avgTransaction = $totalCount > 0 ? $totalAmount / $totalCount : 0;

        return response()->json([
            'period' => $period,
            'date_range' => $dateRange,
            'sales_by_day' => $salesByDay,
            'top_cashiers' => $topCashiers,
            'summary' => [
                'total_amount' => $totalAmount,
                'transaction_count' => $totalCount,
                'average_transaction' => round($avgTransaction, 2),
            ]
        ]);
    }

    /**
     * Rapport des profits.
     */
    public function profitReport(Request $request)
    {
        $period = $request->get('period', 'month');
        $dateRange = $this->getDateRange($period);

        $profitByProduct = SaleItem::whereHas('sale', function ($query) use ($dateRange) {
            $query->whereBetween('created_at', $dateRange);
        })
        ->with('product:id,name,sku,cost_price')
        ->selectRaw('product_id, SUM(quantity) as qty_sold, SUM(total_price) as revenue')
        ->groupBy('product_id')
        ->get()
        ->map(function ($item) {
            $costPrice = $item->product->cost_price ?? 0;
            $cost = $costPrice * $item->qty_sold;
            $profit = $item->revenue - $cost;
            
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name ?? 'N/A',
                'sku' => $item->product->sku ?? 'N/A',
                'qty_sold' => $item->qty_sold,
                'revenue' => $item->revenue,
                'cost' => $cost,
                'profit' => $profit,
                'margin' => $item->revenue > 0 ? round(($profit / $item->revenue) * 100, 2) : 0,
            ];
        })
        ->sortByDesc('profit')
        ->values();

        $totalRevenue = $profitByProduct->sum('revenue');
        $totalCost = $profitByProduct->sum('cost');
        $totalProfit = $profitByProduct->sum('profit');

        return response()->json([
            'period' => $period,
            'products' => $profitByProduct,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_cost' => $totalCost,
                'total_profit' => $totalProfit,
                'margin_percentage' => $totalRevenue > 0 ? round(($totalProfit / $totalRevenue) * 100, 2) : 0,
            ]
        ]);
    }

    /**
     * Top produits vendus.
     */
    public function topProducts(Request $request)
    {
        $period = $request->get('period', 'month');
        $limit = $request->get('limit', 10);
        $dateRange = $this->getDateRange($period);

        $topProducts = SaleItem::whereHas('sale', function ($query) use ($dateRange) {
            $query->whereBetween('created_at', $dateRange);
        })
        ->with('product:id,name,sku,price')
        ->selectRaw('product_id, SUM(quantity) as total_qty, SUM(total_price) as total_revenue')
        ->groupBy('product_id')
        ->orderByDesc('total_qty')
        ->limit($limit)
        ->get()
        ->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'name' => $item->product->name ?? 'N/A',
                'sku' => $item->product->sku ?? 'N/A',
                'quantity_sold' => $item->total_qty,
                'revenue' => $item->total_revenue,
            ];
        });

        return response()->json([
            'period' => $period,
            'top_products' => $topProducts,
        ]);
    }

    /**
     * Ventes par catégorie.
     */
    public function salesByCategory(Request $request)
    {
        $period = $request->get('period', 'month');
        $dateRange = $this->getDateRange($period);

        $salesByCategory = SaleItem::whereHas('sale', function ($query) use ($dateRange) {
            $query->whereBetween('created_at', $dateRange);
        })
        ->join('products', 'sale_items.product_id', '=', 'products.id')
        ->join('categories', 'products.category_id', '=', 'categories.id')
        ->selectRaw('categories.id as category_id, categories.name as category_name, SUM(sale_items.quantity) as total_qty, SUM(sale_items.total_price) as total_revenue')
        ->groupBy('categories.id', 'categories.name')
        ->orderByDesc('total_revenue')
        ->get();

        $totalRevenue = $salesByCategory->sum('total_revenue');

        $categoriesWithPercentage = $salesByCategory->map(function ($item) use ($totalRevenue) {
            return [
                'category_id' => $item->category_id,
                'category_name' => $item->category_name,
                'quantity_sold' => $item->total_qty,
                'revenue' => $item->total_revenue,
                'percentage' => $totalRevenue > 0 ? round(($item->total_revenue / $totalRevenue) * 100, 2) : 0,
            ];
        });

        return response()->json([
            'period' => $period,
            'categories' => $categoriesWithPercentage,
            'total_revenue' => $totalRevenue,
        ]);
    }

    // Helpers
    private function getDateRange($period)
    {
        $now = now();

        return match ($period) {
            'today' => [$now->startOfDay()->toDateTimeString(), $now->endOfDay()->toDateTimeString()],
            'yesterday' => [$now->subDay()->startOfDay()->toDateTimeString(), $now->endOfDay()->toDateTimeString()],
            'week' => [$now->startOfWeek()->toDateTimeString(), $now->endOfWeek()->toDateTimeString()],
            'month' => [$now->startOfMonth()->toDateTimeString(), $now->endOfMonth()->toDateTimeString()],
            'year' => [$now->startOfYear()->toDateTimeString(), $now->endOfYear()->toDateTimeString()],
            default => [$now->startOfMonth()->toDateTimeString(), $now->endOfMonth()->toDateTimeString()],
        };
    }

    private function getPreviousDateRange($period)
    {
        $now = now();

        return match ($period) {
            'today' => [$now->subDay()->startOfDay()->toDateTimeString(), $now->subDay()->endOfDay()->toDateTimeString()],
            'week' => [$now->subWeek()->startOfWeek()->toDateTimeString(), $now->subWeek()->endOfWeek()->toDateTimeString()],
            'month' => [$now->subMonth()->startOfMonth()->toDateTimeString(), $now->subMonth()->endOfMonth()->toDateTimeString()],
            'year' => [$now->subYear()->startOfYear()->toDateTimeString(), $now->subYear()->endOfYear()->toDateTimeString()],
            default => [$now->subMonth()->startOfMonth()->toDateTimeString(), $now->subMonth()->endOfMonth()->toDateTimeString()],
        };
    }

    private function getStockStatus($stock)
    {
        $threshold = $stock->product->min_stock ?? 10;
        
        if ($stock->quantity <= 0) {
            return 'out_of_stock';
        } elseif ($stock->quantity <= $threshold) {
            return 'low_stock';
        }
        return 'in_stock';
    }
}
