import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'PPP p'); // e.g., "Dec 1, 2024 at 10:00 AM"
  } catch (error) {
    return dateString;
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'PPP'); // e.g., "Dec 1, 2024"
  } catch (error) {
    return dateString;
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'p'); // e.g., "10:00 AM"
  } catch (error) {
    return dateString;
  }
}

export function formatDateTimeLocal(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    return '';
  }
}