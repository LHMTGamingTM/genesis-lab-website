"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import ModelStage from "../../components/ModelStage";
import YouTubeEmbed from "../../components/YouTubeEmbed";
import { MODELS } from "../../lib/models";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const aiCoreLogs = [
  {
    id: 1,
    step: "01",
    title: "Autonomous Trajectory Calc",
    desc: "Tính toán quỹ đạo chuyển tiếp Địa-Nguyệt (Trans-Lunar Injection) theo thời gian thực, tự động hiệu chỉnh đường bay không cần tín hiệu từ mặt đất.",
    tag: "ORBITAL MATH",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    step: "02",
    title: "Micro-Debris Evasion",
    desc: "Xử lý dữ liệu từ hàng trăm cảm biến bề mặt để phát hiện và kích hoạt động cơ phản lực điều hướng né tránh rác vũ trụ ở vận tốc 28.000 km/h.",
    tag: "COLLISION AVOIDANCE",
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    step: "03",
    title: "Triple-Redundant Avionics",
    desc: "Kiến trúc máy tính bay 3 lớp dự phòng độc lập, chống bức xạ tia vũ trụ (Cosmic Rays) đảm bảo hệ thống không bao giờ sập nguồn giữa không gian sâu.",
    tag: "RAD-HARDENED",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    step: "04",
    title: "Automated Docking Protocol",
    desc: "Thuật toán thị giác máy tính dẫn đường ghép nối tự động vào trạm không gian với độ lệch chuẩn dưới 1 milimet.",
    tag: "PRECISION DOCKING",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function AICorePage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" });
      }

      gsap.utils.toArray<HTMLElement>(".ai-card").forEach((card) => {
        gsap.to(card, {
          scale: 0.95,
          opacity: 0.85,
          scrollTrigger: {
            trigger: card,
            start: "top 12%",
            endTrigger: ".cards-container",
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="bg-black text-white min-h-screen selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      <SiteHeader accent="cyan" />

      {/* HERO */}
      <section className="w-full min-h-screen pt-32 pb-12 px-6 md:px-12 flex flex-col">
        <div className="w-full flex justify-between items-end mb-8" ref={heroRef}>
          <div>
            <p className="text-cyan-500 font-mono text-xs tracking-widest mb-4 uppercase">// SUBSYSTEM 02 — ARTEMIS AVIONICS</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">Quantum<br />Nav Core.</h1>
          </div>
          <p className="hidden md:block max-w-sm text-gray-400 font-light text-sm leading-relaxed text-right pb-2">
            Bộ não điện toán điều hướng liên hành tinh. Tự động tính toán quỹ đạo hấp dẫn và duy trì sự sống trong không gian sâu.
          </p>
        </div>

        <div className="flex-1 w-full min-h-[50vh] relative bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden">
          <ModelStage model={MODELS.orion} />
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]"></div>
          <p className="absolute bottom-6 left-6 text-xs font-mono text-cyan-400 bg-black/80 px-4 py-2 rounded-full border border-cyan-500/30 z-20 pointer-events-none">
            ● 360° ORION SPACECRAFT VIEW (DRAG TO ROTATE)
          </p>
        </div>
      </section>

      {/* STACKING CARDS  */}
      <section className="w-full py-32 bg-[#050505]">
        <div className="text-center mb-16">
          <p className="text-cyan-500 font-mono text-xs tracking-widest uppercase">// NEURAL FLIGHT CONTROL STACK</p>
        </div>
        <div className="cards-container max-w-5xl mx-auto px-6 relative pb-32">
          {aiCoreLogs.map((log) => (
            <div
              key={log.id}
              className="ai-card w-full h-[62vh] md:h-[68vh] bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 mb-24 flex flex-col md:flex-row gap-8 items-center shadow-[0_-15px_40px_rgba(0,0,0,0.7)] transform origin-top will-change-transform"
            >
              <div className="flex-1">
                <span className="text-6xl font-bold text-cyan-500/20">{log.step}</span>
                <h3 className="text-3xl font-bold mt-2 mb-4">{log.title}</h3>
                <p className="text-gray-300 font-light leading-relaxed">{log.desc}</p>
                <span className="inline-block mt-6 text-[10px] font-mono border border-cyan-500/50 px-3 py-1 rounded-full text-cyan-400">{log.tag}</span>
              </div>
              <div className="flex-1 w-full h-full bg-black/50 rounded-2xl border border-white/10 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={log.img} alt={log.title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-85" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section className="w-full py-32 px-6 md:px-12 bg-black flex flex-col items-center">
        <div className="max-w-4xl w-full text-center mb-16">
          <p className="text-cyan-500 font-mono text-xs tracking-widest mb-4 uppercase">// MISSION SIMULATION</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Artemis Lunar Trajectory.</h2>
          <p className="text-gray-400 font-light tracking-wide text-sm md:text-base">Mô phỏng toàn bộ hành trình điều hướng của tàu Orion đưa phi hành gia bay vòng quanh Mặt Trăng và quay về Trái Đất.</p>
        </div>

        <div className="w-full max-w-6xl aspect-video bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <YouTubeEmbed id="Ke6XX8FHOHM" title="NASA Artemis Mission" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
