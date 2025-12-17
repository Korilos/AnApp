import { CalendarEvent, WeatherData } from './types';

export const INITIAL_WEATHER: WeatherData = {
  temp: 72,
  condition: 'Partly Cloudy',
  location: 'San Francisco, CA',
  high: 75,
  low: 62,
  humidity: 45,
  windSpeed: 8,
};

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    type: 'work',
    description: 'Daily sync with the engineering team.'
  },
  {
    id: '2',
    title: 'Lunch with Sarah',
    start: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(13, 30, 0, 0)).toISOString(),
    type: 'personal',
    description: 'Catch up at the new taco place.'
  },
  {
    id: '3',
    title: 'Project Deep Work',
    start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    type: 'work',
    description: 'Focus time for the new feature implementation.'
  }
];