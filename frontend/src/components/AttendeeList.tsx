'use client';

import { useState, useEffect } from 'react';
import { Attendee, Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { eventApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { Users, Mail, Calendar } from 'lucide-react';

interface AttendeeListProps {
  event: Event;
}

export function AttendeeList({ event }: AttendeeListProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAttendees, setTotalAttendees] = useState(0);

  const fetchAttendees = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.getEventAttendees(event.id, page, 15);
      
      if (response.success) {
        setAttendees(response.data);
        setCurrentPage(response.pagination.current_page);
        setTotalPages(response.pagination.last_page);
        setTotalAttendees(response.pagination.total);
      } else {
        setError('Failed to load attendees');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading attendees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees(1);
  }, [event.id]);

  const handlePageChange = (page: number) => {
    fetchAttendees(page);
  };

  if (loading) {
    return (
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          padding: '48px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid #2563eb',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}
          ></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading attendees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          padding: '48px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: '#dc2626', fontSize: '16px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Card */}
      <div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Event Attendees</h2>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
              {totalAttendees} {totalAttendees === 1 ? 'attendee' : 'attendees'} registered for "{event.name}"
            </p>
          </div>
        </div>
      </div>

      {attendees.length === 0 ? (
        <div 
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            padding: '64px',
            textAlign: 'center'
          }}
        >
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
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>No Attendees Yet</h3>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '16px' }}>
            No one has registered for this event yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {attendees.map((attendee, index) => (
            <div 
              key={attendee.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6',
                padding: '24px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Avatar */}
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    background: `linear-gradient(135deg, ${index % 2 === 0 ? '#3b82f6' : '#7c3aed'} 0%, ${index % 2 === 0 ? '#1d4ed8' : '#6d28d9'} 100%)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  {attendee.name.charAt(0).toUpperCase()}
                </div>

                {/* Attendee Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
                    {attendee.name}
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      <span style={{ fontSize: '14px', color: '#4b5563' }}>{attendee.email}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      <span style={{ fontSize: '14px', color: '#4b5563' }}>
                        Registered: {formatDateTime(attendee.registered_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div 
                  style={{
                    padding: '6px 12px',
                    background: '#dcfce7',
                    color: '#166534',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  Registered
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '24px 0' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              color: currentPage === 1 ? '#9ca3af' : '#1d4ed8',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            Previous
          </button>
          
          <span style={{ padding: '8px 16px', fontSize: '14px', color: '#4b5563' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              color: currentPage === totalPages ? '#9ca3af' : '#1d4ed8',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}