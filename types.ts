export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  description?: string;
  type: 'work' | 'personal' | 'meeting' | 'health';
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
}

export enum ViewMode {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH' // Simplified for this demo
}