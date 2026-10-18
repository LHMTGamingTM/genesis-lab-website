"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ModelAsset } from "../lib/models";

// tách chunk model
const ModelViewer3D = dynamic(() => import("./ModelViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono tracking-widest text-gray-500 pointer-events-none">
      LOADING MODEL…
    </div>
  ),
});

function LazyIframe({ title, src }: { title: string; src: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden">
      {mounted && (
        <iframe
          title={title}
          src={src}
          className="absolute top-1/2 left-1/2 w-[160%] h-[200%] -translate-x-1/2 -translate-y-1/2 scale-[0.65] border-0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      )}
    </div>
  );
}

type Props = {
  model: ModelAsset;
  enableZoom?: boolean;
  exposure?: number;
};

export default function ModelStage({ model, enableZoom = false, exposure = 1.3 }: Props) {
  return (
    <div className="absolute inset-0">
      {model.modelPath ? (
        <ModelViewer3D
          src={model.modelPath}
          alt={model.name}
          autoRotate
          enableZoom={enableZoom}
          exposure={exposure}
          className="w-full h-full"
        />
      ) : (
        <LazyIframe key={model.embedUrl} title={model.name} src={model.embedUrl} />
      )}
    </div>
  );
}
