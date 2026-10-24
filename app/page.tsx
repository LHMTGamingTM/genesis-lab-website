"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import ModelViewer3D, { preloadModel } from "./components/ModelViewer3D";
import { MODELS } from "./lib/models";
import CustomCursor from "./components/CustomCursor";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type CountryData = {
  displayName?: string;
  color: string;
  agency: string;
  rocket: string;
  desc: string;
};

type Ship = {
  id: string;
  code: string;
  name: string;
  role: string;
  color: string;
  borderColor: string;
  barColor: string;
  modelPath?: string;
  embedUrl: string;
  highlights: string[];
  specs: { label: string; value: number; unit: string }[];
};

// DỮ LIỆU 11 CƯỜNG QUỐC KHÔNG GIAN 
const highlightedCountries: Record<string, CountryData> = {
  "United States of America": { displayName: "UNITED STATES", agency: "NASA / SpaceX", rocket: "Starship • Falcon 9 • SLS", color: "#ef4444", desc: "Dẫn đầu công nghệ tên lửa đẩy tái sử dụng hoàn toàn, mạng lưới vệ tinh quỹ đạo thấp và các sứ mệnh đổ bộ Mặt Trăng (Artemis), Sao Hỏa." },
  "United States":            { displayName: "UNITED STATES", agency: "NASA / SpaceX", rocket: "Starship • Falcon 9 • SLS", color: "#ef4444", desc: "Dẫn đầu công nghệ tên lửa đẩy tái sử dụng hoàn toàn, mạng lưới vệ tinh quỹ đạo thấp và các sứ mệnh đổ bộ Mặt Trăng (Artemis), Sao Hỏa." },
  "Russia":                   { displayName: "RUSSIA",        agency: "ROSCOSMOS", rocket: "Soyuz-2 • Angara A5", color: "#dc2626", desc: "Quốc gia phóng vệ tinh đầu tiên của nhân loại (Sputnik-1). Vận hành hệ thống tàu chở người Soyuz có độ tin cậy cao nhất lịch sử." },
  "Russian Federation":       { displayName: "RUSSIA",        agency: "ROSCOSMOS", rocket: "Soyuz-2 • Angara A5", color: "#dc2626", desc: "Quốc gia phóng vệ tinh đầu tiên của nhân loại (Sputnik-1). Vận hành hệ thống tàu chở người Soyuz có độ tin cậy cao nhất lịch sử." },
  "China":                    { displayName: "CHINA",         agency: "CNSA", rocket: "Long March 5 • Long March 9", color: "#b91c1c", desc: "Vận hành độc lập Trạm vũ trụ Thiên Cung, hệ thống định vị Bắc Đẩu và thành công mang mẫu vật từ vùng tối Mặt Trăng về Trái Đất." },
  "India":                    { displayName: "INDIA",         agency: "ISRO", rocket: "LVM3 • PSLV", color: "#f97316", desc: "Quốc gia đầu tiên hạ cánh thành công xuống cực Nam Mặt Trăng (Chandrayaan-3) với chi phí tối ưu kỷ lục trong ngành hàng không vũ trụ." },
  "France":                   { displayName: "EUROPEAN SPACE AGENCY", agency: "ESA (France Lead)", rocket: "Ariane 6 • Vega-C", color: "#06b6d4", desc: "Trụ cột liên minh châu Âu. Sở hữu cảng vũ trụ Kourou gần xích đạo giúp tối ưu hóa lực đẩy cho các vệ tinh địa tĩnh và kính James Webb." },
  "Germany":                  { displayName: "EUROPEAN SPACE AGENCY", agency: "ESA (Member)", rocket: "Ariane 6 Upper Stage", color: "#0891b2", desc: "Trung tâm điều khiển sứ mệnh châu Âu (ESOC) và dẫn đầu chế tạo tầng đẩy nhiên liệu lỏng cho khối liên minh ESA." },
  "Italy":                    { displayName: "EUROPEAN SPACE AGENCY", agency: "ESA / ASI", rocket: "Vega-C • Pressurized Modules", color: "#0891b2", desc: "Chế tạo dòng tên lửa đẩy tầm trung Vega và hơn 50% thể tích các module điều áp cho Trạm Vũ trụ Quốc tế (ISS)." },
  "Spain":                    { displayName: "EUROPEAN SPACE AGENCY", agency: "ESA / AEE", rocket: "Ariane Composite Structures", color: "#0891b2", desc: "Đóng góp cấu trúc vật liệu sợi carbon siêu nhẹ cho tên lửa Ariane và tổ hợp ăng-ten không gian sâu tại Madrid." },
  "Japan":                    { displayName: "JAPAN",       agency: "JAXA", rocket: "H3 Launch Vehicle • Epsilon", color: "#ec4899", desc: "Đỉnh cao cơ khí chính xác: đổ bộ chính xác phạm vi dưới 100m trên Mặt Trăng (SLIM) và mang mẫu vật từ tiểu hành tinh Ryugu về Trái Đất." },
  "South Korea":              { displayName: "SOUTH KOREA", agency: "KASA / KARI", rocket: "Nuri (KSLV-II)", color: "#8b5cf6", desc: "Quốc gia thứ 7 trên thế giới tự chủ hoàn toàn công nghệ phóng vệ tinh nặng trên 1 tấn lên quỹ đạo bằng tên lửa nội địa Nuri." },
  "Korea":                    { displayName: "SOUTH KOREA", agency: "KASA / KARI", rocket: "Nuri (KSLV-II)", color: "#8b5cf6", desc: "Quốc gia thứ 7 trên thế giới tự chủ hoàn toàn công nghệ phóng vệ tinh nặng trên 1 tấn lên quỹ đạo bằng tên lửa nội địa Nuri." },
  "Israel":                   { displayName: "ISRAEL",      agency: "ISA", rocket: "Shavit-2", color: "#3b82f6", desc: "Quốc gia duy nhất phóng tên lửa ngược chiều tự quay của Trái Đất (về hướng Tây qua Địa Trung Hải) với dòng vệ tinh radar Ofeq siêu nét." },
  "Iran":                     { displayName: "IRAN",        agency: "ISA", rocket: "Simorgh • Qased • Qaem-100", color: "#10b981", desc: "Tự chủ chuỗi sản xuất tên lửa đẩy nhiên liệu rắn và lỏng để đưa các vệ tinh viễn thám nội địa lên quỹ đạo tầm thấp (LEO)." },
  "North Korea":              { displayName: "NORTH KOREA", agency: "NADA", rocket: "Chollima-1 • Unha", color: "#eab308", desc: "Sở hữu tổ hợp phóng vệ tinh Tây Hải (Sohae), tự triển khai vệ tinh trinh sát quang học lên quỹ đạo tầm thấp." },
  "Dem. Rep. Korea":          { displayName: "NORTH KOREA", agency: "NADA", rocket: "Chollima-1 • Unha", color: "#eab308", desc: "Sở hữu tổ hợp phóng vệ tinh Tây Hải (Sohae), tự triển khai vệ tinh trinh sát quang học lên quỹ đạo tầm thấp." },
  "United Kingdom":           { displayName: "UNITED KINGDOM", agency: "UKSA", rocket: "Black Arrow (1971) • ESA Partner", color: "#6366f1", desc: "Tự phóng thành công vệ tinh Prospero năm 1971. Hiện là trung tâm sản xuất vệ tinh cỡ nhỏ (SmallSat) hàng đầu châu Âu thuộc khối ESA." },
};

// DỮ LIỆU TÀU VŨ TRỤ
const spacecraftFleet: Ship[] = [
  {
    id: "ship-01",
    code: "SHIP-01 // STARSHIP",
    name: "SpaceX Starship",
    role: "Super Heavy-Lift Reusable System",
    color: "text-orange-500",
    borderColor: "border-orange-500/40",
    barColor: "bg-orange-500",
    modelPath: MODELS.starship.modelPath,
    embedUrl: MODELS.starship.embedUrl,
    highlights: [
      "Tổ hợp tên lửa cao 121m — lớn và mạnh nhất lịch sử nhân loại.",
      "Thu hồi tầng đẩy Super Heavy trực tiếp bằng cánh tay cơ khí Mechazilla.",
      "Vỏ thép không gỉ 304L kết hợp 18.000 viên gạch gốm chống nhiệt 1.400°C.",
    ],
    specs: [
      { label: "Liftoff Thrust", value: 98, unit: "74 - 81 MN (16.7M lbs)" },
      { label: "Payload to LEO", value: 100, unit: "100 – 150+ Metric Tons" },
      { label: "Propellant", value: 92, unit: "Sub-cooled CH4 / LOX" },
      { label: "Reusability", value: 100, unit: "100% Both Stages" },
    ],
  },
  {
    id: "ship-02",
    code: "SHIP-02 // ORION",
    name: "Artemis II Orion",
    role: "Deep Space Crew Exploration Vehicle",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/40",
    barColor: "bg-cyan-400",
    modelPath: MODELS.orion.modelPath,
    embedUrl: MODELS.orion.embedUrl,
    highlights: [
      "Tàu chở phi hành đoàn duy nhất hiện nay đạt chuẩn tái nhập từ quỹ đạo Mặt Trăng.",
      "Trang bị khiên chắn nhiệt Avcoat lớn nhất thế giới (đường kính 5m), chịu nhiệt 2.760°C.",
      "Hệ thống máy tính bay 4 luồng độc lập chống bức xạ vũ trụ.",
    ],
    specs: [
      { label: "Re-entry Velocity", value: 99, unit: "40,000 km/h (Mach 32)" },
      { label: "Service Module Delta-V", value: 85, unit: "1,800 m/s (ESA ESM)" },
      { label: "Crew Capacity", value: 80, unit: "4 Astronauts / 21 Days" },
      { label: "Radiation Shielding", value: 94, unit: "Deep-Space Storm Shelter" },
    ],
  },
  {
    id: "ship-03",
    code: "SHIP-03 // DISCOVERY",
    name: "Space Shuttle OV-103",
    role: "Reusable Orbital Spaceplane",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    barColor: "bg-emerald-400",
    modelPath: MODELS.discovery.modelPath,
    embedUrl: MODELS.discovery.embedUrl,
    highlights: [
      "Cất cánh thẳng đứng như tên lửa, hạ cánh lướt trên đường băng như máy bay.",
      "Hoàn thành 39 sứ mệnh (365 ngày trên vũ trụ) — nhiều nhất trong đội tàu con thoi NASA.",
      "Tàu trực tiếp đưa Kính viễn vọng Không gian Hubble lên quỹ đạo năm 1990.",
    ],
    specs: [
      { label: "Main Engines", value: 86, unit: "3x RS-25 (Liquid H2/O2)" },
      { label: "Cargo Bay Payload", value: 78, unit: "27,500 kg to LEO" },
      { label: "Thermal Protection", value: 90, unit: "24,300 Silica Tiles" },
      { label: "Total Distance Flown", value: 100, unit: "238 Million Miles" },
    ],
  },
];

const CARD_OUT_MS = 200;

const HERO_EMBED_URL =
  "https://sketchfab.com/models/d6521362b37b48e3a82bce4911409303/embed?autospin=1&autostart=1&preload=1&scrollwheel=0&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_watermark_link=0&ui_watermark=0";

// DANH SÁCH TÀI NGUYÊN PRELOAD
const PRELOAD_MODEL_FILES = Array.from(
  new Set(spacecraftFleet.map((s) => s.modelPath).filter((p): p is string => !!p))
);
const PRELOAD_FALLBACK_SHIPS = spacecraftFleet.filter((s) => !s.modelPath);
const TOTAL_PRELOAD_ASSETS = 1 + PRELOAD_MODEL_FILES.length + PRELOAD_FALLBACK_SHIPS.length;

// 3 MODULE SPACECRAFT ARCHITECTURE
const spaceModules = [
  {
    id: 1,
    title: "HULL & AIRFRAME",
    subtitle: "THERMAL & STRUCTURAL SHIELDING",
    metric: "1,400°C SILICA MATRIX",
    link: "/robot/chassis",
    img: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
    accentText: "text-orange-400",
    accentBadge: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    hoverGlow: "hover:border-orange-500/80 hover:shadow-[0_25px_70px_-10px_rgba(249,115,22,0.55)]",
    ambientGlow: "from-orange-500/30 via-transparent to-transparent",
    desc: "Kết cấu thép không gỉ 304L chịu lạnh sâu kết hợp lớp giáp gốm lục giác bảo vệ tàu khi lao qua bầu khí quyển ở vận tốc Mach 25.",
  },
  {
    id: 2,
    title: "QUANTUM NAV CORE",
    subtitle: "AUTONOMOUS FLIGHT AVIONICS",
    metric: "TRIPLE-REDUNDANT GNC",
    link: "/robot/ai-core",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    accentText: "text-cyan-400",
    accentBadge: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    hoverGlow: "hover:border-cyan-400/80 hover:shadow-[0_25px_70px_-10px_rgba(6,182,212,0.55)]",
    ambientGlow: "from-cyan-500/30 via-transparent to-transparent",
    desc: "Hệ thống máy tính bay kháng bức xạ vũ trụ, tự động tính toán quỹ đạo chuyển tiếp Địa-Nguyệt và ghép nối trạm không gian chính xác đến từng milimet.",
  },
  {
    id: 3,
    title: "DEEP SPACE RADAR",
    subtitle: "OPTICAL & INFRARED TELEMETRY",
    metric: "1.5M KM L2 ORBIT",
    link: "/robot/senses",
    img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80",
    accentText: "text-emerald-400",
    accentBadge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    hoverGlow: "hover:border-emerald-400/80 hover:shadow-[0_25px_70px_-10px_rgba(16,185,129,0.55)]",
    ambientGlow: "from-emerald-500/30 via-transparent to-transparent",
    desc: "Tổ hợp gương Beryllium mạ vàng và cảm biến hồng ngoại làm lạnh sâu, bắt trọn tín hiệu ánh sáng từ những thiên hà sơ khai cách 13,5 tỷ năm.",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set());
  const [forceDone, setForceDone] = useState(false);

  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHero3DInteractive, setIsHero3DInteractive] = useState(false);
  const altitudeBarRef = useRef<HTMLDivElement>(null);
  const altitudeTextRef = useRef<HTMLSpanElement>(null);

  const [activeShipIndex, setActiveShipIndex] = useState(0);
  const activeShip = spacecraftFleet[activeShipIndex];

  const [cardState, setCardState] = useState<"hidden" | "in" | "out">("hidden");
  const [selectedGeo, setSelectedGeo] = useState<string | null>(null);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; agency?: string; rocket?: string; desc: string; isActive: boolean } | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const module2Ref = useRef<HTMLElement>(null);
  const module3Ref = useRef<HTMLElement>(null);

  // PRELOAD TOÀN BỘ MODEL TRÊN LOADING SCREEN 
  const markLoaded = useCallback((key: string) => {
    setLoadedKeys((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("genesis_assets_cached") === "true") {
      setLoadProgress(100);
      setIsLoading(false);
      return;
    }

    PRELOAD_MODEL_FILES.forEach((path) => {
      preloadModel(path).then(() => markLoaded(path));
    });

    const safety = setTimeout(() => setForceDone(true), 20000);
    return () => clearTimeout(safety);
  }, [markLoaded]);

  const loadedCount = Math.min(loadedKeys.size, TOTAL_PRELOAD_ASSETS);
  const targetProgress = forceDone ? 100 : Math.round((loadedCount / TOTAL_PRELOAD_ASSETS) * 100);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadProgress((p) => (p < targetProgress ? Math.min(targetProgress, p + 2) : p));
    }, 30);
    return () => clearInterval(interval);
  }, [targetProgress, isLoading]);

  useEffect(() => {
    if (!isLoading || loadProgress < 100) return;
    sessionStorage.setItem("genesis_assets_cached", "true");
    const t = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(t);
  }, [loadProgress, isLoading]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderHidden(currentScrollY > lastScrollY && currentScrollY > 80);
      if (currentScrollY !== lastScrollY) setIsHero3DInteractive(false);
      lastScrollY = currentScrollY;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.round((currentScrollY / maxScroll) * 100)) : 0;
      if (altitudeBarRef.current) altitudeBarRef.current.style.height = `${pct}%`;
      if (altitudeTextRef.current) altitudeTextRef.current.textContent = `${pct}%`;
    };

    // Khóa lại thiên hà khi người dùng cuộn trang hoặc nhấn Esc
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsHero3DInteractive(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    const ctx = gsap.context(() => {
      if (heroTextRef.current && !isLoading) {
        gsap.fromTo(heroTextRef.current.children, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out" });
      }

      if (mainRef.current && !isLoading) {
        const steps = [
          { ref: showcaseRef, bg: "#080808", fg: "#ffffff" },
          { ref: module2Ref, bg: "#f3f4f6", fg: "#0a0a0a" },
          { ref: module3Ref, bg: "#000000", fg: "#ffffff" },
        ];
        let prev = { bg: "#000000", fg: "#ffffff" };
        steps.forEach((step) => {
          if (step.ref.current) {
            gsap.fromTo(
              mainRef.current,
              { backgroundColor: prev.bg, color: prev.fg },
              {
                backgroundColor: step.bg,
                color: step.fg,
                ease: "sine.inOut",
                immediateRender: false,
                scrollTrigger: {
                  trigger: step.ref.current,
                  start: "top 88%",
                  end: "top 18%",
                  scrub: 1.2,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
          prev = step;
        });
        // Tính lại vị trí layout 
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    }, mainRef);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      ctx.revert();
    };
  }, [isLoading]);

  const closeCard = () => {
    if (swapTimer.current) clearTimeout(swapTimer.current);
    setSelectedGeo(null);
    setCardState("out");
    swapTimer.current = setTimeout(() => setCardState("hidden"), CARD_OUT_MS);
  };

  const handleCountryClick = (geoName: string, countryData?: CountryData) => {
    const next = {
      name: countryData?.displayName || geoName,
      agency: countryData?.agency,
      rocket: countryData?.rocket,
      desc: countryData ? countryData.desc : "Chưa ghi nhận tổ hợp phóng tên lửa đẩy quỹ đạo độc lập tại khu vực này.",
      isActive: !!countryData,
    };

    if (swapTimer.current) clearTimeout(swapTimer.current);

    if (cardState === "in" && selectedGeo === geoName) {
      closeCard();
      return;
    }

    setSelectedGeo(geoName);

    if (cardState === "hidden") {
      setSelectedCountry(next);
      setCardState("in");
      return;
    }
    setCardState("out");
    swapTimer.current = setTimeout(() => {
      setSelectedCountry(next);
      setCardState("in");
    }, CARD_OUT_MS);
  };

  useEffect(() => {
    return () => {
      if (swapTimer.current) clearTimeout(swapTimer.current);
    };
  }, []);

  return (
    <main ref={mainRef} className={`bg-black text-white min-h-screen selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden ${isLoading ? "h-screen overflow-hidden" : ""}`}>

      <style dangerouslySetInnerHTML={{ __html: `
        .map-country { fill: #262626; stroke: #0a0a0a; stroke-width: 0.5px; outline: none; transition: fill 0.25s; }
        .map-country:hover { fill: #404040; }
        .map-country-highlight { stroke: #0a0a0a; stroke-width: 0.5px; outline: none; transition: opacity 0.25s, stroke 0.3s, stroke-width 0.3s; }
        .map-country-highlight:hover { opacity: 0.8; }
        .map-country { transition: fill 0.25s, stroke 0.3s, stroke-width 0.3s; }
        .map-country-selected { stroke: #ffffff !important; stroke-width: 1.4px !important; filter: drop-shadow(0 0 6px rgba(255,255,255,0.85)); }

        /* Popup quốc gia: bật lên có nảy nhẹ, thu lại nhanh; nội dung hiện lần lượt */
        @keyframes mapCardIn {
          0%   { opacity: 0; transform: translateY(-30px) scale(0.92); }
          55%  { opacity: 1; transform: translateY(5px) scale(1.015); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mapCardOut {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-22px) scale(0.94); }
        }
        @keyframes mapCardItem {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .map-card-in  { animation: mapCardIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .map-card-out { animation: mapCardOut 0.2s ease-in both; }
        .map-card-in .map-card-item { animation: mapCardItem 0.45s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .map-card-in, .map-card-out, .map-card-in .map-card-item { animation-duration: 0.01s; }
        }
      `}} />

      <CustomCursor />

      {/* SIDEBAR ORBITRAL */}
      <div className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 pointer-events-none mix-blend-difference">
        <span className="text-[9px] font-mono tracking-widest text-white/50 rotate-90 mb-3">ORBIT</span>
        <div className="w-[1.5px] h-32 bg-white/15 rounded-full overflow-hidden relative">
          <div ref={altitudeBarRef} className="w-full bg-cyan-400 transition-all duration-150" style={{ height: "0%" }} />
        </div>
        <span ref={altitudeTextRef} className="text-[10px] font-mono text-cyan-400 font-bold">0%</span>
      </div>

      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-6">
          <div className="w-72 md:w-96 flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold tracking-[0.35em] uppercase text-white mb-10">
              GENESIS // LAB
            </span>
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-white shadow-[0_0_15px_#ffffff] transition-all duration-150 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-gray-500 tracking-[0.25em]">
              {Math.round(loadProgress)}%
            </span>
            <span className="mt-3 text-[10px] font-mono text-gray-600 tracking-[0.2em] uppercase">
              Loading 3D assets {loadedCount}/{TOTAL_PRELOAD_ASSETS}
            </span>
          </div>

          {/* MODEL CACHE */}
          <div aria-hidden className="fixed -left-[9999px] top-0 w-[800px] h-[600px] opacity-0 pointer-events-none">
            {PRELOAD_FALLBACK_SHIPS.map((ship) => (
              <iframe
                key={ship.id}
                title={`preload-${ship.name}`}
                src={ship.embedUrl}
                onLoad={() => markLoaded(ship.id)}
                className="w-full h-full border-0"
              />
            ))}
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`fixed top-0 left-0 w-full p-6 md:px-12 z-50 flex justify-between items-center transition-transform duration-500 ease-in-out ${isHeaderHidden ? "-translate-y-full" : "translate-y-0"} bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm`}>
        <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-4 hover:opacity-70 transition-opacity mix-blend-difference group">
          <div className="flex flex-col justify-center items-start w-8 h-10 gap-2">
            <span className="w-8 h-[2px] bg-white block"></span>
            <span className="w-6 h-[2px] bg-white block transition-all duration-300 group-hover:w-8"></span>
          </div>
          <span className="hidden md:block text-xs font-mono tracking-widest uppercase text-white mt-1">Menu</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 mix-blend-difference cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="text-xl font-bold tracking-widest uppercase text-white">GENESIS // LAB</span>
        </div>

        <Link href="/robot" className="text-xs font-mono tracking-widest uppercase text-white/70 hover:text-cyan-400 transition-colors mix-blend-difference">
          3D Hangar →
        </Link>
      </header>

      {/* SIDEBAR */}
      <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`fixed top-0 left-0 h-full w-full md:w-[450px] bg-white text-black z-[70] transform transition-transform duration-500 ease-out flex flex-col shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 flex justify-between items-center">
          <span className="text-xl font-bold tracking-widest uppercase cursor-pointer" onClick={() => { setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>GENESIS // LAB</span>
          <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">✕</button>
        </div>
        <nav className="flex flex-col mt-4">
          {[
            { title: "Spacecraft Fleet", link: "#showcase" },
            { title: "Spacecraft Architecture", link: "#core-tech" },
            { title: "Orbital Launch Club", link: "#deployment" },
            { title: "3D Orbital Hangar", link: "/robot" },
            { title: "Assembly Log", link: "/experiment" },
            { title: "Mission Dispatches", link: "/news" },
          ].map((item, index) => (
            <Link key={index} href={item.link} onClick={() => setIsSidebarOpen(false)} className="flex justify-between items-center px-10 py-5 text-xl font-medium border-b border-gray-100 hover:bg-gray-50 hover:pl-12 transition-all duration-300 group">
              {item.title} <span className="text-gray-400 group-hover:text-black transition-colors">→</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* PAGE HERO */}
      <section id="overview" onMouseLeave={() => setIsHero3DInteractive(false)} className="relative w-full h-screen flex flex-col justify-end px-6 md:px-12 pb-24 md:pb-32 overflow-hidden text-white">
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <iframe
            title="Need some space?"
            src={HERO_EMBED_URL}
            onLoad={() => markLoaded("hero-embed")}
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking=""
            web-share=""
            className={`absolute inset-0 w-full h-full border-0 opacity-80 transition-opacity duration-500 ${
              isHero3DInteractive ? "pointer-events-auto" : "pointer-events-none"
            }`}
          />
          {!isHero3DInteractive && (
            <div onClick={() => setIsHero3DInteractive(true)} className="absolute inset-0 z-10 cursor-grab flex items-center justify-center" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none z-10"></div>
        </div>

        <div className="absolute bottom-8 right-6 md:right-12 z-30 flex items-center gap-3">
          <button onClick={() => setIsHero3DInteractive(!isHero3DInteractive)} className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-widest uppercase backdrop-blur-xl border transition-all duration-300 flex items-center gap-2.5 ${isHero3DInteractive ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]" : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10 hover:text-white"}`}>
            <span className={`w-2 h-2 rounded-full ${isHero3DInteractive ? "bg-cyan-400 animate-ping" : "bg-gray-500"}`}></span>
            {isHero3DInteractive ? "Drag to rotate · Esc to lock" : "Click to Rotate Galaxy"}
          </button>
        </div>

        <div className="relative z-20 max-w-4xl pointer-events-none" ref={heroTextRef}>
          <p className="text-cyan-400 font-mono text-xs tracking-widest mb-4 uppercase">// AEROSPACE ENGINEERING BRIEFING</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6">Forged for the stars, <br />built to explore.</h1>
          <div className="mt-10 pointer-events-auto inline-block">
            <button className="group flex items-center gap-4 text-xs md:text-sm uppercase tracking-widest border-b border-white pb-2 hover:border-cyan-400 hover:text-cyan-400 transition-colors" onClick={() => document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" })}>
              <span>Discover more</span><span className="group-hover:translate-x-2 transition-transform duration-300">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* MODULE 1 */}
      <section id="showcase" ref={showcaseRef} className="w-full min-h-screen flex flex-col items-center justify-center py-24 px-4 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

        <div className="z-10 text-center mb-10">
          <p className="text-cyan-500 font-mono text-xs tracking-widest mb-3 uppercase">{`// 01. Carousel Hangar`}</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">Iconic Spacecraft Lineup.</h2>
          <p className="text-gray-400 font-light max-w-xl mx-auto text-sm md:text-base px-4">
            Ba loại tên lửa đại diện cho 3 cột mốc của ngành hàng không vũ trụ.
          </p>
        </div>

        {/* NÚT CHUYỂN */}
        <div className="z-20 flex flex-wrap justify-center gap-3 mb-10 px-4">
          {spacecraftFleet.map((ship, idx) => (
            <button
              key={ship.id}
              onClick={() => setActiveShipIndex(idx)}
              className={`px-6 py-3 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 border backdrop-blur-xl ${
                activeShipIndex === idx ? `${ship.borderColor} bg-white/15 text-white scale-105 shadow-lg` : "border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {ship.code}
            </button>
          ))}
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch z-10 px-2 md:px-0">

          {/* 3DVIEWER */}
          <div className="lg:col-span-7 relative w-full h-[52vh] lg:h-auto min-h-[480px] rounded-3xl border border-white/10 bg-neutral-950 overflow-hidden flex items-center justify-center shadow-2xl">
            {/* WEBGL LOCK */}
            <div className="absolute inset-0 z-10">
              {activeShip.modelPath ? (
                <ModelViewer3D
                  src={activeShip.modelPath}
                  alt={activeShip.name}
                  autoRotate
                  exposure={1.4}
                  className="w-full h-full"
                />
              ) : (
                <iframe
                  key={activeShip.id}
                  title={activeShip.name}
                  src={activeShip.embedUrl}
                  loading="eager"
                  className="absolute top-1/2 left-1/2 w-[160%] h-[200%] -translate-x-1/2 -translate-y-1/2 scale-[0.65] border-0"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                />
              )}
            </div>

            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.85)] rounded-3xl"></div>

            <div className="absolute bottom-5 left-5 z-30 pointer-events-none flex items-center gap-2.5 text-[10px] md:text-[11px] font-mono text-gray-300 bg-black/80 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              360° MODEL VIEW — DRAG TO ROTATE
            </div>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <div className={`lg:col-span-5 flex flex-col justify-between p-8 md:p-10 rounded-3xl bg-neutral-900 border ${activeShip.borderColor} transition-colors duration-500 shadow-xl`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className={`font-mono text-xs tracking-widest uppercase font-bold ${activeShip.color}`}>{activeShip.code}</span>
                <span className="text-[10px] font-mono text-gray-400 border border-white/10 px-3 py-1 rounded-full uppercase bg-black/30">Technical Spec</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 text-white">{activeShip.name}</h3>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">{activeShip.role}</p>

              <ul className="space-y-2.5 mb-8 border-l-2 border-white/15 pl-4">
                {activeShip.highlights.map((point, idx) => (
                  <li key={idx} className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
                    • {point}
                  </li>
                ))}
              </ul>

              <div className="space-y-5 mb-8">
                {activeShip.specs.map((spec, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-gray-400 uppercase tracking-wider">{spec.label}</span>
                      <span className={`font-bold ${activeShip.color}`}>{spec.unit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${activeShip.barColor} transition-all duration-700 ease-out rounded-full`} style={{ width: `${spec.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
              <Link href="/robot" className="text-xs font-mono tracking-widest uppercase bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-transform hover:scale-105">
                Full Hangar View →
              </Link>
              <div className="flex gap-3">
                <button onClick={() => setActiveShipIndex((prev) => (prev === 0 ? spacecraftFleet.length - 1 : prev - 1))} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">←</button>
                <button onClick={() => setActiveShipIndex((prev) => (prev === spacecraftFleet.length - 1 ? 0 : prev + 1))} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">→</button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MODULE 2 */}
      <section id="core-tech" ref={module2Ref} className="w-full min-h-screen px-4 md:px-12 py-24 flex flex-col justify-center">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase opacity-50 mb-2">// 02. CORE SUBSYSTEMS</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Spacecraft Architecture.</h2>
          </div>
          <p className="text-sm md:text-base font-light tracking-wide opacity-75 max-w-md">
            Ba phân hệ cốt lõi quyết định khả năng sống sót của tàu vũ trụ: Khung vỏ chịu nhiệt, Máy tính điều hướng và Radar viễn thám.
          </p>
        </div>

        <div className="flex flex-col md:flex-row w-full h-[72vh] gap-6 md:gap-5 py-4">
          {spaceModules.map((module) => (
            <Link
              key={module.id}
              href={module.link}
              className={`group relative flex-1 hover:flex-[2.6] transition-all duration-700 ease-out cursor-pointer overflow-hidden rounded-3xl bg-neutral-900 border-2 border-neutral-800/80 transform hover:-translate-y-3 hover:scale-[1.01] ${module.hoverGlow} block`}
            >

              <img
                src={module.img}
                alt={module.title}
                className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out"
              />

              <div className={`absolute inset-0 bg-gradient-to-t ${module.ambientGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <span className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border backdrop-blur-md ${module.accentBadge}`}>
                  0{module.id} // {module.metric}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/30 group-hover:bg-white group-hover:shadow-[0_0_12px_#ffffff] transition-all duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                <p className={`font-mono text-xs tracking-widest mb-1.5 uppercase ${module.accentText}`}>
                  {module.subtitle}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight whitespace-nowrap mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {module.title}
                </h3>
                <p className="text-gray-200 font-light text-xs md:text-sm max-w-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 leading-relaxed">
                  {module.desc}
                </p>
                <div className="absolute bottom-8 right-8 w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 text-white">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MODULE 3 */}
      <section id="deployment" ref={module3Ref} className="w-full min-h-screen px-6 md:px-12 py-24 flex flex-col xl:flex-row items-center justify-between relative">
        <div className={`absolute top-8 left-6 md:top-12 md:left-12 w-[calc(100%-48px)] md:w-[420px] bg-neutral-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl z-50 flex flex-col shadow-[0_20px_50px_rgba(6,182,212,0.18)] ${cardState === "in" ? "map-card-in pointer-events-auto" : cardState === "out" ? "map-card-out pointer-events-none" : "opacity-0 pointer-events-none"}`}>
          <div className="p-6 md:p-8 flex flex-col h-full relative overflow-hidden">
            {selectedCountry?.isActive && <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[50px] bg-cyan-500/25 blur-3xl rounded-full pointer-events-none transition-opacity duration-500"></div>}

            <div className="map-card-item flex justify-between items-start mb-4 z-10" style={{ animationDelay: "90ms" }}>
              <div>
                <p className="text-[11px] font-mono text-cyan-400 tracking-widest mb-1 uppercase">
                  {selectedCountry?.agency ? `// AGENCY: ${selectedCountry.agency}` : "// ORBITAL REGISTRY"}
                </p>
                <h3 className="text-xl md:text-2xl font-bold tracking-wider text-white uppercase">{selectedCountry?.name}</h3>
              </div>
              <button onClick={closeCard} className="text-gray-400 hover:text-white transition-colors text-lg w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 shrink-0 ml-2">✕</button>
            </div>

            {selectedCountry?.rocket && (
              <div className="map-card-item mb-4 z-10" style={{ animationDelay: "160ms" }}>
                <span className="inline-block text-[11px] font-mono text-orange-300 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
                  Launchers: {selectedCountry.rocket}
                </span>
              </div>
            )}

            <p className="map-card-item text-gray-300 font-light leading-relaxed text-sm mb-6 z-10" style={{ animationDelay: "230ms" }}>{selectedCountry?.desc}</p>

            <div className="map-card-item pt-4 border-t border-white/10 flex items-center z-10" style={{ animationDelay: "300ms" }}>
              <span className={`text-xs font-mono tracking-widest uppercase flex items-center gap-3 ${selectedCountry?.isActive ? "text-green-400" : "text-neutral-500"}`}>
                <span className="relative flex h-2.5 w-2.5">
                  {selectedCountry?.isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${selectedCountry?.isActive ? "bg-green-500" : "bg-neutral-600"}`}></span>
                </span>
                {selectedCountry?.isActive ? "ORBITAL LAUNCH CAPABILITY: VERIFIED" : "NO INDEPENDENT LAUNCH SYSTEM"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-1/3 mb-16 xl:mb-0 z-10 pointer-events-none flex flex-col justify-end pt-64 xl:pt-0">
          <p className="text-cyan-400 font-mono text-xs tracking-widest mb-3">{`// 03. GLOBAL SPACEFARING NATIONS`}</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-5">Orbital Launch Club.</h2>
          <p className="text-gray-400 font-light tracking-wide max-w-sm mb-8 text-sm leading-relaxed">
            Bản đồ 11 quốc gia và liên minh sở hữu năng lực tự phóng vệ tinh lên quỹ đạo bằng tên lửa đẩy nội địa (Click vào từng quốc gia để xem dòng tên lửa chủ lực).
          </p>
          <div className="flex gap-10">
            <div><p className="text-3xl font-bold text-white mb-1">11</p><p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Launch Powers</p></div>
            <div><p className="text-3xl font-bold text-white mb-1">LEO / GEO</p><p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Orbital Reach</p></div>
          </div>
        </div>

        <div className="w-full xl:w-2/3 h-[50vh] md:h-[70vh] flex justify-end items-center cursor-crosshair relative">
          <ComposableMap projectionConfig={{ scale: 150 }} className="w-full h-full max-w-4xl opacity-95">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoName: string = geo.properties?.name || "Unknown";
                  const countryData = highlightedCountries[geoName];
                  // Nước đang được chọn: thêm class để viền trắng + phát sáng (CSS ở thẻ <style>)
                  const baseClass = countryData ? "map-country-highlight" : "map-country";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geoName, countryData)}
                      className={selectedGeo === geoName ? `${baseClass} map-country-selected` : baseClass}
                      fill={countryData ? countryData.color : undefined}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-black text-white pt-24 pb-10 px-6 md:px-12 border-t border-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="flex-1">
            <h4 className="text-xl font-bold tracking-widest uppercase mb-6 cursor-pointer inline-block" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>GENESIS // LAB</h4>
            <p className="text-gray-400 font-light text-sm max-w-sm">Aerospace engineering showcase & interactive 3D spacecraft telemetry archive.</p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h5 className="font-bold tracking-widest uppercase text-sm mb-2 text-white/50">Modules</h5>
              <Link href="/robot" className="text-gray-300 hover:text-white text-sm transition-colors">3D Hangar</Link>
              <Link href="/experiment" className="text-gray-300 hover:text-white text-sm transition-colors">Assembly Log</Link>
              <Link href="/news" className="text-gray-300 hover:text-white text-sm transition-colors">Dispatches</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h5 className="font-bold tracking-widest uppercase text-sm mb-2 text-white/50">Institution</h5>
              <a href="https://github.com/LHMTGamingTM/genesis-lab-website" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-sm transition-colors">Github</a>
              <a href="https://thptnguyenhuuhuan.hcm.edu.vn/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-sm transition-colors">Nguyen Huu Huan High School</a>
              <Link href="/policy" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy & Policy</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-gray-400 text-xs tracking-wider">© 2026 Lê Huỳnh Minh Trí - 12A5. All rights reserved.</p>
          <p className="text-gray-600 text-[10px] uppercase tracking-widest max-w-xl">
            Educational project. Spacecraft 3D assets and telemetry data are used for non-commercial academic demonstration.
          </p>
        </div>
      </footer>
    </main>
  );
}
