import React, { useState, useEffect } from 'react';
import Weather from './components/Weather';
import Clock from './components/Clock';
import Calendar from './components/Calendar';
import { CalendarEvent } from './types';
import { MOCK_EVENTS } from './constants';
import { Download, HelpCircle, X, Share, MoreVertical } from 'lucide-react';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-white overflow-hidden flex flex-col relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[0%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Section: Weather and Clock */}
      <header className="flex-none h-[25%] w-full z-10 flex relative border-b border-white/5 bg-slate-900/30 backdrop-blur-sm">
        <div className="flex-1 h-full border-r border-white/5 relative">
          <Weather />
        </div>
        <div className="flex-1 h-full relative">
          <Clock />
        </div>
      </header>

      {/* Bottom Section: Calendar */}
      <main className="flex-1 w-full z-10 relative overflow-hidden bg-slate-900">
        <Calendar events={events} setEvents={setEvents} />
      </main>

      {/* Install Button (Android/Chrome) */}
      {installPrompt && (
        <button
          onClick={handleInstall}
          className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium transition-all animate-fade-in"
        >
          <Download size={16} />
          <span>Install App</span>
        </button>
      )}

      {/* Help / Install Guide Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="absolute bottom-6 left-6 w-10 h-10 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-30"
        aria-label="Installation Help"
      >
        <HelpCircle size={20} />
      </button>

      {/* Install Instructions Modal */}
      {showHelp && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-[60] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 max-w-xs w-full shadow-2xl relative animate-scale-up">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Download size={20} className="text-blue-400"/> Install App
            </h3>
            
            <div className="space-y-4 text-sm text-slate-300">
              <p>For the full fullscreen dashboard experience:</p>
              
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                  Android (Chrome)
                </h4>
                <p className="opacity-80 leading-relaxed">
                  1. Tap the menu <MoreVertical size={12} className="inline mx-0.5"/> <br/>
                  2. Select <span className="text-white font-medium">"Install App"</span> or <span className="text-white font-medium">"Add to Home screen"</span>
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                  iOS (Safari)
                </h4>
                <p className="opacity-80 leading-relaxed">
                  1. Tap Share <Share size={12} className="inline mx-0.5"/> <br/>
                  2. Scroll down & tap <span className="text-white font-medium">"Add to Home Screen"</span>
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowHelp(false)}
              className="w-full mt-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;