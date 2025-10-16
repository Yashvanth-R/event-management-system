<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Attendee;
use App\Http\Requests\RegisterAttendeeRequest;
use App\Exceptions\EventCapacityExceededException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class AttendeeService
{
    public function __construct(
        private EventService $eventService
    ) {}

    public function registerAttendee(int $eventId, RegisterAttendeeRequest $request): Attendee
    {
        $event = $this->eventService->findEvent($eventId);
        
        if (!$event) {
            throw new \Exception('Event not found', 404);
        }

        if (!$event->hasCapacity()) {
            throw new EventCapacityExceededException(
                "Event '{$event->name}' has reached maximum capacity of {$event->max_capacity} attendees"
            );
        }

        $validated = $request->validated();
        
        // Check for duplicate registration
        $existingAttendee = Attendee::where('event_id', $eventId)
            ->where('email', $validated['email'])
            ->first();
            
        if ($existingAttendee) {
            throw new \Exception('This email is already registered for this event', 409);
        }

        $attendee = Attendee::create([
            'event_id' => $eventId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'registered_at' => Carbon::now()
        ]);

        // Update event capacity
        $this->eventService->updateEventCapacity($event);

        return $attendee->load('event');
    }

    public function getEventAttendees(int $eventId, int $perPage = 15): LengthAwarePaginator
    {
        return Attendee::where('event_id', $eventId)
            ->with('event')
            ->orderBy('registered_at', 'desc')
            ->paginate($perPage);
    }

    public function getAllEventAttendees(int $eventId): Collection
    {
        return Attendee::where('event_id', $eventId)
            ->with('event')
            ->orderBy('registered_at', 'desc')
            ->get();
    }
}