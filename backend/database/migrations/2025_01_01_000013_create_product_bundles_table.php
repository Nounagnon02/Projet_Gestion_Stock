<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_bundles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('bundle_product_id');
            $table->uuid('child_product_id');
            $table->integer('quantity');
            $table->timestamps();

            $table->foreign('bundle_product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('child_product_id')->references('id')->on('products')->onDelete('cascade');
            $table->unique(['bundle_product_id', 'child_product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_bundles');
    }
};