"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";

const carouselItems = [
  {
    image: "/images/hero-1.png",
    title: "Unlock a World of Knowledge",
    description: "Explore thousands of books ranging from timeless classics to the latest bestsellers. Your next great adventure starts here.",
    color: "from-blue-400 via-sky-400 to-cyan-400",
  },
  {
    image: "/images/hero-2.png",
    title: "Borrowing Made Effortless",
    description: "No more long queues. Request your favorite books online and pick them up at your convenience. Simple, fast, and digital.",
    color: "from-blue-500 via-blue-400 to-sky-400",
  },
  {
    image: "/images/hero-3.png",
    title: "Join Our Community of Readers",
    description: "Become a member today to track your reading history, manage borrowings, and stay updated on new arrivals.",
    color: "from-blue-600 via-blue-500 to-blue-400",
  },
];

export function HeroCarousel() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({ delay: 4000, stopOnInteraction: false }),
        ]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="relative h-[60vh] min-h-[400px] w-full pl-0">
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover brightness-[0.4] transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
              </div>

              <div className="relative z-10 flex h-full max-w-7xl flex-col justify-center px-6 sm:px-12 lg:px-20 mx-auto">
                <div className="max-w-3xl">
                  <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[0.9] mb-6">
                    {item.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className={`block bg-gradient-to-r ${item.color} bg-clip-text text-transparent italic`}>
                      {item.title.split(" ").slice(-1)}
                    </span>
                  </h1>

                  <p className="text-lg font-medium text-slate-300 sm:text-xl max-w-xl leading-relaxed opacity-90">
                    {item.description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
