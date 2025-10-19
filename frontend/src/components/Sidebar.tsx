'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calendar, Users, Sparkles } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Events',
      href: '/events',
      icon: Calendar,
      active: pathname === '/events' || pathname === '/'
    },
    {
      name: 'Attendees',
      href: '/attendees',
      icon: Users,
      active: pathname === '/attendees'
    }
  ];

  return (
    <aside 
      style={{
        width: '256px',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
    >
      <div style={{ padding: '24px' }}>
        {/* Logo/Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              background: '#2563eb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: 0 }}>EventFlow</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Event Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: item.active ? '#2563eb' : 'transparent',
                  color: item.active ? 'white' : '#cbd5e1',
                  boxShadow: item.active ? '0 10px 25px -5px rgba(37, 99, 235, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = '#334155';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}