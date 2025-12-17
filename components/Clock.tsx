import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-end justify-center p-6 text-white h-full">
      <div className="flex items-center gap-3 mb-2 opacity-80">
        <ClockIcon size={20} />
        <span className="text-sm font-medium tracking-widest uppercase">Current Time</span>
      </div>
      <h1 className="text-7xl font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
        {formatTime(time)}
      </h1>
      <p className="text-2xl font-light text-slate-300 mt-2">
        {formatDate(time)}
      </p>
    </div>
  );
};

export default Clock;