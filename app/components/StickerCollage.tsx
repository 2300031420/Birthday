"use client";

import React from "react";

interface Sticker {
  src: string;
  alt: string;
  position: string;
  tilt: string;
  size: string;
  animation: string;
}

// Stickers for the landing Search Screen (only balloons & juice)
const SEARCH_STICKERS: Sticker[] = [
  { src: "/heartBalloon.png", alt: "Heart Balloon", position: "top-[55%] left-[10%] md:left-[8%]", tilt: "rotate-[-10deg]", size: "w-54 h-54 md:w-50 md:h-80", animation: "animate-float-2" },
  { src: "/pinkBalloon.png", alt: "Pink Balloon", position: "top-[40%] right-[3%] md:right-[8%]", tilt: "rotate-[12deg]", size: "w-20 h-50 md:w-28 md:h-48", animation: "animate-float-3" },
  { src: "/pinkBunch.png", alt: "Pink Flowers Bunch", position: "top-[70%] right-[3%] md:right-[8%]", tilt: "rotate-[340deg]", size: "w-20 h-50 md:w-28 md:h-58", animation: "animate-float-3" },
  { src: "/juice.png", alt: "Juice Drink", position: "top-[43%] left-[3%]", tilt: "rotate-[12deg]", size: "w-20 h-50 md:w-38 md:h-48", animation: "animate-float-3" },
];

// Different set of stickers for the scrolling "its herrr" Reveal Screen (flowers, wish, cap, disco)
const REVEAL_STICKERS: Sticker[] = [
  { src: "/flowers.png", alt: "Flowers", position: "top-[5%] left-[2%] md:left-[1%]", tilt: "rotate-[-10deg]", size: "w-24 h-24 md:w-42 md:h-58", animation: "animate-float-1" },
  { src: "/cat.png", alt: "Wish", position: "top-[50%] left-[2%] md:left-[2%]", tilt: "rotate-[-12deg]", size: "w-22 h-22 md:w-60 md:h-100", animation: "animate-float-2" },
  { src: "/heartDisco.png", alt: "Heart Disco Ball", position: "top-[62%] right-[2%] md:right-[6%]", tilt: "rotate-[18deg]", size: "w-34 h-34 md:w-42 md:h-42", animation: "animate-float-2" },
  { src: "/cap.png", alt: "Party Cap", position: "top-[20%] left-[77%]", tilt: "rotate-[-350deg]", size: "w-20 h-20 md:w-38 md:h-38", animation: "animate-float-3" },
];

interface StickerCollageProps {
  visible: boolean;
  isFixed?: boolean;
  isRevealScreen?: boolean;
}

export default function StickerCollage({ visible, isFixed = true, isRevealScreen = false }: StickerCollageProps) {
  if (!visible) return null;

  const activeStickers = isRevealScreen ? REVEAL_STICKERS : SEARCH_STICKERS;

  return (
    <div className={`${isFixed ? "fixed" : "absolute"} inset-0 pointer-events-none transition-opacity duration-1000 z-10 opacity-100`}>
      {activeStickers.map((st, idx) => (
        <div
          key={idx}
          className={`absolute pointer-events-auto transition-transform duration-300 hover:scale-110 active:scale-95 hover:z-30 select-none ${st.position} ${st.tilt} ${st.animation}`}
        >
          <img
            src={st.src}
            alt={st.alt}
            className={`${st.size} object-cover rounded-2xl mix-blend-multiply`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Check if we tried png, fallback to jpg
              if (target.src.endsWith(".png") || target.src.includes(".png?")) {
                // If it is a relative url like /flowers.png, target.src becomes http://localhost:3000/flowers.png
                // We split or replace to load .jpg fallback
                target.src = target.src.replace(".png", ".jpg");
              } else {
                // If jpg fails too, hide the image cleanly
                target.style.display = "none";
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
