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
import { Event, RegisterAttendeeData } from '@/types';

const attendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type AttendeeFormData = z.infer<typeof attendeeSchema>;

interface AttendeeFormProps {
  event: Event;
  onSuccess?: () => void;
}

export function AttendeeForm({ event, onSuccess }: AttendeeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeSchema),
  });

  const onSubmit = async (data: AttendeeFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const attendeeData: RegisterAttendeeData = {
        name: data.name,
        email: data.email,
      };
      const response = await eventApi.registerAttendee(event.id, attendeeData);

      if (response.success) {
        setSuccess(true);
        reset();
        onSuccess?.();
      } else {
        setError(response.message || 'Failed to register for event');
      }
    } catch (err: any) {
      if (err.response?.data?.error_code === 'CAPACITY_EXCEEDED') {
        setError('This event has reached maximum capacity');
      } else if (err.response?.data?.error_code === 'DUPLICATE_REGISTRATION') {
        setError('This email is already registered for this event');
      } else {
        setError(err.message || 'An error occurred while registering');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-green-600 text-lg font-semibold mb-2">
              Registration Successful!
            </div>
            <p className="text-gray-600">
              You have been successfully registered for {event.name}.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register for Event</CardTitle>
        <CardDescription>
          Register for "{event.name}"
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading || !event.has_capacity} className="w-full">
            {isLoading ? 'Registering...' : 'Register for Event'}
          </Button>

          {!event.has_capacity && (
            <p className="text-sm text-red-600 text-center">
              This event has reached maximum capacity
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}