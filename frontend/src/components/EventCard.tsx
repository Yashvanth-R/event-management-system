'use client';

import { Event } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { formatDateTime } from '@/lib/utils';
import { Calendar, MapPin, Users, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const remainingSpots = event.max_capacity - event.current_attendees;
  const isAlmostFull = remainingSpots <= event.max_capacity * 0.2;
  const isFull = remainingSpots <= 0;
  const fillPercentage = (event.current_attendees / event.max_capacity) * 100;

  return (
    <Card className="clean-card h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
            {event.name}
          </CardTitle>
          {event.is_upcoming && (
            <span className="status-available">
              Upcoming
            </span>
          )}
        </div>
        
        <CardDescription className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          {event.location}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        {/* Date & Time */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Starts</p>
              <p className="text-sm text-gray-600">{formatDateTime(event.start_time)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Ends</p>
              <p className="text-sm text-gray-600">{formatDateTime(event.end_time)}</p>
            </div>
          </div>
        </div>
        
        {/* Capacity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Capacity</span>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              isFull 
                ? 'status-full' 
                : isAlmostFull 
                ? 'status-limited' 
                : 'status-available'
            }`}>
              {event.current_attendees}/{event.max_capacity}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isFull 
                  ? 'progress-fill-red' 
                  : isAlmostFull 
                  ? 'progress-fill-yellow' 
                  : 'progress-fill-green'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {isFull ? 'Event is full' : `${remainingSpots} spots available`}
            </span>
            <span className="font-medium text-blue-600">
              {fillPercentage.toFixed(0)}% filled
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-3 pt-4">
        <Button asChild variant="outline" className="btn-outline flex-1">
          <Link href={`/events/${event.id}`} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Details
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="btn-outline flex-1">
          <Link href={`/events/${event.id}/attendees`} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Attendees
          </Link>
        </Button>
        
        {event.has_capacity && (
          <Button asChild className="btn-primary flex-1">
            <Link href={`/events/${event.id}/register`}>
              Register
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}