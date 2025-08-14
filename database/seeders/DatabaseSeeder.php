<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Keep your existing test user if you still want it
        User::factory()->create([
            'name'  => 'Test User',
            'email' => 'test@example.com',
        ]);

        // CHED Administrator account (idempotent)
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], // lookup by unique email
            [
                'name'              => 'Ched Admin',
                'password'          => Hash::make('12345678'),
                'email_verified_at' => now(), // optional, skip email verification
            ]
        );

        // Other seeders…
        $this->call([
            ConditionSeeder::class,
        ]);
    }
}
