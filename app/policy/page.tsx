"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";

export default function PolicyPage() {
  const mainRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(textRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="bg-black text-white min-h-screen selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      <SiteHeader accent="cyan" variant="solid" />

      <section className="w-full pt-48 pb-32 px-6 md:px-12 min-h-screen flex justify-center">
        <div className="max-w-3xl w-full" ref={textRef}>
          <p className="text-cyan-500 font-mono text-xs tracking-widest mb-6 uppercase">// LEGAL & TERMS</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16">Privacy & Policy.</h1>

          <div className="space-y-12 text-gray-400 font-light leading-relaxed text-sm md:text-base">
            <div>
              <h2 className="text-xl font-bold text-white mb-4 tracking-tight">1. Mục đích Giáo dục (Educational Purpose)</h2>
              <p className="mb-4">
                Trang web <strong>GENESIS // LAB</strong> được xây dựng và phát triển hoàn toàn vì mục đích học tập, nghiên cứu khoa học kỹ thuật và trưng bày dự án cá nhân (Portfolio). Mọi thiết kế giao diện, kiến trúc mã nguồn và trải nghiệm tương tác đều được thực hiện bởi học sinh <strong>Lê Huỳnh Minh Trí - Lớp 12A5 (Trường THPT Nguyễn Hữu Huân)</strong>.
              </p>
              <p>Đây KHÔNG phải là một website thương mại và không đại diện chính thức cho bất kỳ cơ quan hàng không vũ trụ hay tập đoàn công nghệ nào.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 tracking-tight">2. Bản quyền Tài sản Kỹ thuật số & Mô hình 3D (Credits)</h2>
              <p className="mb-4">
                Các mô hình 3D tàu vũ trụ (SpaceX Starship, NASA Artemis II Orion, Space Shuttle Discovery OV-103), hình ảnh thiên văn và tư liệu video xuất hiện trên trang web này thuộc bản quyền của các tác giả gốc trên nền tảng Sketchfab (Clarence365, Zaineb Aljumayaat, The Smithsonian Institution), Unsplash, SpaceX và NASA. Chúng tôi chỉ sử dụng dưới dạng nhúng (Embed) phi thương mại nhằm minh họa cho giao diện học tập.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4 tracking-tight">3. Quyền riêng tư & Dữ liệu Người dùng (Privacy Policy)</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Tuyệt đối KHÔNG thu thập dữ liệu cá nhân của người truy cập.</li>
                <li>KHÔNG yêu cầu đăng nhập, điền biểu mẫu hay cung cấp thông tin liên lạc.</li>
                <li>KHÔNG sử dụng Cookie theo dõi thương mại.</li>
              </ul>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-xs font-mono tracking-widest text-gray-500 uppercase">Cập nhật lần cuối: Tháng 10, 2026 — GENESIS // LAB.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
