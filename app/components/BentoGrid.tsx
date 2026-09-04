"use client";

import React from "react";

interface BentoCard {
  src: string;
  alt: string;
  className: string;
  message?: string;
  messageSide?: "left" | "right";
}

export default function BentoGrid() {
  const cards: BentoCard[] = [
    {
      src: "/1.jpg",
      alt: "A special memory",
      className: "col-span-1 row-span-2",
    },
    {
      src: "/2.jpeg",
      alt: "A beautiful memory",
      className: "col-span-1 row-span-2",
    },
    {
      src: "/8.jpeg",
      alt: "A precious moment",
      className: "col-span-2 row-span-2",
      message:
        "Every little moment with you becomes a memory I want to keep forever. 💗",
      messageSide: "left",
    },
    {
      src: "/4.jpg",
      alt: "A beautiful moment",
      className: "col-span-2 row-span-2",
      message:
        "You make ordinary days feel a little more beautiful just by being you. ✨",
      messageSide: "right",
    },
    {
      src: "/5.jpg",
      alt: "Another beautiful memory",
      className: "col-span-1 row-span-2",
    },
    {
      src: "/6.jpg",
      alt: "A favorite memory",
      className: "col-span-1 row-span-2",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-5 py-6 sm:py-10">

      {/* Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-[#F10291] text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold mb-3">
          Little moments
        </p>

        <h3 className="text-[#FFCAE4] text-3xl sm:text-4xl md:text-5xl font-bold">
          Memories ✨
        </h3>

        <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#F10291] to-transparent mx-auto mt-4" />
      </div>

      {/* Gallery */}
      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          auto-rows-[115px]
          sm:auto-rows-[140px]
          md:auto-rows-[145px]
          gap-3
          sm:gap-4
        "
      >
        {cards.map((card, index) => (
          <MemoryCard key={index} card={card} />
        ))}
      </div>
    </section>
  );
}

function MemoryCard({ card }: { card: BentoCard }) {
  const hasMessage = Boolean(card.message);

  return (
    <div
      className={`
        ${card.className}
        relative
        rounded-[22px]
        sm:rounded-[28px]
        overflow-hidden
        border
        border-[#F10291]/20
        bg-[#0d0208]
        group
        isolate
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        hover:border-[#F10291]/60
        hover:shadow-[0_15px_50px_rgba(241,2,145,0.22)]
        transition-all
        duration-500
      `}
    >

      {/* Blurred background */}
      <div
        className="
          absolute
          inset-0
          scale-110
          blur-2xl
          opacity-40
          transition-transform
          duration-700
          group-hover:scale-125
        "
        style={{
          backgroundImage: `url(${card.src})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Dark background */}
      <div className="absolute inset-0 bg-[#14040d]/45 backdrop-blur-[2px]" />

      {hasMessage ? (
        /* ================= PHOTO + SIDE MESSAGE ================= */
        <div className="absolute inset-0 z-[5] flex items-center">

          {card.messageSide === "left" ? (
            <>
              {/* LEFT MESSAGE */}
              <div className="w-[42%] h-full flex flex-col justify-center items-center text-center px-3 sm:px-6">
                <span className="text-[#F10291] text-lg sm:text-2xl mb-2">
                  ✦
                </span>

                <p
                  className="
                    text-[#FFCAE4]
                    text-[10px]
                    sm:text-xs
                    md:text-sm
                    lg:text-base
                    leading-relaxed
                    font-medium
                    tracking-wide
                  "
                >
                  {card.message}
                </p>

                <div className="w-8 sm:w-12 h-[1px] bg-[#F10291]/60 mt-3" />
              </div>

              {/* PHOTO */}
              <div className="w-[58%] h-full flex items-center justify-center p-2 sm:p-4">
                <img
                  src={card.src}
                  alt={card.alt}
                  draggable={false}
                  loading="lazy"
                  className="
                    w-full
                    h-full
                    object-contain
                    object-center
                    rounded-xl
                    sm:rounded-2xl
                    select-none
                    transition-transform
                    duration-700
                    group-hover:scale-[1.04]
                  "
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;

                    if (target.src.endsWith(".jpeg")) {
                      target.src = target.src.replace(".jpeg", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".jpeg");
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <>
              {/* PHOTO */}
              <div className="w-[58%] h-full flex items-center justify-center p-2 sm:p-4">
                <img
                  src={card.src}
                  alt={card.alt}
                  draggable={false}
                  loading="lazy"
                  className="
                    w-full
                    h-full
                    object-contain
                    object-center
                    rounded-xl
                    sm:rounded-2xl
                    select-none
                    transition-transform
                    duration-700
                    group-hover:scale-[1.04]
                  "
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;

                    if (target.src.endsWith(".jpeg")) {
                      target.src = target.src.replace(".jpeg", ".jpg");
                    } else if (target.src.endsWith(".jpg")) {
                      target.src = target.src.replace(".jpg", ".jpeg");
                    }
                  }}
                />
              </div>

              {/* RIGHT MESSAGE */}
              <div className="w-[42%] h-full flex flex-col justify-center items-center text-center px-3 sm:px-6">
                <span className="text-[#F10291] text-lg sm:text-2xl mb-2">
                  ✦
                </span>

                <p
                  className="
                    text-[#FFCAE4]
                    text-[10px]
                    sm:text-xs
                    md:text-sm
                    lg:text-base
                    leading-relaxed
                    font-medium
                    tracking-wide
                  "
                >
                  {card.message}
                </p>

                <div className="w-8 sm:w-12 h-[1px] bg-[#F10291]/60 mt-3" />
              </div>
            </>
          )}
        </div>
      ) : (
        /* ================= NORMAL PHOTO ================= */
        <div className="absolute inset-0 z-[5] flex items-center justify-center p-2 sm:p-3">
          <img
            src={card.src}
            alt={card.alt}
            draggable={false}
            loading="lazy"
            className="
              w-full
              h-full
              object-contain
              object-center
              rounded-[16px]
              sm:rounded-[22px]
              select-none
              transition-transform
              duration-700
              group-hover:scale-[1.04]
            "
            onError={(e) => {
              const target = e.target as HTMLImageElement;

              if (target.src.endsWith(".jpeg")) {
                target.src = target.src.replace(".jpeg", ".jpg");
              } else if (target.src.endsWith(".jpg")) {
                target.src = target.src.replace(".jpg", ".jpeg");
              }
            }}
          />
        </div>
      )}

      {/* Shine */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-1/3
          bg-gradient-to-b
          from-white/10
          to-transparent
          opacity-40
          pointer-events-none
          z-10
        "
      />

      {/* Pink border glow */}
      <div
        className="
          absolute
          inset-0
          rounded-[28px]
          border
          border-transparent
          group-hover:border-[#F10291]/30
          transition-all
          duration-500
          pointer-events-none
          z-20
        "
      />

      {/* Sparkle */}
      <div
        className="
          absolute
          top-3
          right-3
          w-7
          h-7
          rounded-full
          bg-white/10
          backdrop-blur-md
          border
          border-white/10
          flex
          items-center
          justify-center
          opacity-0
          scale-75
          group-hover:opacity-100
          group-hover:scale-100
          transition-all
          duration-500
          z-30
        "
      >
        <span className="text-xs">✨</span>
      </div>
    </div>
  );
}