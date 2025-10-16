<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class EventFactory extends Factory
{
    public function definition(): array
    {
        $startTime = Carbon::now()->addDays(rand(1, 30));
        $endTime = $startTime->copy()->addHours(rand(1, 8));

        return [
            'name' => $this->faker->sentence(3),
            'location' => $this->faker->address,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'max_capacity' => $this->faker->numberBetween(10, 500),
            'current_attendees' => 0
        ];
    }
}