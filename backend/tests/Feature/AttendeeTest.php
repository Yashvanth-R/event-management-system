<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Event;
use App\Models\Attendee;
use Carbon\Carbon;

class AttendeeTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_can_register_attendee_for_event()
    {
        $event = Event::factory()->create(['max_capacity' => 100]);
        
        $attendeeData = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson("/api/events/{$event->id}/register", $attendeeData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Successfully registered for the event'
                ]);

        $this->assertDatabaseHas('attendees', [
            'event_id' => $event->id,
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);
    }

    public function test_cannot_register_duplicate_email_for_same_event()
    {
        $event = Event::factory()->create(['max_capacity' => 100]);
        
        Attendee::factory()->create([
            'event_id' => $event->id,
            'email' => 'john@example.com'
        ]);

        $attendeeData = [
            'name' => 'Jane Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson("/api/events/{$event->id}/register", $attendeeData);

        $response->assertStatus(409)
                ->assertJson([
                    'success' => false,
                    'error_code' => 'DUPLICATE_REGISTRATION'
                ]);
    }

    public function test_cannot_register_when_event_at_capacity()
    {
        $event = Event::factory()->create(['max_capacity' => 1, 'current_attendees' => 1]);

        $attendeeData = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        $response = $this->postJson("/api/events/{$event->id}/register", $attendeeData);

        $response->assertStatus(409)
                ->assertJson([
                    'success' => false,
                    'error_code' => 'CAPACITY_EXCEEDED'
                ]);
    }

    public function test_can_get_event_attendees()
    {
        $event = Event::factory()->create();
        $attendees = Attendee::factory()->count(3)->create(['event_id' => $event->id]);

        $response = $this->getJson("/api/events/{$event->id}/attendees");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Attendees retrieved successfully'
                ])
                ->assertJsonCount(3, 'data');
    }

    public function test_attendee_list_pagination()
    {
        $event = Event::factory()->create();
        Attendee::factory()->count(20)->create(['event_id' => $event->id]);

        $response = $this->getJson("/api/events/{$event->id}/attendees?per_page=5");

        $response->assertStatus(200)
                ->assertJsonCount(5, 'data')
                ->assertJsonStructure([
                    'pagination' => [
                        'current_page',
                        'last_page',
                        'per_page',
                        'total'
                    ]
                ]);
    }

    public function test_registration_validation()
    {
        $event = Event::factory()->create();

        $response = $this->postJson("/api/events/{$event->id}/register", [
            'name' => '',
            'email' => 'invalid-email'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name', 'email']);
    }
}