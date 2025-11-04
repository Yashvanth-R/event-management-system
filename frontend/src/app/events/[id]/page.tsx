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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
        <div 
          style={{
            width: '64px',
            height: '64px',
            background: '#dbeafe',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}
        >
          <div style={{ width: '32px', height: '32px', border: '3px solid #2563eb', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Loading Event Details</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Getting event information...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
        <div 
          style={{
            width: '64px',
            height: '64px',
            background: '#fecaca',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}
        >
          <div style={{ fontSize: '32px' }}>⚠️</div>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Event Not Found</h2>
        <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>{error || 'The requested event could not be found'}</p>
        <button 
          onClick={() => router.back()}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => router.back()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#eff6ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Events
        </button>
      </div>

      {/* Event Details Card */}
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}
      >
        {/* Event Header */}
        <div style={{ padding: '32px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Calendar style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>{event.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '16px' }}>
                <MapPin style={{ width: '16px', height: '16px' }} />
                {event.location}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Schedule Info */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
                Event Schedule
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Start Time</div>
                  <div style={{ fontSize: '16px', color: '#111827' }}>{formatDate(event.start_time)}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{formatTime(event.start_time)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>End Time</div>
                  <div style={{ fontSize: '16px', color: '#111827' }}>{formatDate(event.end_time)}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{formatTime(event.end_time)}</div>
                </div>
              </div>
            </div>

            {/* Capacity Info */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users style={{ width: '20px', height: '20px', color: '#059669' }} />
                Attendance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Registered</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    {event.current_attendees} / {event.max_capacity}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%',
                      background: event.has_capacity ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#dc2626',
                      borderRadius: '4px',
                      width: `${(event.current_attendees / event.max_capacity) * 100}%`,
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
                
                <div style={{ fontSize: '14px', color: event.has_capacity ? '#059669' : '#dc2626', fontWeight: '500' }}>
                  {event.has_capacity ? `${event.remaining_capacity} spots remaining` : 'Event is full'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
            <Link 
              href={`/events/${event.id}/attendees`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.borderColor = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#bfdbfe';
              }}
            >
              <Users style={{ width: '16px', height: '16px' }} />
              View Attendees ({event.current_attendees})
            </Link>
            
            {event.has_capacity ? (
              <button 
                onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: showRegistrationForm ? '#f3f4f6' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: showRegistrationForm ? '#374151' : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!showRegistrationForm) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #047857 0%, #065f46 100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showRegistrationForm) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  }
                }}
              >
                {showRegistrationForm ? 'Hide Registration' : 'Register for Event'}
              </button>
            ) : (
              <button 
                disabled
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#f3f4f6',
                  color: '#9ca3af',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'not-allowed'
                }}
              >
                Event Full
              </button>
            )}
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