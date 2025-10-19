export interface Event {
  id: number;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  formatted_start_time: string;
  formatted_end_time: string;
  max_capacity: number;
  current_attendees: number;
  remaining_capacity: number;
  has_capacity: boolean;
  is_upcoming: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attendee {
  id: number;
  name: string;
  email: string;
  registered_at: string;
  formatted_registered_at: string;
  event?: Event;
}

export interface CreateEventData {
  name: string;
  location: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

export interface RegisterAttendeeData {
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  error?: string;
  error_code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}