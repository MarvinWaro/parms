<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use HasUlids, SoftDeletes;

    public $incrementing = false;   // string PK
    protected $keyType = 'string';

    protected $fillable = [
        'location',
    ];
}
