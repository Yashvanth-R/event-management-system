<?php

namespace App\Services;

use App\Models\Event;
use App\Http\Requests\CreateEventRequest;
use Illuminate\Database\Eloquent\Collection;
use Carbon\Carbon;

class EventService
{
    public function createEvent(CreateEventRequest $request): Event
    {
        $validated = $request->validated();
        
        // Convert times to UTC for storage, but keep timezone info
        $validated['start_time'] = Carbon::parse($validated['start_time'])->utc();
        $validated['end_time'] = Carbon::parse($validated['end_time'])->utc();
        
        return Event::create($validated);
    }

    public function getUpcomingEvents(): Collection
    {
        return Event::upcoming()
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getAllEvents(): Collection
    {
        return Event::orderBy('start_time', 'desc')->get();
    }

    public function findEvent(int $eventId): ?Event
    {
        return Event::find($eventId);
    }

    public function getEventWithAttendees(int $eventId): ?Event
    {
        return Event::with('attendees')->find($eventId);
    }

    public function updateEventCapacity(Event $event): void
    {
        $event->update([
            'current_attendees' => $event->attendees()->count()
        ]);
    }
}