'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Loader2, Users, UserPlus } from 'lucide-react';
import { attendeeApi, eventApi } from '@/lib/api';
import { Event } from '@/types';

export default function CreateAttendeePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventId: ''
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getEvents();
        if (response.success) {
          setEvents(response.data);
        } else {
          setError('Failed to load events');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load events');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.eventId) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await attendeeApi.createAttendee({
        name: formData.name.trim(),
        email: formData.email.trim(),
        eventId: parseInt(formData.eventId)
      });

      if (response.success) {
        router.push('/attendees');
      } else {
        setError(response.message || 'Failed to create attendee');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating attendee');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  if (eventsLoading) {
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
          <Loader2 style={{ width: '32px', height: '32px', color: '#2563eb', animation: 'spin 1s linear infinite' }} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Loading Events</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Getting available events...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Add New Attendee</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Create a new attendee and assign them to an event</p>
        </div>
        <Link 
          href="/attendees" 
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
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Attendees
        </Link>
      </div>

      {/* Form */}
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden',
          maxWidth: '600px'
        }}
      >
        <div 
          style={{
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            padding: '24px 32px',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserPlus style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>Attendee Information</h2>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Fill in the details below to create a new attendee</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Name Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="name" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter attendee's full name"
                required
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="email" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter attendee's email address"
                required
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            {/* Event Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="eventId" style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Select Event *
              </Label>
              <select
                id="eventId"
                value={formData.eventId}
                onChange={(e) => handleInputChange('eventId', e.target.value)}
                required
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <option value="">Choose an event...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.start_time).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                style={{
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '14px'
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  Creating Attendee...
                </>
              ) : (
                <>
                  <UserPlus style={{ width: '20px', height: '20px' }} />
                  Create Attendee
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}