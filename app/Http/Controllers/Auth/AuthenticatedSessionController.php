<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */

    // In AuthenticatedSessionController.php - Update the store method:

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        // prevent cross-role 403s caused by stale intended URLs
        $request->session()->forget('url.intended');

        /** @var \App\Models\User $user */
        $user = $request->user();

        return $user->isAdmin()
            ? redirect()->route('dashboard')
            : redirect()->route('staff.dashboard');
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Redirect user based on their role
     */
    private function redirectBasedOnRole(User $user): RedirectResponse
    {
        return match($user->role) {
            User::ROLE_ADMIN => redirect()->intended(route('dashboard', absolute: false)),
            User::ROLE_STAFF => redirect()->intended(route('staff.dashboard', absolute: false)),
            default => redirect()->intended(route('dashboard', absolute: false)),
        };
    }
}
