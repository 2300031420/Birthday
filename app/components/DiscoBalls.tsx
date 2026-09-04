"use client";

import React from "react";

interface DiscoBallsProps {
  visible: boolean;
}

export default function DiscoBalls({ visible }: DiscoBallsProps) {
  if (!visible) return null;

  return (
    <>
      {/* Left Disco Ball */}
      <div className="absolute top-0 left-[10%] z-20 pointer-events-none animate-sway">
        <div className="w-[2px] h-[120px] bg-[#E8E9EE]/40 mx-auto" />
        <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden flex items-center justify-center">
          <img
            src="/Discobal.png"
            alt="Disco Ball"
            className="w-full h-full object-cover animate-[spin_15s_linear_infinite] mix-blend-multiply"
            onError={(e) => {
              // Fallback to JPG if png is missing
              (e.target as HTMLImageElement).src = "/Discobal.jpg";
            }}
          />
          {/* Disco gleam overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-100%] animate-[shine-reflection_3s_linear_infinite] pointer-events-none" />
        </div>
      </div>

      {/* Right Disco Ball */}
      <div className="absolute top-0 right-[12%] z-20 pointer-events-none animate-sway" style={{ animationDelay: "-1.5s" }}>
        <div className="w-[2px] h-[90px] bg-[#E8E9EE]/40 mx-auto" />
        <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden flex items-center justify-center">
          <img
            src="/Discobal.png"
            alt="Heart Disco Ball"
            className="w-full h-full object-cover animate-[spin_20s_linear_infinite] mix-blend-multiply"
            onError={(e) => {
              // Fallback to JPG if png is missing
              (e.target as HTMLImageElement).src = "/Discobal.jpg";
            }}
          />
          {/* Disco gleam overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 translate-x-[-100%] animate-[shine-reflection_2.2s_linear_infinite] pointer-events-none" />
        </div>
      </div>
    </>
  );
}
