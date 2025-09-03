<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\ConditionController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StaffDashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// PUBLIC QR CODE ROUTE - No authentication required
Route::get('/qr/{property}', [PropertyController::class, 'publicView'])->name('properties.public');

// Routes for authenticated users (both admin and staff)
Route::middleware(['auth', 'verified'])->group(function () {
    // Admin dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard')
        ->middleware('role:admin');

    // Staff dashboard
    Route::get('/staff-dashboard', [StaffDashboardController::class, 'index'])
        ->name('staff.dashboard')
        ->middleware('role:staff');

    // Property routes - accessible to both admin and staff
    // The PropertyController now automatically filters properties based on user role
    // Staff users see only properties assigned to them
    // Admin users see all properties
    Route::get('/property', [PropertyController::class, 'index'])->name('properties.index');
    Route::get('/property/bulk-data', [PropertyController::class, 'bulkData'])->name('properties.bulk-data');
    Route::get('/property/{property}', [PropertyController::class, 'show'])->name('properties.show');
});

// Admin-only routes for property management
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Property management - admin only
    Route::post('/property', [PropertyController::class, 'store'])->name('properties.store');
    Route::patch('/property/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/property/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');

    // Location management - admin only
    Route::get('/location', [LocationController::class, 'index'])->name('location.index');
    Route::post('/location', [LocationController::class, 'store'])->name('location.store');
    Route::patch('/location/{location}', [LocationController::class, 'update'])->name('location.update');
    Route::delete('/location/{location}', [LocationController::class, 'destroy'])->name('location.destroy');

    // Condition management - admin only
    Route::get('/condition', [ConditionController::class, 'index'])->name('condition.index');
    Route::post('/condition', [ConditionController::class, 'store'])->name('condition.store');
    Route::patch('/condition/{condition}', [ConditionController::class, 'update'])->name('condition.update');
    Route::delete('/condition/{condition}', [ConditionController::class, 'destroy'])->name('condition.destroy');

    // User management - admin only
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
