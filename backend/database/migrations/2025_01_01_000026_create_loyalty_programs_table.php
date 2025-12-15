<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_programs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('customer_id');
            $table->integer('points_earned')->default(0);
            $table->integer('points_used')->default(0);
            $table->integer('points_balance')->default(0);
            $table->enum('transaction_type', ['earned', 'redeemed', 'expired']);
            $table->decimal('transaction_amount', 10, 2)->nullable();
            $table->string('reference')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_programs');
    }
};