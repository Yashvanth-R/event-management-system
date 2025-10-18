<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AttendeeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check route (simple test)
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now()->toISOString(),
        'timezone' => config('app.timezone')
    ]);
});

Route::middleware('api')->group(function () {
    // Event routes
    Route::prefix('events')->group(function () {
        Route::post('/', [EventController::class, 'store']);
        Route::get('/', [EventController::class, 'index']);
        Route::get('/{id}', [EventController::class, 'show']);
        
        // Attendee routes
        Route::post('/{event_id}/register', [AttendeeController::class, 'register']);
        Route::get('/{event_id}/attendees', [AttendeeController::class, 'index']);
    });
});