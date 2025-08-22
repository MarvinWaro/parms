<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $users = User::select('id', 'name', 'email', 'created_at')
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->format('M j, Y'),
                    'avatar' => $this->generateAvatar($user->name),
                ];
            });

        return Inertia::render('dashboard', [ // Change 'Dashboard' to 'dashboard'
            'users' => $users,
        ]);
    }

    private function generateAvatar(string $name): string
    {
        $initials = collect(explode(' ', $name))
            ->map(fn($word) => strtoupper(substr($word, 0, 1)))
            ->take(2)
            ->implode('');

        return $initials;
    }
}
