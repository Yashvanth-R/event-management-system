'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_time: '',
    end_time: '',
    capacity: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
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
              style={{
                flex: 1,
                height: '48px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(37, 99, 235, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(37, 99, 235, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Create Event
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