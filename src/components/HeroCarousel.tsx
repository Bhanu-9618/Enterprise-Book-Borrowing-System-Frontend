"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";

const carouselItems = [
  {
    image: "/images/hero-1.png",
    title: "Unlock a World of Knowledge",
    description: "Explore thousands of books ranging from timeless classics to the latest bestsellers. Your next great adventure starts here.",
    cta: "Explore Catalog",
    color: "from-indigo-400 via-purple-400 to-pink-400",
  },
  {
    image: "/images/hero-2.png",
    title: "Borrowing Made Effortless",
    description: "No more long queues. Request your favorite books online and pick them up at your convenience. Simple, fast, and digital.",
    cta: "How it Works",
    color: "from-amber-400 via-orange-400 to-yellow-400",
  },
  {
    image: "/images/hero-3.png",
    title: "Join Our Community of Readers",
    description: "Become a member today to track your reading history, manage borrowings, and stay updated on new arrivals.",
    cta: "Join Now",
    color: "from-emerald-400 via-teal-400 to-cyan-400",
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
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="relative h-[85vh] min-h-[600px] w-full pl-0">
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

                  <p className="text-lg font-medium text-slate-300 sm:text-xl max-w-xl mb-10 leading-relaxed opacity-90">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-5">
                    <Button
                      size="lg"
                      className="h-14 rounded-full bg-white px-10 text-neutral-900 transition-all hover:scale-[1.03] hover:bg-neutral-100 hover:shadow-2xl hover:shadow-white/20 active:scale-[0.98]"
                    >
                      <span className="flex items-center gap-2.5 text-base font-black">
                        {item.cta}
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-12 right-6 sm:right-12 z-20 flex gap-4">
          <CarouselPrevious className="static h-14 w-14 translate-y-0 border-white/20 bg-white/5 text-white hover:bg-white/20 hover:text-white backdrop-blur-md" />
          <CarouselNext className="static h-14 w-14 translate-y-0 border-white/20 bg-white/5 text-white hover:bg-white/20 hover:text-white backdrop-blur-md" />
        </div>
      </Carousel>

      {/* Dynamic bottom curve or fade */}
      <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
