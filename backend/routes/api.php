<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Products
    Route::apiResource('products', ProductController::class);
    Route::get('products/barcode/{barcode}', [ProductController::class, 'findByBarcode']);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Warehouses
    Route::apiResource('warehouses', WarehouseController::class);

    // Customers
    Route::apiResource('customers', CustomerController::class);
    Route::get('customers/{id}/history', [CustomerController::class, 'purchaseHistory']);
    Route::post('customers/{id}/balance', [CustomerController::class, 'adjustBalance']);

    // Suppliers
    Route::apiResource('suppliers', SupplierController::class);
    Route::get('suppliers/{id}/products', [SupplierController::class, 'products']);
    Route::get('suppliers/{id}/history', [SupplierController::class, 'purchaseHistory']);
    Route::get('suppliers/compare/prices', [SupplierController::class, 'priceComparison']);

    // Stock Management
    Route::post('stock/adjust', [StockController::class, 'adjust']);
    Route::get('stock/alerts', [StockController::class, 'alerts']);

    // Sales
    Route::post('sales', [SaleController::class, 'store']);
    Route::get('sales', [SaleController::class, 'index']);
    Route::get('sales/daily', [SaleController::class, 'dailyReport']);

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('dashboard', [ReportController::class, 'dashboard']);
        Route::get('inventory', [ReportController::class, 'inventoryReport']);
        Route::get('sales', [ReportController::class, 'salesReport']);
        Route::get('profit', [ReportController::class, 'profitReport']);
        Route::get('top-products', [ReportController::class, 'topProducts']);
        Route::get('by-category', [ReportController::class, 'salesByCategory']);
    });

    // Purchases
    Route::apiResource('purchases', App\Http\Controllers\PurchaseController::class);
    Route::patch('purchases/{purchase}/status', [App\Http\Controllers\PurchaseController::class, 'updateStatus']);

    // Payments
    Route::apiResource('payments', App\Http\Controllers\PaymentController::class);
    
    // Stock Transfers
    Route::apiResource('transfers', App\Http\Controllers\StockTransferController::class);
    Route::post('transfers/{transfer}/approve', [App\Http\Controllers\StockTransferController::class, 'approve']);

    // AI Intelligence
    Route::get('ai/recommendations', [App\Http\Controllers\AIPredictionController::class, 'reorderRecommendations']);
    Route::post('ai/predictions', [App\Http\Controllers\AIPredictionController::class, 'storePrediction']);

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('{id}', [NotificationController::class, 'destroy']);
    });
});
