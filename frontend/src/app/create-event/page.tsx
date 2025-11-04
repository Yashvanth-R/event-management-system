'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { eventApi } from '@/lib/api';

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_time: '',
    end_time: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.name || !formData.location || !formData.start_time || !formData.end_time || !formData.capacity) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Convert capacity to number
      const capacity = parseInt(formData.capacity);
      if (isNaN(capacity) || capacity < 1) {
        setError('Capacity must be a valid number greater than 0');
        setLoading(false);
        return;
      }

      // Validate dates
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      
      if (startTime >= endTime) {
        setError('End time must be after start time');
        setLoading(false);
        return;
      }

      if (startTime <= new Date()) {
        setError('Start time must be in the future');
        setLoading(false);
        return;
      }

      // Create event data
      const eventData = {
        name: formData.name,
        location: formData.location,
        start_time: formData.start_time,
        end_time: formData.end_time,
        max_capacity: capacity
      };

      // Call API to create event
      const response = await eventApi.createEvent(eventData);

      if (response.success) {
        // Show success message briefly, then redirect
        setSuccess(true);
        setTimeout(() => {
          router.push('/events');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create event');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link 
          href="/events" 
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
            textDecoration: 'none',
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
        </Link>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Create New Event</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Fill in the details to create your event</p>
        </div>
      </div>

      {/* Form */}
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          padding: '32px',
          maxWidth: '768px'
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Error Message */}
          {error && (
            <div 
              style={{
                padding: '16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                color: '#dc2626',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div 
              style={{
                padding: '16px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                color: '#166534',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '16px' }}>✅</div>
              Event created successfully! Redirecting to events page...
            </div>
          )}

          {/* Row 1: Name and Location */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label 
                htmlFor="name" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}
              >
                <Calendar style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                Event Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter event name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label 
                htmlFor="location" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}
              >
                <MapPin style={{ width: '16px', height: '16px', color: '#059669' }} />
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter event location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Row 2: Start and End Time */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label 
                htmlFor="start_time" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}
              >
                <Clock style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
                Start Time
              </label>
              <input
                id="start_time"
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label 
                htmlFor="end_time" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}
              >
                <Clock style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
                End Time
              </label>
              <input
                id="end_time"
                name="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Row 3: Capacity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label 
              htmlFor="capacity" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}
            >
              <Users style={{ width: '16px', height: '16px', color: '#ea580c' }} />
              Capacity
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="Maximum number of attendees"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              style={{
                width: '100%',
                height: '48px',
                padding: '0 16px',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', paddingTop: '24px' }}>
            <button
              type="submit"
              disabled={loading || success}
              style={{
                flex: 1,
                height: '48px',
                background: (loading || success) ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (loading || success) ? 'not-allowed' : 'pointer',
                boxShadow: (loading || success) ? 'none' : '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(37, 99, 235, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(37, 99, 235, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading && (
                <div 
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}
                ></div>
              )}
              {loading ? 'Creating...' : success ? 'Created!' : 'Create Event'}
            </button>
            <Link 
              href="/events"
              style={{
                flex: 1,
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}