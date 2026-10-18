"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mq = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const styleEl = document.createElement("style");
    styleEl.textContent = `*, *::before, *::after, a, button, input, [role="button"] { cursor: none !important; }`;
    document.head.appendChild(styleEl);

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.05 });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.05 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power2.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power2.out" });

    let shown = false;
    const setVisible = (v: boolean) => {
      dot.style.opacity = v ? "1" : "0";
      ring.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: MouseEvent) => {
      if (!shown) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        shown = true;
        setVisible(true);
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (coordsRef.current) coordsRef.current.textContent = `${e.clientX}:${e.clientY}`;
    };

    const onOver = (e: MouseEvent) => {
      if (!shown) return;
      setVisible(!(e.target instanceof HTMLIFrameElement));
    };
    const onLeaveWindow = () => setVisible(false);
    const onEnterWindow = () => shown && setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
      gsap.killTweensOf([dot, ring]);
      styleEl.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="hidden lg:block fixed top-0 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full pointer-events-none z-[90] mix-blend-difference transition-opacity duration-200"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="hidden lg:flex fixed top-0 left-0 w-9 h-9 border border-white/25 rounded-full pointer-events-none z-[90] items-center justify-center mix-blend-difference transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <span ref={coordsRef} className="absolute left-11 text-[9px] font-mono text-white/40 whitespace-nowrap tracking-widest">
          0:0
        </span>
      </div>
    </>
  );
}
