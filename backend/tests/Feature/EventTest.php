<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Event;
use Carbon\Carbon;

class EventTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_can_create_event()
    {
        $eventData = [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'start_time' => Carbon::now()->addDays(1)->toISOString(),
            'end_time' => Carbon::now()->addDays(1)->addHours(2)->toISOString(),
            'max_capacity' => 100
        ];

        $response = $this->postJson('/api/events', $eventData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Event created successfully'
                ]);

        $this->assertDatabaseHas('events', [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'max_capacity' => 100
        ]);
    }

    public function test_cannot_create_event_with_past_start_time()
    {
        $eventData = [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'start_time' => Carbon::now()->subHours(1)->toISOString(),
            'end_time' => Carbon::now()->addHours(1)->toISOString(),
            'max_capacity' => 100
        ];

        $response = $this->postJson('/api/events', $eventData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['start_time']);
    }

    public function test_cannot_create_event_with_end_time_before_start_time()
    {
        $eventData = [
            'name' => 'Test Event',
            'location' => 'Test Location',
            'start_time' => Carbon::now()->addHours(2)->toISOString(),
            'end_time' => Carbon::now()->addHours(1)->toISOString(),
            'max_capacity' => 100
        ];

        $response = $this->postJson('/api/events', $eventData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['end_time']);
    }

    public function test_can_get_upcoming_events()
    {
        // Create past event
        Event::factory()->create([
            'start_time' => Carbon::now()->subDays(1),
            'end_time' => Carbon::now()->subHours(1)
        ]);

        // Create upcoming event
        $upcomingEvent = Event::factory()->create([
            'start_time' => Carbon::now()->addDays(1),
            'end_time' => Carbon::now()->addDays(1)->addHours(2)
        ]);

        $response = $this->getJson('/api/events');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Events retrieved successfully'
                ])
                ->assertJsonCount(1, 'data');
    }

    public function test_can_get_specific_event()
    {
        $event = Event::factory()->create();

        $response = $this->getJson("/api/events/{$event->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $event->id,
                        'name' => $event->name
                    ]
                ]);
    }

    public function test_returns_404_for_non_existent_event()
    {
        $response = $this->getJson('/api/events/999');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Event not found'
                ]);
    }
}