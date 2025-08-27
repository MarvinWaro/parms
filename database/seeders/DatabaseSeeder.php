<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Keep your existing test user - make them staff
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => User::ROLE_STAFF, // or 'staff'
        ]);

        // CHED Administrator account (idempotent) - make them admin
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], // lookup by unique email
            [
                'name' => 'Ched Admin',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(), // optional, skip email verification
                'role' => User::ROLE_ADMIN, // or 'admin'
            ]
        );

        // Additional test staff user (optional)
        User::updateOrCreate(
            ['email' => 'staff@gmail.com'],
            [
                'name' => 'Staff User',
                'password' => Hash::make('12345678'),
                'email_verified_at' => now(),
                'role' => User::ROLE_STAFF, // or 'staff'
            ]
        );

        // Other seeders…
        $this->call([
            ConditionSeeder::class,
        ]);
    }
}
