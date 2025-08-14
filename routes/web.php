<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\ConditionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    // Controller-driven page
    Route::get('/location', [LocationController::class, 'index'])->name('location.index');
    Route::post('/location', [LocationController::class, 'store'])->name('location.store');
    Route::patch('/location/{location}', [LocationController::class, 'update'])->name('location.update');
    Route::delete('/location/{location}', [LocationController::class, 'destroy'])->name('location.destroy');

    // Condition routes
    Route::get('/condition', [ConditionController::class, 'index'])->name('condition.index');
    Route::post('/condition', [ConditionController::class, 'store'])->name('condition.store');
    Route::patch('/condition/{condition}', [ConditionController::class, 'update'])->name('condition.update');
    Route::delete('/condition/{condition}', [ConditionController::class, 'destroy'])->name('condition.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
