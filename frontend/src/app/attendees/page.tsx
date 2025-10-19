'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, AlertCircle, Users } from 'lucide-react';

interface Attendee {
  id: number;
  name: string;
  email: string;
  event_name: string;
  registered_at: string;
}

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading attendees data
    const fetchAttendees = async () => {
      try {
        // This would be replaced with actual API call
        setTimeout(() => {
          setAttendees([
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              event_name: 'Annual Conference',
              registered_at: '2025-10-15T10:00:00Z'
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              event_name: 'Workshop',
              registered_at: '2025-10-16T14:30:00Z'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading attendees');
        setLoading(false);
      }
    };

    fetchAttendees();
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
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Loading Attendees</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Getting attendee information...</p>
      </div>
    );
  }

  if (error) {
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
          <AlertCircle style={{ width: '32px', height: '32px', color: '#dc2626' }} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Something went wrong</h2>
        <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
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
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Attendees</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Manage event attendees and registrations</p>
        </div>
        <Link 
          href="/events" 
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
          Back to Events
        </Link>
      </div>

      {/* Attendees Table */}
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}
      >
        {attendees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div 
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}
            >
              <Users style={{ width: '40px', height: '40px', color: '#7c3aed' }} />
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>No Attendees Yet</h2>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '18px' }}>
              Attendees will appear here once they register for events.
            </p>
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
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event</th>
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr 
                    key={attendee.id} 
                    style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: '24px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '12px', height: '12px', background: '#7c3aed', borderRadius: '50%', marginRight: '12px' }}></div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{attendee.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>
                      {attendee.email}
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: '#dbeafe',
                          color: '#1e40af'
                        }}
                      >
                        {attendee.event_name}
                      </span>
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', color: '#4b5563' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{formatDate(attendee.registered_at)}</div>
                        <div 
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            background: '#f3f4f6',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            display: 'inline-block'
                          }}
                        >
                          {formatTime(attendee.registered_at)}
                        </div>
                      </div>
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