"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import CustomCursor from "./CustomCursor";

export type Accent = "cyan" | "orange" | "emerald";

// Class Tailwind phải viết đầy đủ (không ghép chuỗi) để Tailwind nhận diện.
const ACCENT_HOVER: Record<Accent, string> = {
  cyan: "hover:text-cyan-400",
  orange: "hover:text-orange-400",
  emerald: "hover:text-emerald-400",
};

export const NAV_ITEMS = [
  { title: "Home", link: "/" },
  { title: "Spacecraft Fleet", link: "/#showcase" },
  { title: "Spacefaring Nations", link: "/#deployment" },
  { title: "3D Orbital Hangar", link: "/robot" },
  { title: "01. Hull & Airframe", link: "/robot/chassis" },
  { title: "02. Quantum Nav Core", link: "/robot/ai-core" },
  { title: "03. Deep Space Radar", link: "/robot/senses" },
  { title: "Assembly Log", link: "/experiment" },
  { title: "Mission Dispatches", link: "/news" },
];

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > last && y > 80);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

type HeaderProps = {
  accent?: Accent;
  variant?: "gradient" | "solid";
  right?: ReactNode;
};

export function SiteHeader({ accent = "cyan", variant = "gradient", right }: HeaderProps) {
  const hidden = useHideOnScroll();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const bar =
    variant === "solid"
      ? "bg-black/80 backdrop-blur-md border-b border-white/5"
      : "bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm";

  return (
    <>
      <CustomCursor />
      <header
        className={`fixed top-0 left-0 w-full p-6 md:px-12 z-50 flex justify-between items-center transition-transform duration-500 ease-in-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${bar}`}
      >
        <button onClick={() => setOpen(true)} className="flex items-center gap-4 hover:opacity-70 transition-opacity group" aria-label="Open menu">
          <div className="flex flex-col justify-center items-start w-8 h-10 gap-2">
            <span className="w-8 h-[2px] bg-white block"></span>
            <span className="w-6 h-[2px] bg-white block transition-all duration-300 group-hover:w-8"></span>
          </div>
          <span className="hidden md:block text-xs font-mono tracking-widest uppercase text-white mt-1">Menu</span>
        </button>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-xl font-bold tracking-widest uppercase text-white hover:text-gray-300 transition-colors">GENESIS // LAB</span>
        </Link>

        {right ?? (
          <Link href="/robot" className={`text-xs font-mono tracking-widest uppercase text-gray-400 ${ACCENT_HOVER[accent]} transition-colors`}>
            Hangar →
          </Link>
        )}
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-[450px] bg-white text-black z-[70] transform transition-transform duration-500 ease-out flex flex-col shadow-2xl overflow-y-auto ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-8 flex justify-between items-center">
          <Link href="/" onClick={() => setOpen(false)} className="text-xl font-bold tracking-widest uppercase hover:opacity-70">GENESIS // LAB</Link>
          <button onClick={() => setOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Close menu">✕</button>
        </div>
        <nav className="flex flex-col mt-2 pb-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setOpen(false)}
              className="flex justify-between items-center px-10 py-5 text-lg font-medium border-b border-gray-100 hover:bg-gray-50 hover:pl-12 transition-all duration-300 group"
            >
              {item.title} <span className="text-gray-400 group-hover:text-black transition-colors">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export function SiteFooter({
  disclaimer = "Disclaimer: This website is created for educational purposes only. It is not intended for commercial use.",
}: {
  disclaimer?: string;
}) {
  return (
    <footer className="w-full bg-black text-white pt-24 pb-10 px-6 md:px-12 border-t border-white/5 z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold tracking-widest uppercase mb-6 inline-block hover:opacity-70 transition-opacity">GENESIS // LAB</Link>
          <p className="text-gray-400 font-light text-sm max-w-sm block">Pushing humanity beyond the horizon. Autonomous spacecraft systems engineered for the final frontier.</p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <h5 className="font-bold tracking-widest uppercase text-sm mb-2 text-white/50">Discover</h5>
            <Link href="/#showcase" className="text-gray-300 hover:text-white text-sm transition-colors">Spacecraft</Link>
            <Link href="/#core-tech" className="text-gray-300 hover:text-white text-sm transition-colors">Orbital Tech</Link>
            <Link href="/#deployment" className="text-gray-300 hover:text-white text-sm transition-colors">Space Powers</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-bold tracking-widest uppercase text-sm mb-2 text-white/50">Social</h5>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Github</a>
            <a href="https://thptnguyenhuuhuan.hcm.edu.vn/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-sm transition-colors">Nguyen Huu Huan High School</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col gap-4">
        <p className="text-gray-400 text-xs tracking-wider">© 2026 Lê Huỳnh Minh Trí - 12A5. All rights reserved.</p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest leading-relaxed max-w-3xl">{disclaimer}</p>
          <Link href="/policy" className="text-gray-500 hover:text-white text-xs tracking-widest uppercase transition-colors shrink-0">Privacy & Policy</Link>
        </div>
      </div>
    </footer>
  );
}
