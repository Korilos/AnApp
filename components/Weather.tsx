import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin } from 'lucide-react';
import { WeatherData } from '../types';
import { INITIAL_WEATHER } from '../constants';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch from OpenWeatherMap here using coords.
    // For this demo, we simulate a check to geolocation to update the "location" string.
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
           // Simulate a fetch delay
           setTimeout(() => {
             setWeather(prev => ({
               ...prev,
               location: `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`,
               temp: 74, // Simulate a slightly different temp based on "location"
             }));
             setLoading(false);
           }, 800);
        },
        (error) => {
          console.log("Geo permission denied or error, using default", error);
          setLoading(false);
        }
      );
    }
  }, []);

  // Helper to pick icon
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rain': return <CloudRain size={48} className="text-blue-400" />;
      case 'cloudy': 
      case 'partly cloudy': return <Cloud size={48} className="text-slate-400" />;
      default: return <Sun size={48} className="text-yellow-400" />;
    }
  };

  return (
    <div className="flex flex-col items-start justify-center p-6 text-white h-full">
       <div className="flex items-center gap-2 mb-4 opacity-70">
        <MapPin size={18} />
        <span className="text-sm font-medium tracking-wide uppercase">
          {loading ? 'Locating...' : weather.location}
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <div>
          {getWeatherIcon(weather.condition)}
        </div>
        <div>
          <h2 className="text-6xl font-bold">{weather.temp}°</h2>
          <p className="text-xl text-slate-300">{weather.condition}</p>
        </div>
      </div>

      <div className="flex gap-6 mt-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
           <Droplets size={16} />
           <span>{weather.humidity}% Humidity</span>
        </div>
        <div className="flex items-center gap-2">
           <Wind size={16} />
           <span>{weather.windSpeed} mph Wind</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-red-300">H: {weather.high}°</span>
           <span className="text-blue-300">L: {weather.low}°</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;