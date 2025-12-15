<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasUuids;

    protected $fillable = [
        'key', 'value', 'group', 'description', 'is_public'
    ];

    protected $casts = [
        'value' => 'json',
        'is_public' => 'boolean',
    ];
}