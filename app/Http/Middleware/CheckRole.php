<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->role !== $role) {
            // Redirect based on user's actual role
            if ($request->user()) {
                if ($request->user()->role === 'admin') {
                    return redirect()->route('dashboard');
                } else {
                    return redirect()->route('staff.dashboard');
                }
            }
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}
