<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Event;
use Carbon\Carbon;

class AttendeeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'registered_at' => Carbon::now()
        ];
    }
}