<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Test User (staff role)
        User::factory()->create([
            'name'  => 'Test User',
            'email' => 'test@example.com',
            'role'  => 'staff', // Explicitly set role
        ]);

        // Admin User (admin role) - FIXED: Added role
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'], 
            [
                'name'              => 'Ched Admin',
                'password'          => Hash::make('12345678'),
                'role'              => 'admin', // ✅ FIXED: Explicitly set admin role
                'email_verified_at' => now(),
            ]
        );

        // Other seeders
        $this->call([
            ConditionSeeder::class,
            // Remove AdminUserSeeder::class to avoid duplicates
        ]);
    }
}