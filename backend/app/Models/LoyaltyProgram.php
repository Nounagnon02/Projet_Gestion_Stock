<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoyaltyProgram extends Model
{
    use HasUuids;

    protected $fillable = [
        'customer_id', 'points_earned', 'points_used', 'points_balance',
        'transaction_type', 'transaction_amount', 'reference', 'description'
    ];

    protected $casts = [
        'transaction_amount' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}