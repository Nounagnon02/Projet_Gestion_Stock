<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_predictions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->enum('prediction_type', ['demand_forecast', 'reorder_point', 'price_optimization']);
            $table->json('input_data');
            $table->json('prediction_result');
            $table->decimal('confidence_score', 5, 4);
            $table->date('prediction_date');
            $table->date('target_date');
            $table->boolean('is_accurate')->nullable();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_predictions');
    }
};