import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-0 text-center flex justify-center shrink-0 py-0.5">
      <div 
        className="footnote-pill group cursor-default"
        style={{
          backdropFilter: 'blur(36px) saturate(220%) contrast(110%)',
          WebkitBackdropFilter: 'blur(36px) saturate(220%) contrast(110%)',
        }}
      >
        <span className="text-slate-300 font-medium tracking-wide text-xs sm:text-[0.82rem]">
          Crafted with Passion by
        </span>

        <a
          href="https://github.com/SahilKhatkar11"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex flex-col items-center group/name"
        >
          <span
            className="font-black text-xs sm:text-[0.84rem] tracking-wider bg-gradient-to-r from-[#00ff87] via-[#facc15] to-[#ff7a00] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,135,0.45)] hover:drop-shadow-[0_0_14px_rgba(255,122,0,0.65)] hover:scale-[1.02] transition-all duration-300 relative z-10"
            style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Sahil Khatkar
          </span>
          {/* Underline with the exact same green neon to orange gradient */}
          <span 
            className="h-[1.5px] w-full rounded-full bg-gradient-to-r from-[#00ff87] via-[#facc15] to-[#ff7a00] opacity-85 group-hover/name:opacity-100 group-hover/name:h-[2px] transition-all duration-300 mt-[1px] shadow-[0_0_8px_rgba(0,255,135,0.5)]" 
          />
        </a>
      </div>
    </footer>
  );
};

