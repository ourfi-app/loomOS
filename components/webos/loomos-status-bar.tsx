'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Bell, Signal, Battery, Wifi } from 'lucide-react';

interface LoomOSStatusBarProps {
  appName: string;
}

export function LoomOSStatusBar({ appName }: LoomOSStatusBarProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-1.5 flex items-center justify-between text-xs h-6 flex-shrink-0">
      <select className="bg-transparent border-none text-white outline-none cursor-pointer text-xs font-bold">
        <option>{appName}</option>
      </select>
      <div className="flex items-center gap-2.5 text-[11px]">
        <Mail size={11} />
        <Bell size={11} />
        <Signal size={11} />
        <Wifi size={11} />
        <Battery size={11} />
        <span className="font-bold">{currentTime}</span>
      </div>
    </div>
  );
}
