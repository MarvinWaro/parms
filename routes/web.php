<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\ConditionController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StaffDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

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
    Route::get('/property', [PropertyController::class, 'index'])->name('properties.index');
    Route::get('/property/{property}', [PropertyController::class, 'show'])->name('properties.show');
});

// Routes for staff and admin users
Route::middleware(['auth', 'verified', 'role:staff,admin'])->group(function () {
    // Property management - staff can create and update
    Route::post('/property', [PropertyController::class, 'store'])->name('properties.store');
    Route::patch('/property/{property}', [PropertyController::class, 'update'])->name('properties.update');
});

// Admin-only routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
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

    // Property deletion - admin only
    Route::delete('/property/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
