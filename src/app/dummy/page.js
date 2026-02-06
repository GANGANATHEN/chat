"use client";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const container = document.querySelector(".particle-container");
    if (!container) return;

    container.innerHTML = "";

    const PARTICLE_COUNT = 750; // more density

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("div");
      p.classList.add("particle");

      const angle = Math.random() * Math.PI * 2;

      // spawn high in center
      const radius = Math.random() ** 0.5 * 140;

      const startX = 150 + Math.cos(angle) * radius;
      const startY = 150 + Math.sin(angle) * radius;

      // long travel = smooth flow
      const endX = Math.cos(angle) * 600;
      const endY = Math.sin(angle) * 600;

      const size = Math.random() * 4 + 2; // 2px – 6px

      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      p.style.setProperty("--x", `${endX}px`);
      p.style.setProperty("--y", `${endY}px`);

      // video feel
      p.style.animationDuration = `${Math.random() * 3 + 2}s`;
      p.style.animationDelay = `${Math.random() * 2}s`;

      container.appendChild(p);
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="circle">
        <div className="particle-container"></div>
      </div>
    </div>
  );
};

export default Page;
