"use client";

import React, { useState, useEffect, useRef } from "react";
import { Fraunces } from "next/font/google";
import BentoGrid from "./components/BentoGrid";
import StickerCollage from "./components/StickerCollage";
import DiscoBalls from "./components/DiscoBalls";
import StarTransition from "./components/StarTransition";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Sound generator utility using Web Audio API
const playSound = (type: "type" | "click" | "tick" | "fanfare" | "chime") => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "type") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === "chime") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "fanfare") {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.55);
      });
    }
  } catch (e) {
    console.error("Audio Context failed", e);
  }
};

// Sparkle Star SVG Icon
const SparkleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" />
  </svg>
);

interface SparkleObj { id: number; x: number; y: number; scale: number; delay: string; opacity: number }

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<"search" | "searching" | "match" | "reveal">("search");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  // Typing state
  const [inputText, setInputText] = useState("");
  const [autoplayTyping, setAutoplayTyping] = useState(true);
  const searchPhrase = "whose birthday is today?";

  // Searching timeline state
  const [searchingIndex, setSearchingIndex] = useState(0);
  const searchingTexts = [
    "Searching 8 billion people...",
    "Checking birthday databases...",
    "Looking for someone special...",
    "Looking for someone who loves unconditionally...",
    "Match Found! 💖"
  ];

  // Controls
  const [soundMuted, setSoundMuted] = useState(false);
  const birthdayAudioRef = useRef<HTMLAudioElement | null>(null);
  const [bgSparkles, setBgSparkles] = useState<SparkleObj[]>([]);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number; size: number; char: string }[]>([]);
  const trailIdRef = useRef(0);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; size: number; color: string; rotation: number; vx: number; vy: number }[]>([]);

  // Initialize client elements
  useEffect(() => {
    setMounted(true);

    const tempSparkles: SparkleObj[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      scale: Math.random() * 0.6 + 0.4,
      delay: `${Math.random() * 3}s`,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setBgSparkles(tempSparkles);
  }, []);

  // Keyboard typing simulation effect
  useEffect(() => {
    if (!autoplayTyping || screen !== "search") return;

    let currentIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const tick = () => {
      if (!isDeleting) {
        currentIndex++;
        setInputText(searchPhrase.slice(0, currentIndex));
        if (!soundMuted) playSound("type");

        if (currentIndex === searchPhrase.length) {
          isDeleting = true;
          timeout = setTimeout(tick, 1800);
        } else {
          timeout = setTimeout(tick, 100 + Math.random() * 60);
        }
      } else {
        currentIndex = 0;
        isDeleting = false;
        setInputText("");
        timeout = setTimeout(tick, 400);
      }
    };

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [autoplayTyping, screen, soundMuted]);

  // Screen 2 Transition Progression Effect
  useEffect(() => {
    if (screen !== "searching") return;

    setSearchingIndex(0);
    const interval = setInterval(() => {
      setSearchingIndex((prev) => {
        const next = prev + 1;
        if (next < searchingTexts.length) {
          if (!soundMuted) playSound("tick");
          return next;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [screen, soundMuted]);

  // Watch for Match Found
  useEffect(() => {
    if (screen === "searching" && searchingIndex === searchingTexts.length - 1) {
      const delayTimeout = setTimeout(() => {
        if (!soundMuted) playSound("fanfare");
        setScreen("match");
      }, 3500);
      return () => clearTimeout(delayTimeout);
    }
  }, [searchingIndex, screen, soundMuted]);

  // Confetti frame ticking loop
  useEffect(() => {
    if (screen !== "match") return;

    const colors = ["#FFCAE4", "#F10291", "#89235B", "#E8E9EE", "#ffffff"];
    const initialConfetti = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: 50,
      y: 40,
      size: Math.random() * 12 + 6,
      color: colors[i % colors.length],
      rotation: Math.random() * 360,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.7) * 12 - 4,
    }));
    setConfetti(initialConfetti);

    let animationFrameId: number;
    const updateConfetti = () => {
      setConfetti((prev) =>
        prev
          .map((c) => ({
            ...c,
            x: c.x + c.vx * 0.15,
            y: c.y + c.vy * 0.15 + 0.1,
            vy: c.vy + 0.18,
            rotation: c.rotation + c.vx,
          }))
          .filter((c) => c.y < 120 && c.x > -20 && c.x < 120)
      );
      animationFrameId = requestAnimationFrame(updateConfetti);
    };

    animationFrameId = requestAnimationFrame(updateConfetti);
    return () => cancelAnimationFrame(animationFrameId);
  }, [screen]);

  // Handle cursor trail
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mounted) return;
    const elements = ["🌸", "💖", "✨", "🎀"];
    const randomChar = elements[Math.floor(Math.random() * elements.length)];
    const newTrail = {
      id: trailIdRef.current++,
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 14 + 10,
      char: randomChar,
    };
    setTrail((prev) => [...prev.slice(-14), newTrail]);
  };

  const startSearch = () => {
    if (!soundMuted) playSound("click");
    setScreen("searching");
  };

  const handleInputFocus = () => {
    setAutoplayTyping(false);
  };

  // Expand Star transition to Bento Reveal Screen
  const handleRevealClick = () => {
    if (!soundMuted) {
      playSound("chime");
      birthdayAudioRef.current?.play().catch((error) => {
        console.log("Birthday song could not autoplay:", error);
      });
    }
    setIsTransitioning(true);

    // Star fully expands covering the screen at 750ms
    setTimeout(() => {
      setScreen("reveal");
    }, 750);

    // End transition at 1600ms
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1600);
  };

  if (!mounted) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`cute-cursor-area relative flex flex-col flex-1 items-center justify-center min-h-screen overflow-x-hidden select-none transition-colors duration-1000 ${screen === "reveal"
        ? "bg-gradient-to-b from-[#250209] via-[#14040d] to-[#250209] py-16 justify-start scroll-smooth"
        : "bg-gradient-to-tr from-[#FFCAE4] via-[#F10291] to-[#89235B]"
        }`}
    >
      {/* Birthday song */}
      <audio
        ref={birthdayAudioRef}
        src="/hbd.mp3"
        loop
        preload="auto"
      />

      {/* Star wiping overlay */}
      <StarTransition active={isTransitioning} />

      {/* Floating images stickers collage */}
      <StickerCollage
        visible={screen === "search" || screen === "reveal"}
        isRevealScreen={screen === "reveal"}
      />

      {/* Rotating Mini Disco Balls hanging (only on Search & Searching screens) */}
      <DiscoBalls visible={screen === "search" || screen === "searching"} />

      {/* Sparkles background layer (only on first 3 screens) */}
      {screen !== "reveal" && (
        <div className="absolute inset-0 pointer-events-none">
          {bgSparkles.map((sp) => (
            <div
              key={sp.id}
              className="absolute text-[#FFCAE4] animate-sparkle"
              style={{
                left: `${sp.x}%`,
                top: `${sp.y}%`,
                transform: `scale(${sp.scale})`,
                animationDelay: sp.delay,
                opacity: sp.opacity,
              }}
            >
              <SparkleIcon className="w-5 h-5 text-pink-200 drop-shadow-sm" />
            </div>
          ))}
        </div>
      )}

      {/* Music/Sound Toggle floating button */}
      <button
        onClick={() => {
          const nextMuted = !soundMuted;
          setSoundMuted(nextMuted);

          if (nextMuted) {
            birthdayAudioRef.current?.pause();
          } else {
            birthdayAudioRef.current?.play().catch(() => { });
          }

          playSound("click");
        }}
        className="absolute top-6 right-6 z-50 p-3 bg-white/80 hover:bg-[#FFCAE4] text-[#F10291] hover:text-[#89235B] rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-pink-200 active:scale-95"
        title={soundMuted ? "Unmute Sound" : "Mute Sound"}
      >
        {soundMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.874c0 1.141.922 2.063 2.063 2.063h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse-slow">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.874c0 1.141.922 2.063 2.063 2.063h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.57 17.47a.75.75 0 11-1.06-1.06 5.25 5.25 0 000-7.42.75.75 0 111.06-1.06 6.75 6.75 0 010 9.54z" />
            <path d="M21.3 20.2a.75.75 0 11-1.06-1.06 9.15 9.15 0 000-12.87.75.75 0 111.06-1.06 10.65 10.65 0 010 15z" />
          </svg>
        )}
      </button>

      {/* Screen 1: Fake Google Search */}
      {screen === "search" && (
        <main className="flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center z-10 animate-fade-in mt-20">
          <div className="flex flex-col items-center mb-8 relative">
            <h1 className={`${fraunces.className} text-6xl md:text-8xl font-black tracking-tight select-none drop-shadow-md flex items-center`}>
              <span className="text-[#fd9bb7]">G</span>
              <span className="text-[#FFCAE4] drop-shadow-[0_2px_4px_rgba(137,35,91,0.5)]">o</span>
              <span className="text-[#89235B]">o</span>
              <span className="text-[#fd9bb7]">g</span>
              <span className="text-[#FFCAE4] drop-shadow-[0_2px_4px_rgba(137,35,91,0.5)]">l</span>
              <span className="text-[#89235B]">e</span>
            </h1>

          </div>

          {/* Search bar */}
          <div className="w-full max-w-[680px] px-2">
            <div className="relative flex items-center w-full h-[65px] bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-[#F10291] focus-within:border-[#89235B] transition-all duration-300 px-6 hover:shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#F10291" className="w-6 h-6 text-[#F10291] flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>

              <div className="relative flex-1 h-full flex items-center">
                <input
                  id="search-bar"
                  type="text"
                  className="w-full h-full bg-transparent text-xl font-medium outline-none text-[#250209] pl-3 pr-8 placeholder-transparent"
                  placeholder="Search the internet..."
                  value={inputText}
                  onChange={(e) => {
                    setAutoplayTyping(false);
                    setInputText(e.target.value);
                  }}
                  onFocus={handleInputFocus}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") startSearch();
                  }}
                />

                {autoplayTyping && (
                  <div
                    onClick={() => {
                      setAutoplayTyping(false);
                      document.getElementById("search-bar")?.focus();
                    }}
                    className="absolute inset-0 pl-3 flex items-center pointer-events-none text-xl font-medium text-[#250209] select-none text-left"
                  >
                    <span>{inputText}</span>
                    <span className="typing-cursor" />
                  </div>
                )}

                {!autoplayTyping && !inputText && (
                  <span className="absolute left-3 pointer-events-none text-pink-300 text-xl font-medium">
                    Search the internet...
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <button
              onClick={startSearch}
              className="px-8 py-3.5 bg-[#F10291] hover:bg-[#89235B] text-white text-base font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 select-none border border-pink-400"
            >
              Search the Internet
            </button>
            {/* <button
              onClick={() => {
                setInputText("whose birthday is today?");
                setAutoplayTyping(false);
                startSearch();
              }}
              className="px-8 py-3.5 bg-white/80 hover:bg-[#FFCAE4] text-[#89235B] text-base font-bold border-2 border-[#FFCAE4] rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 select-none"
            >
              I'm Feeling Lucky 💖
            </button> */}
          </div>
        </main>
      )}

      {/* Screen 2: Searching... */}
      {screen === "searching" && (
        <main className="flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center z-10">
          <div className="relative w-[180px] h-[180px] mb-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#FFCAE4] animate-ping opacity-60" style={{ animationDuration: "2.5s" }} />
            <div className="absolute inset-4 rounded-full border-2 border-[#F10291] animate-ping opacity-45" style={{ animationDuration: "2s" }} />

            <div className="w-[90px] h-[90px] bg-gradient-to-tr from-[#F10291] to-[#FFCAE4] rounded-full flex items-center justify-center shadow-lg border border-white animate-pulse-slow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-10 h-10 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
              </svg>
            </div>
          </div>

          <div className="perspective-container">
            {searchingTexts.map((txt, index) => {
              const diff = index - searchingIndex;
              let stateClass = "text-state-upcoming";

              if (diff === 0) {
                stateClass = "text-state-current";
              } else if (diff === -1) {
                stateClass = "text-state-past-1";
              } else if (diff === -2) {
                stateClass = "text-state-past-2";
              } else if (diff <= -3) {
                stateClass = "text-state-past-3";
              }

              return (
                <div key={index} className={`stacked-text-item ${stateClass}`}>
                  <p className={`${fraunces.className} text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md`}>
                    {txt}
                  </p>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Screen 3: Match Found */}
      {screen === "match" && (
        <main className="flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center z-10 animate-[float-gentle_8s_ease-in-out_infinite]">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute pointer-events-none rounded-sm"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: `${c.size}px`,
                height: `${c.size * 1.5}px`,
                backgroundColor: c.color,
                transform: `rotate(${c.rotation}deg)`,
                opacity: 0.85,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          ))}

          <div className="relative mb-6">
            <h2 className={`${fraunces.className} text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight`}>
              Match Found! 💖
            </h2>
            <div className="w-[120px] h-[3px] bg-white mx-auto mt-4 rounded-full shadow-sm" />
          </div>

          <p className="text-pink-100 text-lg md:text-xl font-medium tracking-wide max-w-md mx-auto mb-12 drop-shadow-sm leading-relaxed">
            The database scanning is complete. We found exactly one match that satisfies all unconditional love checks.
          </p>

          {/* Reveal button with Star transition */}
          <button
            onClick={handleRevealClick}
            className="group relative flex items-center justify-center p-1 bg-white rounded-full shadow-2xl hover:shadow-[0_20px_50px_rgba(241,2,145,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-slow"
          >
            <div className="px-8 py-5 bg-gradient-to-r from-[#F10291] to-[#89235B] rounded-full text-white font-bold text-lg md:text-xl tracking-wider uppercase flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 group-hover:animate-bounce">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              Reveal Birthday Star 💌
            </div>
            <span className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </button>
        </main>
      )}

      {/* Screen 4: Star Reveal Scrollable Section */}
      {screen === "reveal" && (
        <main className="flex flex-col items-center justify-start w-full max-w-5xl px-4 z-20 animate-fade-in">

          {/* Section 1: "its herrr" header & Bento Grid */}
          <div className="flex flex-col items-center w-full mt-8 mb-16">
            <h2 className={`${fraunces.className} text-6xl md:text-8xl font-black text-[#FFCAE4] drop-shadow-[0_0_25px_rgba(241,2,145,0.6)] tracking-tight mb-2 uppercase select-none`}>
              its her's
            </h2>
            <div className="w-[180px] h-[3px] bg-gradient-to-r from-transparent via-[#F10291] to-transparent mx-auto rounded-full mb-10" />

            {/* Bento Grid */}
            <BentoGrid />
          </div>

          {/* Section 2: Wish & Note Card (revealed upon scrolling) */}
          <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto mt-6 pb-24 text-center">

            {/* Centered Wish image (falling back to wish.jpg if png is missing) */}
            <div className="mb-2">
              <img
                src="/wish.png"
                alt="Make a Wish"
                className="w-48 md:w-150 object-contain mix-blend-multiply mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/wish.jpg";
                }}
              />
            </div>

            {/* Note PNG card Wrapper to allow absolute positioned stickers without overflow clipping */}
            {/* Birthday Envelope */}
            {/* 💌 POP-UP BIRTHDAY ENVELOPE */}
            <div className="relative w-full max-w-xl h-[560px] md:h-[650px] flex items-center justify-center">

              {/* Glow */}
              <div className="absolute w-[80%] h-[50%] bg-[#F10291]/20 blur-[90px] rounded-full" />

              {/* Floating decorations */}
              <div className="absolute top-8 left-4 text-3xl animate-float-3">
                💕
              </div>

              <div className="absolute top-20 right-4 text-2xl animate-float-3">
                ✨
              </div>

              {/* Envelope */}
              <button
                onClick={() => {
                  if (!soundMuted) playSound("click");
                  setIsLetterOpen(true);
                }}
                className="group absolute bottom-12 w-[90%] md:w-[80%] h-[300px] md:h-[370px] outline-none"
              >

                {/* Shadow */}
                <div className="absolute bottom-[-25px] left-[5%] w-[90%] h-10 bg-black/40 blur-2xl rounded-full" />

                {/* Envelope body */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden
      bg-gradient-to-br from-[#ffb6d5] via-[#f98dbb] to-[#d84d8d]
      border border-white/30
      shadow-[0_25px_60px_rgba(137,35,91,0.45)]
      transition-all duration-500
      group-hover:scale-[1.03]
      group-hover:-translate-y-2"
                >

                  {/* Left fold */}
                  <div className="absolute inset-0 bg-[#f39ac1] [clip-path:polygon(0_0,50%_55%,0_100%)]" />

                  {/* Right fold */}
                  <div className="absolute inset-0 bg-[#e879a8] [clip-path:polygon(100%_0,50%_55%,100%_100%)]" />

                  {/* Bottom flap */}
                  <div className="absolute bottom-0 left-0 w-full h-[70%]
        bg-gradient-to-br from-[#f7a4c7] to-[#dd609a]
        [clip-path:polygon(0_100%,50%_18%,100%_100%)]"
                  />

                  {/* Top flap */}
                  <div className="absolute top-0 left-0 w-full h-[65%]
        bg-gradient-to-br from-[#ffc9df] to-[#ec76aa]
        [clip-path:polygon(0_0,50%_72%,100%_0)]
        z-20"
                  />

                  {/* Seal */}
                  <div className="absolute z-30 left-1/2 top-[46%] -translate-x-1/2">

                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full
          bg-[#F10291]
          border-4 border-[#ffd9e8]
          shadow-[0_8px_25px_rgba(137,35,91,0.45)]
          flex items-center justify-center
          transition-all duration-500
          group-hover:scale-110 group-hover:rotate-6"
                    >
                      <span className="text-2xl md:text-3xl">
                        💗
                      </span>
                    </div>

                  </div>

                  {/* Text on envelope */}
                  <div className="absolute bottom-8 left-0 right-0 z-30 text-center">

                    <p className="text-white/90 text-xs md:text-sm tracking-[0.3em] uppercase font-bold">
                      A Special Letter
                    </p>

                    <p className="text-white text-lg md:text-xl font-bold mt-1">
                      Just For You 💌
                    </p>

                  </div>

                </div>

              </button>

              {/* Click hint */}
              <div className="absolute bottom-0 text-[#FFCAE4] text-sm md:text-base font-semibold animate-pulse">
                Tap the envelope to open your birthday surprise 💕
              </div>


              {/* ================================= */}
              {/* POP-UP LETTER */}
              {/* ================================= */}

              {isLetterOpen && (
                <div
                  className="fixed inset-0 z-[100] flex items-center justify-center px-4
        bg-[#14040d]/80 backdrop-blur-md
        animate-fade-in"
                  onClick={() => setIsLetterOpen(false)}
                >

                  {/* Card */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="
          relative
          w-full max-w-lg
          h-auto min-h-[520px] md:min-h-[560px]
overflow-hidden
          bg-gradient-to-br from-[#fffdfb] via-[#fff5f9] to-[#ffe5ef]
          rounded-[28px]
          shadow-[0_30px_100px_rgba(241,2,145,0.45)]
          border-4 border-white
          px-7 py-10 md:px-12 md:py-12
          animate-[float-gentle_4s_ease-in-out_infinite]
        "
                  >

                    {/* Decorative corner hearts */}
                    <span className="absolute top-5 left-5 text-xl">
                      💕
                    </span>

                    <span className="absolute top-5 right-5 text-xl">
                      ✨
                    </span>

                    <span className="absolute bottom-5 left-5 text-xl">
                      🎀
                    </span>

                    <span className="absolute bottom-5 right-5 text-xl">
                      💗
                    </span>


                    {/* Close */}
                    <button
                      onClick={() => setIsLetterOpen(false)}
                      className="
            absolute top-4 right-4
            w-9 h-9
            rounded-full
            bg-[#ffe0ec]
            text-[#89235B]
            font-bold
            hover:bg-[#F10291]
            hover:text-white
            transition-all
            z-20
          "
                    >
                      ×
                    </button>


                    {/* Letter header */}
                    <div className="text-center">

                      <div className="text-5xl mb-3">
                        💌
                      </div>

                      <p className="text-xs tracking-[0.3em] uppercase text-[#F10291] font-bold">
                        A Letter For You
                      </p>

                      <div className="w-24 h-[2px] bg-[#F10291] mx-auto mt-3 mb-7 rounded-full" />

                    </div>


                    {/* Birthday message */}
                    {/* Birthday message */}
                    <div className="relative text-center text-[#89235B]">

                      <h2
                        className={`${fraunces.className} text-3xl md:text-4xl font-bold mb-5`}
                      >
                        Happy Birthday! 🎂❤️
                      </h2>

                      <p className="text-sm md:text-base leading-[1.75] px-2">

                        Today is a special day because it celebrates the
                        <span className="font-bold"> beautiful person you are. </span>

                        I hope this birthday becomes one of your
                        <span className="font-bold"> favorite memories. </span>

                        May your life always be filled with
                        <span className="font-semibold"> happiness, smiles, beautiful moments, </span>
                        and dreams that come true.

                        <span className="block mt-4 font-semibold">
                          May this new year of your life bring you endless happiness,
                          unforgettable memories, and everything your heart wishes for. ✨❤️
                        </span>

                      </p>

                      <div className="mt-6 text-xl">
                        🎀 ✨ 💗 ✨ 🎀
                      </div>

                      <p className="mt-4 text-sm font-semibold italic text-[#F10291]">
                        With lots of love, just for you 💕
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>


            {/* Reset/Go Back Button */}
            <button
              onClick={() => {
                if (!soundMuted) playSound("click");
                birthdayAudioRef.current?.pause();
                if (birthdayAudioRef.current) {
                  birthdayAudioRef.current.currentTime = 0;
                }
                setScreen("search");
                setAutoplayTyping(true);
                setInputText("");
              }}
              className="mt-14 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full shadow-sm hover:shadow transition-all duration-200 border border-white/20 text-sm active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Search Again
            </button>
          </div>
        </main>
      )}

      {/* Sparkle cursor trail */}
      <div className="pointer-events-none absolute inset-0 z-[80]">
        {trail.map((t, idx) => {
          const age = trail.length - idx;
          const scale = (trail.length - age) / trail.length;
          const opacity = scale * 0.9;

          return (
            <span
              key={t.id}
              className="absolute pointer-events-none drop-shadow-sm font-bold select-none"
              style={{
                left: t.x - t.size / 2,
                top: t.y - t.size / 2,
                fontSize: `${t.size}px`,
                opacity: opacity,
                transform: `scale(${scale})`,
                transition: "opacity 0.1s ease, transform 0.1s ease",
              }}
            >
              {t.char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
