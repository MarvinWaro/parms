<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ConditionSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $items = [
            'Serviceable — Good',
            'Serviceable — Needs minor repair',
            'Unserviceable — Repairable',
            'Unserviceable — Beyond economic repair (BER)',
            'Unserviceable — Obsolete/outmoded',
            'Unserviceable — For cannibalization',
            'Unserviceable — For scrap',
            'Missing/Not located',
        ];

        foreach ($items as $label) {
            // Look for an existing row (including soft-deleted ones)
            $existing = DB::table('conditions')
                ->where('condition', $label)
                ->first();

            if (! $existing) {
                // Insert new (ULID primary key must be provided)
                DB::table('conditions')->insert([
                    'id'         => (string) Str::ulid(),
                    'condition'  => $label,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'deleted_at' => null,
                ]);
            } else {
                // If it was soft-deleted, restore it
                if (! is_null($existing->deleted_at)) {
                    DB::table('conditions')
                        ->where('id', $existing->id)
                        ->update([
                            'deleted_at' => null,
                            'updated_at' => $now,
                        ]);
                }
            }
        }
    }
}
