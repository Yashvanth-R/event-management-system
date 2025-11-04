'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, AlertCircle, Users, Plus, Trash2 } from 'lucide-react';
import { attendeeApi } from '@/lib/api';
import { Attendee } from '@/types';

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAttendees = async (page = 1) => {
    try {
      setLoading(true);
      const response = await attendeeApi.getAllAttendees(page, 15);
      
      if (response.success) {
        setAttendees(response.data);
        setCurrentPage(response.pagination.current_page);
        setTotalPages(response.pagination.last_page);
        setTotal(response.pagination.total);
      } else {
        setError(response.message || 'Failed to load attendees');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading attendees');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAttendee = async (attendeeId: number) => {
    if (!confirm('Are you sure you want to remove this attendee?')) {
      return;
    }

    try {
      const response = await attendeeApi.removeAttendee(attendeeId);
      if (response.success) {
        // Refresh the attendees list
        fetchAttendees(currentPage);
      } else {
        alert(response.message || 'Failed to remove attendee');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred while removing attendee');
    }
  };

  useEffect(() => {
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
          <p style={{ color: '#6b7280', margin: 0 }}>
            Manage event attendees and registrations {total > 0 && `(${total} total)`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link 
            href="/create-attendee" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #047857 0%, #065f46 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Attendee
          </Link>
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
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>Name</th>
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>Email</th>
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }}>Event</th>
                  <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '15%' }}>Registered</th>
                  <th style={{ padding: '20px 32px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', width: '10%' }}>Actions</th>
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
                    <td style={{ padding: '24px 32px', width: '25%' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '12px', height: '12px', background: '#7c3aed', borderRadius: '50%', marginRight: '12px' }}></div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{attendee.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', color: '#4b5563', fontWeight: '500', width: '25%' }}>
                      {attendee.email}
                    </td>
                    <td style={{ padding: '24px 32px', width: '25%' }}>
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
                        {attendee.event?.name || 'Unknown Event'}
                      </span>
                    </td>
                    <td style={{ padding: '24px 32px', fontSize: '14px', color: '#4b5563', width: '15%' }}>
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
                    <td style={{ padding: '24px 32px', textAlign: 'center', width: '10%' }}>
                      <button
                        onClick={() => handleRemoveAttendee(attendee.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.borderColor = '#fca5a5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fef2f2';
                          e.currentTarget.style.borderColor = '#fecaca';
                        }}
                        title="Remove attendee"
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
          <button
            onClick={() => fetchAttendees(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              background: currentPage === 1 ? '#f3f4f6' : 'white',
              color: currentPage === 1 ? '#9ca3af' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Previous
          </button>
          
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => fetchAttendees(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              background: currentPage === totalPages ? '#f3f4f6' : 'white',
              color: currentPage === totalPages ? '#9ca3af' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}