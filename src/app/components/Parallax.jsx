"use client"
import { useRef } from "react";
import { ScrollParallax } from "react-just-parallax";

export const ParallaxBackground = () => {
  const parallaxRef = useRef(null);

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden h-screen" ref={parallaxRef}>
      <ScrollParallax>
        <img
          src="/back.jpg"
          className="w-full h-screen object-cover absolute top-0 left-0"
          alt="Background"
          width={1440}
          height={1800}
        />
      </ScrollParallax>
    </div>
  );
};