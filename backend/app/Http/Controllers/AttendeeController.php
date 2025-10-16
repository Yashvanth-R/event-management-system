<?php

namespace App\Http\Controllers;

use App\Services\AttendeeService;
use App\Http\Requests\RegisterAttendeeRequest;
use App\Http\Resources\AttendeeResource;
use App\Exceptions\EventCapacityExceededException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendeeController extends Controller
{
    public function __construct(
        private AttendeeService $attendeeService
    ) {}

    /**
     * @OA\Post(
     *     path="/api/events/{event_id}/register",
     *     summary="Register an attendee for an event",
     *     tags={"Attendees"},
     *     @OA\Parameter(
     *         name="event_id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Attendee registered successfully"),
     *     @OA\Response(response=409, description="Event capacity exceeded or duplicate registration"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function register(int $eventId, RegisterAttendeeRequest $request): JsonResponse
    {
        try {
            $attendee = $this->attendeeService->registerAttendee($eventId, $request);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully registered for the event',
                'data' => new AttendeeResource($attendee)
            ], 201);
        } catch (EventCapacityExceededException $e) {
            return $e->render();
        } catch (\Exception $e) {
            $statusCode = $e->getCode() === 404 ? 404 : ($e->getCode() === 409 ? 409 : 500);
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error_code' => $statusCode === 409 ? 'DUPLICATE_REGISTRATION' : 'REGISTRATION_FAILED'
            ], $statusCode);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/events/{event_id}/attendees",
     *     summary="Get all attendees for an event",
     *     tags={"Attendees"},
     *     @OA\Parameter(
     *         name="event_id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         @OA\Schema(type="integer", default=15, maximum=100)
     *     ),
     *     @OA\Response(response=200, description="List of attendees"),
     *     @OA\Response(response=404, description="Event not found")
     * )
     */
    public function index(int $eventId, Request $request): JsonResponse
    {
        try {
            $perPage = min($request->get('per_page', 15), 100);
            $attendees = $this->attendeeService->getEventAttendees($eventId, $perPage);
            
            return response()->json([
                'success' => true,
                'message' => 'Attendees retrieved successfully',
                'data' => AttendeeResource::collection($attendees->items()),
                'pagination' => [
                    'current_page' => $attendees->currentPage(),
                    'last_page' => $attendees->lastPage(),
                    'per_page' => $attendees->perPage(),
                    'total' => $attendees->total(),
                    'from' => $attendees->firstItem(),
                    'to' => $attendees->lastItem()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve attendees',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}