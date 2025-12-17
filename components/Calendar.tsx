import React, { useState, useRef, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { Sparkles, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { generateSmartSchedule } from '../services/geminiService';

interface CalendarProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const Calendar: React.FC<CalendarProps> = ({ events, setEvents }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to 8 AM on load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 80 * 0; // Start at 8 AM (index 0 of hours is 8 AM)
    }
  }, []);

  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

  const handleGenerate = async () => {
    if (!customPrompt.trim()) return;
    
    setIsGenerating(true);
    setPromptOpen(false);
    try {
      const newEvents = await generateSmartSchedule(customPrompt);
      if (newEvents && newEvents.length > 0) {
        setEvents(newEvents);
      }
    } catch (e) {
      alert("Failed to generate schedule. Check connectivity.");
    } finally {
      setIsGenerating(false);
      setCustomPrompt('');
    }
  };

  const getEventStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'work': return 'bg-blue-500/20 border-l-blue-400 text-blue-100';
      case 'personal': return 'bg-emerald-500/20 border-l-emerald-400 text-emerald-100';
      case 'meeting': return 'bg-purple-500/20 border-l-purple-400 text-purple-100';
      case 'health': return 'bg-rose-500/20 border-l-rose-400 text-rose-100';
      default: return 'bg-slate-700 border-l-slate-500 text-slate-200';
    }
  };

  // 80px per hour
  const HOUR_HEIGHT = 80;
  const START_HOUR = 7;

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    const topOffset = (startHour - START_HOUR) * HOUR_HEIGHT; 
    const duration = (endHour - startHour) * HOUR_HEIGHT;
    
    return { top: `${Math.max(0, topOffset)}px`, height: `${Math.max(20, duration)}px` };
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-white tracking-tight">Today</h3>
          <span className="text-sm font-medium text-slate-400 px-2 py-0.5 rounded-full bg-white/5">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div className="p-2 bg-white/5 rounded-full">
           <CalendarIcon size={20} className="text-slate-300" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto relative bg-slate-900 scroll-smooth pb-24"
      >
        <div className="relative" style={{ height: hours.length * HOUR_HEIGHT }}>
          {/* Time lines */}
          {hours.map((hour) => (
            <div key={hour} className="flex items-start border-b border-white/[0.03]" style={{ height: HOUR_HEIGHT }}>
              <div className="w-16 flex-shrink-0 text-right pr-3 py-2 text-xs text-slate-500 font-medium -translate-y-1/2">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </div>
              <div className="flex-1 h-full relative border-l border-white/[0.03]">
                 {/* Grid lines */}
              </div>
            </div>
          ))}

          {/* Events Layer */}
          <div className="absolute top-0 left-16 right-0 bottom-0 pointer-events-none">
             {events.map((event) => {
               const pos = getEventPosition(event);
               const startH = new Date(event.start).getHours();
               if (startH < START_HOUR || startH > START_HOUR + hours.length) return null;

               return (
                 <div
                   key={event.id}
                   style={{ top: pos.top, height: pos.height }}
                   className={`absolute left-2 right-4 rounded-md border-l-[3px] p-2 shadow-sm pointer-events-auto cursor-pointer hover:brightness-110 transition-all overflow-hidden ${getEventStyle(event.type)}`}
                 >
                    <div className="font-semibold text-sm leading-tight">{event.title}</div>
                    <div className="text-xs opacity-70 mt-0.5 truncate">{event.description}</div>
                 </div>
               );
             })}
          </div>

          {/* Current Time Indicator */}
          <div 
             className="absolute left-16 right-0 border-t border-red-500 z-10 pointer-events-none opacity-80"
             style={{ top: `${(new Date().getHours() - START_HOUR + new Date().getMinutes()/60) * HOUR_HEIGHT}px` }}
          >
            <div className="absolute -left-1.5 -top-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          </div>
        </div>
      </div>

      {/* Android Style FAB (Floating Action Button) */}
      <button 
        onClick={() => setPromptOpen(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-30"
      >
        {isGenerating ? <Sparkles size={24} className="animate-pulse" /> : <Plus size={28} />}
      </button>

      {/* AI Prompt Modal */}
      {promptOpen && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-slate-800 w-full sm:w-96 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl border-t sm:border border-white/10 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
               <h4 className="text-lg font-bold text-white flex items-center gap-2">
                 <Sparkles size={18} className="text-purple-400" /> AI Scheduler
               </h4>
               <button onClick={() => setPromptOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <textarea 
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 resize-none h-28 mb-4 text-sm"
              placeholder="Ex: Meetings from 10 to 12, then lunch, then coding..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              autoFocus
            />
            
            <button 
              onClick={handleGenerate}
              className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Generate Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;