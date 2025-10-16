<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'registered_at' => $this->registered_at->toISOString(),
            'formatted_registered_at' => $this->formatted_registered_at,
            'event' => new EventResource($this->whenLoaded('event'))
        ];
    }
}