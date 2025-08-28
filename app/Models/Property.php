<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    protected $fillable = [
        'property_number',
        'item_name',
        'item_description',
        'serial_no',
        'model_no',
        'acquisition_date',
        'acquisition_cost',
        'unit_of_measure',
        'quantity_per_physical_count', // Added quantity field
        'fund',
        'location_id',
        'user_id',
        'condition_id',
        'remarks',
        'color',
    ];

    protected $casts = [
        'acquisition_date' => 'date',
        'acquisition_cost' => 'decimal:2',
        'quantity_per_physical_count' => 'integer', // Added quantity cast
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(Condition::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($property) {
            if (empty($property->property_number)) {
                $property->property_number = self::generatePropertyNumber();
            }
        });
    }

    public static function generatePropertyNumber(): string
    {
        $year = date('Y');
        $lastProperty = self::where('property_number', 'like', "PROP-{$year}-%")
            ->latest('property_number')
            ->first();

        if ($lastProperty) {
            $lastNumber = (int) substr($lastProperty->property_number, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return "PROP-{$year}-{$newNumber}";
    }

    /**
     * Generate QR code URL for this property
     * This remains constant regardless of property detail changes
     * Uses the ULID for permanent identification
     */
    public function getQRCodeUrl(): string
    {
        return url("/qr/{$this->id}");
    }
}
