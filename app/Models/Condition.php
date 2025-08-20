<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Condition extends Model
{
    use HasUlids, SoftDeletes;

    public $incrementing = false;   // string PK
    protected $keyType = 'string';

    protected $fillable = [
        'condition',
    ];

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    // Add accessor to get name (for compatibility with frontend)
    public function getNameAttribute()
    {
        return $this->condition;
    }
}
