"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const newsArticles = [
  {
    id: 1,
    date: "OCT 15, 2026",
    category: "HEAVY LAUNCH",
    title: "Starship Flight Test: Super Heavy Booster Caught Mid-Air.",
    desc: "Cánh tay cơ khí Mechazilla tại Starbase đã tóm gọn tầng đẩy tên lửa Super Heavy ngay trên không trung sau khi hoàn thành chu trình bay quỹ đạo.",
    img: "https://cdn.arstechnica.net/wp-content/uploads/2024/10/starship_flight5_catch1.jpg?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    date: "SEP 28, 2026",
    category: "LUNAR PROGRAM",
    title: "Artemis II Orion Completes Vacuum Chamber Testing.",
    desc: "Tàu vũ trụ Orion của NASA vượt qua toàn bộ các bài kiểm tra bức xạ điện từ và môi trường chân không cực hạn trước sứ mệnh đưa phi hành gia bay quanh Mặt Trăng.",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    date: "SEP 10, 2026",
    category: "DEEP SPACE",
    title: "Next-Gen Laser Telemetry Achieves 267 Mbps from Deep Space.",
    desc: "Hệ thống liên lạc quang học tia laser mới đã truyền thành công dữ liệu video độ phân giải siêu cao từ khoảng cách xa gấp 80 lần khoảng cách Địa-Nguyệt.",
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    date: "AUG 22, 2026",
    category: "HERITAGE",
    title: "Honoring Space Shuttle Discovery (OV-103) Legacy.",
    desc: "Kỷ niệm hành trình 238 triệu dặm bay quanh quỹ đạo của tàu con thoi Discovery — biểu tượng mở đường cho Trạm Vũ trụ Quốc tế (ISS) và Kính viễn vọng Hubble.",
    img: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function NewsPage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" });
      }

      if (gridRef.current) {
        gsap.fromTo(
          ".news-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="bg-black text-white min-h-screen selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      <SiteHeader accent="cyan" variant="solid" />

      {/* HERO */}
      <section className="w-full pt-48 pb-20 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto" ref={heroRef}>
          <p className="text-cyan-500 font-mono text-xs tracking-widest mb-6 uppercase">// ORBITAL TELEMETRY & DISPATCHES</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8">
            Mission <br /> Dispatches.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light tracking-wide">
            Cập nhật những cột mốc phóng tên lửa, thử nghiệm tàu vũ trụ và thành tựu thám hiểm không gian sâu mới nhất.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="w-full py-24 px-6 md:px-12 min-h-screen">
        <div ref={gridRef} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {newsArticles.map((article, i) => (
            <article key={article.id} className="news-card group cursor-pointer flex flex-col">
              <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden mb-6 rounded-2xl border border-white/10">
                <img
                  src={article.img}
                  alt={article.title}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">{article.category}</span>
                  <span className="text-xs font-mono text-gray-500 tracking-widest">{article.date}</span>
                </div>

                <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-cyan-400 transition-colors duration-300">{article.title}</h3>

                <p className="text-gray-400 font-light text-sm leading-relaxed mb-8 flex-1">{article.desc}</p>

                <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white mt-auto">
                  <span className="border-b border-white pb-1 group-hover:border-cyan-400 transition-colors">Read Dispatch</span>
                  <span className="group-hover:translate-x-2 group-hover:text-cyan-400 transition-all duration-300">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
