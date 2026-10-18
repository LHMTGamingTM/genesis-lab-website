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

const sensesLogs = [
  {
    id: 1,
    step: "01",
    title: "Multi-Spectrum Telemetry",
    desc: "Hệ thống radar băng tần K và X-Band quét không gian 3 chiều, định vị chính xác các thiên thể và tàu trạm ở khoảng cách hàng triệu kilomet.",
    tag: "DEEP SPACE RADAR",
    metric: "RANGE: 2.5M KM",
    img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    step: "02",
    title: "Infrared Star Tracker",
    desc: "Cụm kính viễn vọng hồng ngoại tự động khóa mục tiêu vào các chòm sao cố định để xác định tư thế góc của tàu vũ trụ với độ chính xác 0.0001 độ.",
    tag: "STAR TRACKING",
    metric: "PRECISION: 0.0001°",
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    step: "03",
    title: "Thermal Re-entry Sensors",
    desc: "Mạng lưới hàng ngàn cảm biến nhiệt quang học gắn dưới bụng tàu, giám sát sự phân bổ nhiệt độ ma sát khí quyển theo thời gian thực.",
    tag: "THERMAL IMAGING",
    metric: "MAX TEMP: 1,650°C",
    img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    step: "04",
    title: "Laser Comm Array",
    desc: "Truyền tải dữ liệu hình ảnh độ phân giải 8K từ quỹ đạo Mặt Trăng về Trái Đất thông qua chùm tia Laser quang học tốc độ Gigabit.",
    tag: "OPTICAL LINK",
    metric: "BANDWIDTH: 1.2 GBPS",
    img: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=800&q=80",
  },
];

export default function SensesPage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 });
      }

      // Chỉ animate opacity/transform (GPU-friendly). Bỏ filter: blur() vì buộc vẽ lại từng frame.
      gsap.utils.toArray<HTMLElement>(".focus-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.2, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="bg-black text-white min-h-screen selection:bg-emerald-500 selection:text-black font-sans overflow-x-hidden">
      <SiteHeader accent="emerald" />

      {/* HERO: 3D JAMES WEBB */}
      <section className="w-full min-h-screen pt-32 pb-12 px-6 md:px-12 flex flex-col">
        <div className="w-full flex justify-between items-end mb-8" ref={heroRef}>
          <div>
            <p className="text-emerald-500 font-mono text-xs tracking-widest mb-4 uppercase">// SUBSYSTEM 03 — ORBITAL SENSORS</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">Deep Space<br />Radar.</h1>
          </div>
          <p className="hidden md:block max-w-sm text-gray-400 font-light text-sm leading-relaxed text-right pb-2">
            Mắt thần viễn thám và thiên văn quang học. Quét xuyên qua bụi tinh vân và dẫn đường chính xác trong bóng tối vũ trụ.
          </p>
        </div>

        <div className="flex-1 w-full min-h-[50vh] relative bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden">
          {/* JWST chưa có file cục bộ nên dùng iframe nạp lười. Khi có public/models/jwst.glb, điền modelPath trong lib/models.ts */}
          <ModelStage model={MODELS.jwst} />
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]"></div>
          <p className="absolute bottom-6 left-6 text-xs font-mono text-emerald-400 bg-black/80 px-4 py-2 rounded-full border border-emerald-500/30 z-20 pointer-events-none">
            ● 360° JAMES WEBB TELESCOPE VIEW (DRAG TO ROTATE)
          </p>
        </div>
      </section>

      {/* TELEMETRY CARDS */}
      <section className="w-full py-24 bg-[#050505] border-t border-white/5">
        <div className="text-center mb-16">
          <p className="text-emerald-500 font-mono text-xs tracking-widest uppercase mb-2">// OPTICAL TELEMETRY ARRAY</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sensor Calibration Modules.</h2>
        </div>

        <div className="max-w-5xl mx-auto px-6 space-y-16 pb-16">
          {sensesLogs.map((log, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={log.id}
                className={`focus-item w-full p-6 md:p-10 rounded-3xl bg-neutral-900/80 border border-emerald-500/20 hover:border-emerald-500/50 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-12 items-center transition-colors duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
              >
                <div className="w-56 h-56 md:w-64 md:h-64 shrink-0 rounded-full border-2 border-emerald-500/40 p-2 relative flex items-center justify-center bg-black shadow-[0_0_40px_rgba(16,185,129,0.15)] group overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={log.img} alt={log.title} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full opacity-85 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-4 rounded-full border border-dashed border-emerald-400/30 pointer-events-none"></div>
                  <div className="absolute w-full h-[1px] bg-emerald-400/20 pointer-events-none"></div>
                  <div className="absolute h-full w-[1px] bg-emerald-400/20 pointer-events-none"></div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                    <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      MODULE {log.step} // {log.tag}
                    </span>
                    <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">[{log.metric}]</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-white">{log.title}</h3>
                  <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base">{log.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VIDEO */}
      <section className="w-full py-28 px-6 md:px-12 bg-black flex flex-col items-center border-t border-white/5">
        <div className="max-w-4xl w-full text-center mb-16">
          <p className="text-emerald-500 font-mono text-xs tracking-widest mb-4 uppercase">// ARCHIVE FOOTAGE</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Deploying The Eye of Humanity.</h2>
          <p className="text-gray-400 font-light tracking-wide text-sm md:text-base">Tàu con thoi Discovery và các sứ mệnh triển khai, bảo dưỡng Kính viễn vọng Không gian trên quỹ đạo.</p>
        </div>

        <div className="w-full max-w-6xl aspect-video bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <YouTubeEmbed id="dCEKQTTN6ig" title="Space Shuttle Discovery Launch" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
