import React from 'react';
import localLogoImg from '../assets/images/rps_app_logo_1786029096982.jpg';

// Direct GitHub repository file location for zero-dependency static asset delivery
const GITHUB_REPO_LOGO_URL = 'https://raw.githubusercontent.com/SahilKhatkar11/rps-game/main/public/logo.jpg';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md' }) => {
  const containerSizes = {
    sm: 'w-11 h-11 rounded-xl',
    md: 'w-14 h-14 sm:w-16 sm:h-16 md:w-[4.75rem] md:h-[4.75rem] rounded-xl sm:rounded-2xl',
    lg: 'w-18 h-18 sm:w-22 sm:h-22 rounded-2xl',
  };

  const imageSizes = {
    sm: 'w-11 h-11',
    md: 'w-14 h-14 sm:w-16 sm:h-16 md:w-[4.75rem] md:h-[4.75rem]',
    lg: 'w-18 h-18 sm:w-22 sm:h-22',
  };

  return (
    <div className="relative group flex items-center shrink-0">
      {/* Ambient Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-amber-500/30 rounded-2xl blur-xs opacity-40 group-hover:opacity-80 transition duration-300" />

      {/* Main Logo Image Container (Squircle) */}
      <div className={`relative ${containerSizes[size]} overflow-hidden border-[1.5px] border-white/35 shadow-md bg-slate-900 shrink-0 flex items-center justify-center transform transition-transform group-hover:scale-105`}>
        <img
          src={GITHUB_REPO_LOGO_URL}
          onError={(e) => {
            // Graceful fallback to bundled asset if network is offline or before initial push
            if (e.currentTarget.src !== localLogoImg) {
              e.currentTarget.src = localLogoImg;
            }
          }}
          alt="Rock Paper Scissors Logo"
          referrerPolicy="no-referrer"
          className={`${imageSizes[size]} object-cover object-center transition-transform duration-300 group-hover:scale-110`}
        />
        {/* Subtle Inner Glass Highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
      </div>
    </div>
  );
};
