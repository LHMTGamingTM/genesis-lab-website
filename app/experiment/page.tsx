"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const experimentLogs = [
  {
    id: 1,
    date: "T-MINUS 12 MONTHS",
    stage: "CRYO-STEEL ROLLING",
    title: "Starship Ring Forging.",
    desc: "Những cuộn thép không gỉ 304L khổng lồ được uốn tròn và hàn tự động bằng tia laser trong nhà máy Mega Bay, tạo nên lớp vỏ chịu áp suất cực đại cho tàu vũ trụ.",
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    date: "T-MINUS 06 MONTHS",
    stage: "PROPULSION INTEGRATION",
    title: "33x Raptor Engine Array.",
    desc: "Lắp đặt cụm 33 động cơ tên lửa Raptor vào tầng đẩy Super Heavy. Mỗi động cơ là một kiệt tác cơ khí đốt cháy Methane lỏng ở áp suất buồng đốt kỷ lục.",
    img: "https://universemagazine.com/wp-content/uploads/2022/07/fwrdyf4xoamvpbk.jpg?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    date: "T-MINUS 30 DAYS",
    stage: "AVIONICS & HEAT SHIELD",
    title: "Thermal Tile & Quantum Nav.",
    desc: "Tích hợp máy tính điều hướng lượng tử và phủ kín bụng tàu bằng 18.000 viên gạch gốm cách nhiệt nhằm chuẩn bị cho pha tái nhập khí quyển rực lửa.",
    img: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    date: "T-MINUS 48 HOURS",
    stage: "FULL STACKING",
    title: "Mechazilla Orbital Stack.",
    desc: "Cánh tay robot khổng lồ (Chopsticks) tại tháp phóng nâng con tàu Starship đặt lên đỉnh tên lửa đẩy Super Heavy, hoàn thiện cấu trúc cao 121 mét.",
    img: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    date: "T-ZERO // LIFTOFF",
    stage: "ORBITAL INSERTION",
    title: "Ignition & Beyond The Stars.",
    desc: "Nạp đầy 4.500 tấn nhiên liệu lạnh sâu. Kích hoạt toàn bộ động cơ đẩy đưa con tàu vượt qua tầng khí quyển, chính thức tiến vào quỹ đạo không gian.",
    img: "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function ExperimentPage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 });
      }

      gsap.fromTo(
        ".timeline-line",
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: timelineContainerRef.current,
            start: "top 50%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="bg-black text-white min-h-screen selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      <SiteHeader accent="cyan" />

      {/* HERO */}
      <section className="w-full pt-48 pb-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center" ref={heroRef}>
          <p className="text-cyan-500 font-mono text-xs tracking-widest mb-6 uppercase">// ORBITAL ASSEMBLY TIMELINE</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8">
            Forging a <br /> Spaceship.
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light tracking-wide">
            Nhật ký kỹ thuật ghi lại toàn bộ quá trình chế tạo tàu vũ trụ: từ những cuộn thép không gỉ thô sơ đến khoảnh khắc khai hỏa rời bệ phóng.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="w-full py-24 px-6 md:px-12 bg-[#0a0a0a] relative">
        <div className="max-w-6xl mx-auto relative" ref={timelineContainerRef}>
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2">
            <div className="timeline-line w-full bg-gradient-to-b from-cyan-500 via-cyan-400 to-orange-500 shadow-[0_0_15px_#06b6d4]"></div>
          </div>

          {experimentLogs.map((log, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={log.id} className={`timeline-item relative w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-32 md:mb-40 group ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-black border-2 border-cyan-500 transform -translate-x-[7px] md:-translate-x-1/2 mt-[45px] md:mt-0 z-10 group-hover:bg-cyan-500 group-hover:shadow-[0_0_20px_#06b6d4] transition-all duration-500"></div>

                <div className={`w-full md:w-[45%] pl-16 md:pl-0 mt-8 md:mt-0 ${isEven ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                  <p className="font-mono text-xs text-gray-500 tracking-widest mb-3">{log.date}</p>
                  <p className="font-mono text-xs text-cyan-500 tracking-widest mb-2 flex items-center gap-2 md:justify-end">
                    {!isEven && <span className="hidden md:inline-block w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>}
                    {log.stage}
                    {isEven && <span className="hidden md:inline-block w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight mb-4 text-white group-hover:text-cyan-400 transition-colors duration-300">{log.title}</h3>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">{log.desc}</p>
                </div>

                <div className="w-full pl-16 md:pl-0 md:w-[45%] mt-8 md:mt-0">
                  <div className="w-full aspect-video bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden relative group-hover:border-cyan-500/40 transition-colors duration-500 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={log.img} alt={log.title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="min-h-[50vh] bg-black flex flex-col items-center justify-center px-6 text-center border-t border-white/10">
        <p className="text-cyan-500 font-mono text-xs tracking-widest mb-6 uppercase">// ASSEMBLY COMPLETE</p>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">Cleared for Launch.</h2>
        <Link href="/robot" className="px-8 py-4 bg-white text-black font-bold tracking-widest uppercase text-xs rounded-full hover:scale-105 transition-transform duration-300">
          Inspect 3D Hangar →
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
