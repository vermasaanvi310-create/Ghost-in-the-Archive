import React from 'react';

export const FloatingAtmosphere: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Warm candlelight ambient vignette at top center */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px] opacity-25 candle-glow"
        style={{
          background: 'radial-gradient(circle, rgba(214, 173, 98, 0.5) 0%, rgba(100, 45, 58, 0.25) 50%, transparent 80%)'
        }}
      />

      {/* Deep burgundy glow in corner */}
      <div 
        className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(100, 45, 58, 0.45) 0%, transparent 70%)'
        }}
      />

      {/* Floating dust motes (CSS-only for smooth 60fps) */}
      <div className="absolute inset-0 opacity-40">
        {[
          { top: '15%', left: '20%', size: '3px', delay: '0s', duration: '18s' },
          { top: '35%', left: '75%', size: '2px', delay: '3s', duration: '22s' },
          { top: '60%', left: '40%', size: '2.5px', delay: '5s', duration: '16s' },
          { top: '80%', left: '15%', size: '3px', delay: '2s', duration: '20s' },
          { top: '25%', left: '85%', size: '1.5px', delay: '7s', duration: '25s' },
          { top: '70%', left: '80%', size: '2px', delay: '4s', duration: '19s' },
        ].map((dust, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D6AD62]"
            style={{
              top: dust.top,
              left: dust.left,
              width: dust.size,
              height: dust.size,
              boxShadow: '0 0 6px rgba(214, 173, 98, 0.8)',
              animation: `dustFloat ${dust.duration} infinite ease-in-out ${dust.delay}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
