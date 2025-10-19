'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { eventApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Loader2, AlertCircle, Users } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getEvents();
        if (response.success && response.data) {
          setEvents(response.data);
        } else {
          setError('Failed to load events');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Events</h2>
        <p className="text-gray-600">Finding amazing events for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Events</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Manage and organize your events</p>
        </div>
        <Link 
          href="/create-event" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '500',
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
          <Plus style={{ width: '16px', height: '16px' }} />
          Create Event
        </Link>
      </div>

      {/* Events Table */}
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}
      >
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div 
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}
            >
              <Plus style={{ width: '40px', height: '40px', color: '#2563eb' }} />
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>No Events Yet</h2>
            <p style={{ color: '#6b7280', margin: '0 0 32px 0', fontSize: '18px' }}>
              Be the first to create an amazing event!
            </p>
            <Link 
              href="/create-event" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '500',
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              <Plus style={{ width: '20px', height: '20px' }} />
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead 
                style={{
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <tr>
                  <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>Name</th>
                  <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>Location</th>
                  <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '18%' }}>Start Time</th>
                  <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '18%' }}>End Time</th>
                  <th style={{ padding: '20px 24px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '12%' }}>Capacity</th>
                  <th style={{ padding: '20px 24px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '7%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr 
                    key={event.id} 
                    style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: '20px 24px', width: '25%' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', marginRight: '10px', flexShrink: 0 }}></div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '14px', color: '#4b5563', fontWeight: '500', width: '20%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {event.location}
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '14px', color: '#4b5563', width: '18%' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>{formatDate(event.start_time)}</div>
                        <div 
                          style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            background: '#f3f4f6',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {formatTime(event.start_time)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '14px', color: '#4b5563', width: '18%' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>{formatDate(event.end_time)}</div>
                        <div 
                          style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            background: '#f3f4f6',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            display: 'inline-block'
                          }}
                        >
                          {formatTime(event.end_time)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', width: '12%', textAlign: 'center' }}>
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: '#dcfce7',
                          color: '#166534',
                          minWidth: '70px'
                        }}
                      >
                        {event.max_capacity}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', width: '7%', textAlign: 'center' }}>
                      <Link 
                        href={`/events/${event.id}/attendees`} 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 12px',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          minWidth: '100px'
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
                        <Users style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}