"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";

const heroImages = [
  "/images/cars/premium-blue-suv-showroom-hero.webp",
  "/images/cars/webfrontpage2.webp",
  "/images/cars/webfrontpage.webp",
  "/images/cars/luxury-sedan-sunset-cityscape.webp",
  "/images/cars/luxury-kia-suv-sunset.webp",
  "/images/cars/luxury-ev-showroom-sunset.webp",
];
const rotatingHeadlines = ["Know the car first.", "Buy with confidence.", "Drive with clarity."] as const;

export function Hero() {
  const [activeImage, setActiveImage] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedText(rotatingHeadlines[0]);
      return;
    }

    let position = 0;
    let deleting = false;
    let headlineIndex = 0;
    let timeout: number;

    const animate = () => {
      const headline = rotatingHeadlines[headlineIndex];
      if (!deleting) {
        position += 1;
        setTypedText(headline.slice(0, position));
        if (position >= headline.length) {
          deleting = true;
          timeout = window.setTimeout(animate, 2200);
          return;
        }
      } else {
        position -= 1;
        setTypedText(headline.slice(0, position));
        if (position <= 0) {
          deleting = false;
          headlineIndex = (headlineIndex + 1) % rotatingHeadlines.length;
          timeout = window.setTimeout(animate, 500);
          return;
        }
      }
      timeout = window.setTimeout(animate, 75);
    };

    timeout = window.setTimeout(animate, 75);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] overflow-hidden bg-ink text-white">
      {heroImages.map((image, index) => (
        <div
          key={image}
          aria-hidden="true"
          className={`absolute inset-0 -z-10 bg-cover bg-center transition-opacity duration-1000 ${index === activeImage ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url("${image}")` }}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
      <div className="container-x relative z-10 flex w-full flex-col justify-center py-24 md:py-32">
        <p className="eyebrow mb-5 text-sm text-amber md:text-base">Used Car Inspection &amp; New Car PDI Inspection</p>
        <h1 className="display max-w-3xl text-[clamp(2.5rem,5.4vw,5.75rem)]">
          Inspect before you buy.<br />
          <span aria-hidden="true" className="text-amber">{typedText}<span className="ml-1 inline-block h-[0.82em] w-[3px] translate-y-[0.06em] animate-pulse bg-amber" /></span>
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="max-w-md text-lg text-white/80">Professional vehicle inspection, PDI and automotive assistance.</p>
            <div className="mt-5"><SocialLinks /></div>
          </div>
          <div className="flex flex-col gap-3 md:translate-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/inspection-type">Request Inspection</Button>
              <Button href="#services" variant="light">Explore Services</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
