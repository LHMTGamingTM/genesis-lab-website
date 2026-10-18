"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import ModelStage from "../../components/ModelStage";
import YouTubeEmbed from "../../components/YouTubeEmbed";
import { MODELS } from "../../lib/models";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const hullLogs = [
  {
    id: 1,
    step: "01",
    title: "30X Cryo-Stainless Steel",
    desc: "Chế tạo từ hợp kim thép không gỉ 304L cán nguội, tăng cường độ bền cực đại ở nhiệt độ âm sâu của nhiên liệu lỏng và chịu nhiệt độ tái nhập khí quyển.",
    tag: "CRYO-ALLOY",
    img: "https://www.spacex.com/assets/images/vehicles/starship/mobile/starship_carousel2_card4_v2_m.jpg?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    step: "02",
    title: "Hexagonal Heat Shield",
    desc: "Hơn 18.000 tấm gạch gốm Silica hình lục giác được gắn tự động, bảo vệ tàu khỏi luồng plasma 1.400°C khi lao vào bầu khí quyển ở vận tốc Mach 25.",
    tag: "THERMAL ARMOR",
    img: "https://cordis.europa.eu/docs/article/images/2025-02/456306.jpg?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    step: "03",
    title: "Raptor Vacuum Chamber",
    desc: "Khung gầm tích hợp giá đỡ chịu lực cho cụm 6 động cơ Raptor đốt cháy Methane lỏng và Oxy lỏng theo chu trình khép kín toàn phần.",
    tag: "PROPULSION BAY",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/27/SpaceX_sea-level_Raptor_at_Hawthorne_-_2.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    step: "04",
    title: "Aero-Grid Fins & Flaps",
    desc: "Hệ thống cánh tà khí động học điều khiển bằng mô-tơ điện công suất cao, giúp con tàu giữ thăng bằng rơi tự do và hạ cánh thẳng đứng.",
    tag: "AERODYNAMICS",
    img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Falcon_9_grid_fins_%2829255027214%29.jpg/1280px-Falcon_9_grid_fins_%2829255027214%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function ChassisPage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" });
      }

      const section = horizontalSectionRef.current;
      const wrapper = scrollWrapperRef.current;
      if (section && wrapper) {
        const distance = () => Math.max(0, wrapper.scrollWidth - window.innerWidth);
        gsap.to(wrapper, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${wrapper.scrollWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="bg-black text-white min-h-screen selection:bg-orange-500 selection:text-black font-sans overflow-x-hidden">
      <SiteHeader accent="orange" />

      {/* SECTION 1: 3D MODEL HERO */}
      <section className="w-full min-h-screen pt-32 pb-12 px-6 md:px-12 flex flex-col">
        <div className="w-full flex justify-between items-end mb-8" ref={heroRef}>
          <div>
            <p className="text-orange-500 font-mono text-xs tracking-widest mb-4 uppercase">// SUBSYSTEM 01 — STARSHIP AIRFRAME</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">Hull &<br />Airframe.</h1>
          </div>
          <p className="hidden md:block max-w-sm text-gray-400 font-light text-sm leading-relaxed text-right pb-2">
            Lớp giáp nhiệt và bộ khung siêu trọng tải. Được chế tạo để vượt qua sức ép tái nhập khí quyển và bức xạ liên hành tinh.
          </p>
        </div>

        <div className="flex-1 w-full min-h-[50vh] relative bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden">
          <ModelStage model={MODELS.starship} />
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]"></div>
          <p className="absolute bottom-6 left-6 text-xs font-mono text-orange-400 bg-black/80 px-4 py-2 rounded-full border border-orange-500/30 z-20 pointer-events-none">
            ● 360° STRUCTURAL INSPECTION (DRAG TO ROTATE)
          </p>
        </div>
      </section>

      {/* SECTION 2: HORIZONTAL TIMELINE */}
      <section ref={horizontalSectionRef} className="w-full h-screen bg-[#050505] overflow-hidden flex items-center border-t border-b border-white/5 relative">
        <div className="absolute top-12 left-12 text-xs font-mono text-orange-500 tracking-widest uppercase">// Airframe Engineering Pipeline</div>

        <div ref={scrollWrapperRef} className="flex h-[65vh] md:h-[72vh] w-max px-12 md:px-32 items-center gap-12 md:gap-24 will-change-transform">
          {hullLogs.map((log) => (
            <div key={log.id} className="w-[85vw] md:w-[580px] h-full flex flex-col justify-between shrink-0">
              <div className="w-full h-[60%] bg-neutral-900 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-orange-500/50 transition-colors duration-500">
                {/* eager: ảnh nằm ngoài màn hình do bị dịch ngang, lazy sẽ làm ảnh hiện trễ khi cuộn */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={log.img} alt={log.title} decoding="async" className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              </div>

              <div className="h-[36%] flex flex-col pt-6 border-t border-white/10 mt-6 relative">
                <div className="absolute -top-[5px] left-0 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]"></div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-4xl font-bold tracking-tighter opacity-25">{log.step}</span>
                  <span className="text-[10px] font-mono tracking-widest uppercase border border-orange-500/40 px-3 py-1 rounded-full text-orange-400">{log.tag}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{log.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{log.desc}</p>
              </div>
            </div>
          ))}

          <div className="w-[300px] h-full flex items-center justify-center shrink-0">
            <Link href="/robot/ai-core" className="text-xs font-mono text-orange-400 hover:text-white tracking-widest uppercase border border-orange-500/40 px-6 py-4 rounded-full">
              NEXT: QUANTUM NAV →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: VIDEO */}
      <section className="w-full py-32 px-6 md:px-12 bg-black flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-16">
          <p className="text-orange-500 font-mono text-xs tracking-widest mb-4 uppercase">// FLIGHT TEST TELEMETRY</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Atmospheric Re-entry & Catch.</h2>
          <p className="text-gray-400 font-light tracking-wide text-sm md:text-base">Ghi hình thực tế quá trình thử nghiệm chịu nhiệt của khung vỏ Starship và thu hồi tầng đẩy Super Heavy.</p>
        </div>

        <div className="w-full max-w-6xl aspect-video bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <YouTubeEmbed id="hI9HQfCAw64" title="SpaceX Starship Flight Test" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
