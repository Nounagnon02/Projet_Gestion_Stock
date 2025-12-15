<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiPrediction extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id', 'prediction_type', 'input_data', 'prediction_result',
        'confidence_score', 'prediction_date', 'target_date', 'is_accurate'
    ];

    protected $casts = [
        'input_data' => 'json',
        'prediction_result' => 'json',
        'confidence_score' => 'decimal:4',
        'prediction_date' => 'date',
        'target_date' => 'date',
        'is_accurate' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}