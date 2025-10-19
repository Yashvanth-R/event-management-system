'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { eventApi } from '@/lib/api';
import { CreateEventData } from '@/types';
import { useRouter } from 'next/navigation';

const eventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  max_capacity: z.number().min(1, 'Capacity must be at least 1').max(10000, 'Capacity cannot exceed 10,000'),
}).refine((data) => {
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);
  return endTime > startTime;
}, {
  message: "End time must be after start time",
  path: ["end_time"],
}).refine((data) => {
  const startTime = new Date(data.start_time);
  return startTime > new Date();
}, {
  message: "Start time must be in the future",
  path: ["start_time"],
});

type EventFormData = z.infer<typeof eventSchema>;

export function EventForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const eventData: CreateEventData = {
        name: data.name,
        location: data.location,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
        max_capacity: data.max_capacity,
      };

      const response = await eventApi.createEvent(eventData);
      
      if (response.success) {
        reset();
        router.push('/events');
      } else {
        setError(response.message || 'Failed to create event');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Fill in the details to create a new event
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter event name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Enter event location"
            />
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register('start_time')}
              />
              {errors.start_time && (
                <p className="text-sm text-red-600">{errors.start_time.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register('end_time')}
              />
              {errors.end_time && (
                <p className="text-sm text-red-600">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_capacity">Maximum Capacity</Label>
            <Input
              id="max_capacity"
              type="number"
              min="1"
              max="10000"
              {...register('max_capacity', { valueAsNumber: true })}
              placeholder="Enter maximum capacity"
            />
            {errors.max_capacity && (
              <p className="text-sm text-red-600">{errors.max_capacity.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}