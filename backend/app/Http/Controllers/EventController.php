<?php

namespace App\Http\Controllers;

use App\Services\EventService;
use App\Http\Requests\CreateEventRequest;
use App\Http\Resources\EventResource;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function __construct(
        private EventService $eventService
    ) {}

    /**
     * @OA\Post(
     *     path="/api/events",
     *     summary="Create a new event",
     *     tags={"Events"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","location","start_time","end_time","max_capacity"},
     *             @OA\Property(property="name", type="string", example="Tech Conference 2024"),
     *             @OA\Property(property="location", type="string", example="Convention Center"),
     *             @OA\Property(property="start_time", type="string", format="datetime", example="2024-12-01T10:00:00Z"),
     *             @OA\Property(property="end_time", type="string", format="datetime", example="2024-12-01T18:00:00Z"),
     *             @OA\Property(property="max_capacity", type="integer", example=100)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Event created successfully"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(CreateEventRequest $request): JsonResponse
    {
        try {
            $event = $this->eventService->createEvent($request);
            
            return response()->json([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => new EventResource($event)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/events",
     *     summary="Get all upcoming events",
     *     tags={"Events"},
     *     @OA\Response(response=200, description="List of upcoming events")
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $events = $this->eventService->getUpcomingEvents();
            
            return response()->json([
                'success' => true,
                'message' => 'Events retrieved successfully',
                'data' => EventResource::collection($events)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/events/{id}",
     *     summary="Get a specific event",
     *     tags={"Events"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Event details"),
     *     @OA\Response(response=404, description="Event not found")
     * )
     */
    public function show(int $id): JsonResponse
    {
        try {
            $event = $this->eventService->findEvent($id);
            
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Event retrieved successfully',
                'data' => new EventResource($event)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve event',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}