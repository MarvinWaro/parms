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
        'quantity_per_physical_count',
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
        'quantity_per_physical_count' => 'integer',
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
     *
     * IMPORTANT: This URL remains PERMANENT for the lifetime of the property.
     * - Uses only the ULID (never changes)
     * - Physical QR stickers never need replacement
     * - Property details can be updated freely
     * - Scanning always shows current data via public route
     *
     * @return string Permanent QR code URL
     */
    public function getQRCodeUrl(): string
    {
        return url("/qr/{$this->id}");
    }

    /**
     * Check if this property's QR code has been printed
     * (Optional: you could track this if needed)
     */
    public function isQRCodePrinted(): bool
    {
        // Could add a 'qr_printed_at' timestamp field if you want to track this
        return true; // For now, assume all can be printed
    }

    /**
     * Get a human-readable identifier for this property
     */
    public function getDisplayName(): string
    {
        return "{$this->item_name} ({$this->property_number})";
    }
}
