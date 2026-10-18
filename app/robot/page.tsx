"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import ModelStage from "../components/ModelStage";
import { MODELS } from "../lib/models";

const fleet = [
  {
    model: MODELS.starship,
    code: "SHIP-01 // STARSHIP",
    role: "Super Heavy-Lift Launch Vehicle",
    color: "text-orange-500",
    borderColor: "border-orange-500/40",
    barColor: "bg-orange-500",
    specs: [
      { label: "Max Thrust", value: 95, unit: "74,000 kN" },
      { label: "Payload to LEO", value: 100, unit: "150 Tons" },
      { label: "Reusability", value: 95, unit: "Fully Reusable" },
      { label: "Mission Profile", value: 90, unit: "Multi-planetary" },
    ],
  },
  {
    model: MODELS.orion,
    code: "SHIP-02 // ORION",
    role: "Deep Space Crew Vehicle",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/40",
    barColor: "bg-cyan-400",
    specs: [
      { label: "Heat Shield", value: 98, unit: "Lunar Re-entry" },
      { label: "Delta-V Cap", value: 85, unit: "1,800 m/s" },
      { label: "Crew Limit", value: 75, unit: "4 Astronauts" },
      { label: "Life Support", value: 80, unit: "21 Days" },
    ],
  },
  {
    model: MODELS.discovery,
    code: "SHIP-03 // DISCOVERY",
    role: "Orbital Spacecraft System",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    barColor: "bg-emerald-400",
    specs: [
      { label: "Max Thrust", value: 80, unit: "3x RS-25" },
      { label: "Payload to LEO", value: 65, unit: "27.5 Tons" },
      { label: "Thermal Armor", value: 90, unit: "Silica Tiles" },
      { label: "Status", value: 100, unit: "Retired / Legend" },
    ],
  },
];

const SHIP_PATHS = fleet.map((s) => s.model.modelPath).filter((p): p is string => !!p);

export default function RobotGalleryPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const unit = fleet[activeIndex];
  
  useEffect(() => {
    let dead = false;
    let cancel = () => {};
    // import động: không kéo three.js vào bundle đầu của trang
    import("../components/ModelViewer3D").then((m) => {
      if (!dead) cancel = m.preloadModelsWhenIdle(SHIP_PATHS);
    });
    return () => {
      dead = true;
      cancel();
    };
  }, []);

  return (
    <main className="bg-black text-white min-h-screen font-sans flex flex-col justify-between overflow-x-hidden relative selection:bg-cyan-500 selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: `
        /* Mỗi lần đổi tàu: tên + bảng thông số trượt lên và các thanh chỉ số chạy lại từ 0 */
        @keyframes hangarSwap { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes hangarBar { from { width: 0; } }
        .hangar-swap { animation: hangarSwap 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both; }
        .hangar-bar { animation: hangarBar 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both; }
        @media (prefers-reduced-motion: reduce) { .hangar-swap, .hangar-bar { animation-duration: 0.01s; animation-delay: 0s; } }
      `}} />
      <SiteHeader
        right={
          <Link href="/experiment" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group">
            <span className="hidden md:block text-xs font-mono tracking-widest uppercase mt-1">Assembly Log</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        }
      />

      <section className="flex-1 flex flex-col items-center justify-center relative pt-32 pb-24 px-6 md:px-12 min-h-[90vh]">
        <div className="z-10 w-full max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-1">// 3D ORBITAL HANGAR</p>
              <h1 key={unit.model.id} className="hangar-swap text-3xl md:text-5xl font-bold tracking-tighter">{unit.model.name}</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              {fleet.map((u, idx) => (
                <button
                  key={u.model.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all border ${
                    activeIndex === idx ? `${u.borderColor} bg-white/15 text-white scale-105` : "border-white/10 bg-white/5 text-gray-500 hover:text-white"
                  }`}
                >
                  0{idx + 1}. {u.model.name.split(" ")[1] || u.model.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full h-[58vh] md:h-[68vh] border border-white/10 rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl">
            <ModelStage model={unit.model} />

            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.85)] rounded-3xl"></div>

            <div className={`hidden md:flex flex-col justify-between absolute top-6 right-6 bottom-6 w-80 p-6 rounded-2xl bg-black/85 border z-30 transition-colors duration-500 ${unit.borderColor}`}>
              <div key={unit.model.id} className="hangar-swap">
                <p className={`text-xs font-mono uppercase tracking-widest mb-1 font-bold ${unit.color}`}>{unit.code}</p>
                <p className="text-xs font-mono text-gray-400 mb-6">{unit.role}</p>

                <div className="space-y-4">
                  {unit.specs.map((s, i) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-[11px] font-mono mb-1.5">
                        <span className="text-gray-300 uppercase">{s.label}</span>
                        <span className={unit.color}>{s.unit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`hangar-bar h-full ${unit.barColor}`} style={{ width: `${s.value}%`, animationDelay: `${0.3 + i * 0.08}s` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[11px] font-mono text-gray-400">
                <span>TELEMETRY: ONLINE</span>
                <span className="text-green-400">● FLIGHT READY</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center relative z-20">
            <Link href="/robot/chassis" className="relative group px-10 py-4 rounded-full bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:bg-orange-500/10 hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] shadow-lg w-full md:w-auto text-center">
              <span className="relative z-10 text-orange-500 text-xs font-mono tracking-widest uppercase font-semibold">01. Hull & Airframe</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </Link>

            <Link href="/robot/ai-core" className="relative group px-10 py-4 rounded-full bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] shadow-lg w-full md:w-auto text-center">
              <span className="relative z-10 text-cyan-400 text-xs font-mono tracking-widest uppercase font-semibold">02. Quantum Nav Core</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </Link>

            <Link href="/robot/senses" className="relative group px-10 py-4 rounded-full bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] shadow-lg w-full md:w-auto text-center">
              <span className="relative z-10 text-emerald-400 text-xs font-mono tracking-widest uppercase font-semibold">03. Deep Space Radar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter disclaimer="Disclaimer: This website is created for educational purposes only. It is not intended for commercial use. All spacecraft designs, 3D models, and concepts belong to their respective creators and owners." />
    </main>
  );
}
