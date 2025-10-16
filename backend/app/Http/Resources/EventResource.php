<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'location' => $this->location,
            'start_time' => $this->start_time->toISOString(),
            'end_time' => $this->end_time->toISOString(),
            'formatted_start_time' => $this->formatted_start_time,
            'formatted_end_time' => $this->formatted_end_time,
            'max_capacity' => $this->max_capacity,
            'current_attendees' => $this->current_attendees,
            'remaining_capacity' => $this->remaining_capacity,
            'has_capacity' => $this->hasCapacity(),
            'is_upcoming' => $this->isUpcoming(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString()
        ];
    }
}