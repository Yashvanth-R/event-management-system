'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '@/types';
import { eventApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AttendeeForm } from '@/components/AttendeeForm';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.id as string);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventApi.getEvent(eventId);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading the event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false);
    // Refresh event data to update attendee count
    if (event) {
      eventApi.getEvent(event.id).then((response) => {
        if (response.success && response.data) {
          setEvent(response.data);
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error || 'Event not found'}</div>
        <Button onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="h-6 w-6" />
            {event.name}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            {event.location}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-1" />
                <div>
                  <div className="font-medium">Event Schedule</div>
                  <div className="text-sm text-muted-foreground">
                    <div>Start: {formatDateTime(event.start_time)}</div>
                    <div>End: {formatDateTime(event.end_time)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 mt-1" />
                <div>
                  <div className="font-medium">Attendance</div>
                  <div className="text-sm text-muted-foreground">
                    {event.current_attendees} / {event.max_capacity} registered
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(event.current_attendees / event.max_capacity) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline">
                  <Link href={`/events/${event.id}/attendees`}>
                    View Attendees ({event.current_attendees})
                  </Link>
                </Button>
                
                {event.has_capacity ? (
                  <Button onClick={() => setShowRegistrationForm(!showRegistrationForm)}>
                    {showRegistrationForm ? 'Hide Registration' : 'Register for Event'}
                  </Button>
                ) : (
                  <Button disabled>
                    Event Full
                  </Button>
                )}
              </div>
              
              {!event.has_capacity && (
                <div className="text-red-600 text-sm">
                  This event has reached maximum capacity
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showRegistrationForm && event.has_capacity && (
        <AttendeeForm 
          event={event} 
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}