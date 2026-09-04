"use client";

import React from "react";

interface StarTransitionProps {
  active: boolean;
}

export default function StarTransition({ active }: StarTransitionProps) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden bg-transparent">
      <style>{`
        @keyframes star-grow {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          45% {
            transform: scale(16) rotate(180deg);
            opacity: 1;
          }
          85% {
            transform: scale(50) rotate(360deg);
            opacity: 1;
          }
          100% {
            transform: scale(55) rotate(380deg);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Scaling Star SVG */}
      <svg
        className="w-[100px] h-[100px] text-[#FFCAE4] fill-current drop-shadow-[0_0_35px_rgba(241,2,145,0.7)] animate-[star-grow_1.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
        viewBox="0 0 24 24"
      >
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
      </svg>
    </div>
  );
}
