<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\ConditionController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Main authenticated group using standard Laravel auth (not Sanctum)
Route::middleware(['auth', 'verified'])->group(function () {

    // ==========================================
    // SHARED ROUTES - Available to ALL authenticated users (admin, staff)
    // ==========================================
    
    // Add any shared routes here if needed in the future
    
    // ==========================================
    // ADMIN ROUTES
    // ==========================================
    Route::middleware(['role:admin'])->group(function () {
        
        // Admin Dashboard (your existing dashboard with charts and analytics)
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Location Management (admin only)
        Route::get('/location', [LocationController::class, 'index'])->name('location.index');
        Route::post('/location', [LocationController::class, 'store'])->name('location.store');
        Route::patch('/location/{location}', [LocationController::class, 'update'])->name('location.update');
        Route::delete('/location/{location}', [LocationController::class, 'destroy'])->name('location.destroy');

        // Condition Management (admin only)
        Route::get('/condition', [ConditionController::class, 'index'])->name('condition.index');
        Route::post('/condition', [ConditionController::class, 'store'])->name('condition.store');
        Route::patch('/condition/{condition}', [ConditionController::class, 'update'])->name('condition.update');
        Route::delete('/condition/{condition}', [ConditionController::class, 'destroy'])->name('condition.destroy');

        // Property Management (admin only)
        Route::get('/property', [PropertyController::class, 'index'])->name('properties.index');
        Route::post('/property', [PropertyController::class, 'store'])->name('properties.store');
        Route::get('/property/{property}', [PropertyController::class, 'show'])->name('properties.show');
        Route::patch('/property/{property}', [PropertyController::class, 'update'])->name('properties.update');
        Route::delete('/property/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');
    });

    // ==========================================
    // STAFF ROUTES
    // ==========================================
    Route::middleware(['role:staff'])->group(function () {
        
        // Staff Dashboard (simple welcome dashboard)
        Route::get('/staff-dashboard', function () {
            return Inertia::render('StaffDashboard');
        })->name('staff.dashboard');
        
        // Add any staff-specific routes here in the future
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';