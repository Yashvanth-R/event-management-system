import axios from 'axios';
import { Event, Attendee, CreateEventData, RegisterAttendeeData, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export const eventApi = {
  // Create a new event
  createEvent: async (data: CreateEventData): Promise<ApiResponse<Event>> => {
    const response = await api.post('/events', data);
    return response.data;
  },

  // Get all upcoming events
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get a specific event
  getEvent: async (id: number): Promise<ApiResponse<Event>> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Register attendee for event
  registerAttendee: async (eventId: number, data: RegisterAttendeeData): Promise<ApiResponse<Attendee>> => {
    const response = await api.post(`/events/${eventId}/attendees`, data);
    return response.data;
  },

  // Get attendees for an event
  getEventAttendees: async (eventId: number, page = 1, limit = 15): Promise<PaginatedResponse<Attendee>> => {
    const response = await api.get(`/events/${eventId}/attendees`, {
      params: { page, limit }
    });
    return response.data;
  },
};

export const attendeeApi = {
  // Create a new attendee and assign to event
  createAttendee: async (data: { name: string; email: string; eventId: number }): Promise<ApiResponse<Attendee>> => {
    const response = await api.post('/attendees', data);
    return response.data;
  },

  // Get all attendees across all events
  getAllAttendees: async (page = 1, limit = 15, eventId?: number): Promise<PaginatedResponse<Attendee>> => {
    const params: any = { page, limit };
    if (eventId) params.eventId = eventId;
    
    const response = await api.get('/attendees', { params });
    return response.data;
  },

  // Get a specific attendee
  getAttendee: async (id: number): Promise<ApiResponse<Attendee>> => {
    const response = await api.get(`/attendees/${id}`);
    return response.data;
  },

  // Remove an attendee
  removeAttendee: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/attendees/${id}`);
    return response.data;
  },
};

export default api;