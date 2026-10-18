"use client";

import { memo, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const DRACO_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";
const BASIS_PATH = "/basis/"; // chỉ cần khi model dùng texture KTX2 (gltfpack -tc)

export function getModelFormat(src: string): "glb" | "ply" | "unknown" {
  const ext = src.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  if (ext === "glb" || ext === "gltf") return "glb";
  if (ext === "ply") return "ply";
  return "unknown";
}

/* ------------------------- Loader + cache dùng chung ------------------------- */
// Mỗi file chỉ được tải + giải nén (Meshopt/Draco) ĐÚNG 1 LẦN.
// Đổi qua lại giữa các model sau đó gần như tức thì và không tạo lại renderer.

const modelCache = new Map<string, Promise<THREE.Object3D>>();
let sharedGltfLoader: GLTFLoader | null = null;

function getGltfLoader(): GLTFLoader {
  if (sharedGltfLoader) return sharedGltfLoader;

  const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
  const ktx2 = new KTX2Loader().setTranscoderPath(BASIS_PATH);
  try {
    // detectSupport cần 1 renderer; dùng renderer tạm rồi giải phóng ngay
    const probe = new THREE.WebGLRenderer();
    ktx2.detectSupport(probe);
    probe.dispose();
    probe.forceContextLoss();
  } catch {
    /* không có WebGL: bỏ qua, lỗi sẽ hiện ở viewer */
  }

  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.setKTX2Loader(ktx2);
  loader.setMeshoptDecoder(MeshoptDecoder); // Meshopt: đi kèm trong package three
  sharedGltfLoader = loader;
  return loader;
}

/** Chuẩn hóa: co về ~2 đơn vị và đưa tâm về gốc tọa độ. */
function normalize(object: THREE.Object3D): THREE.Object3D {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  object.scale.multiplyScalar(2 / maxDim);
  const box2 = new THREE.Box3().setFromObject(object);
  object.position.sub(box2.getCenter(new THREE.Vector3()));
  const wrapper = new THREE.Group();
  wrapper.add(object);
  return wrapper;
}

async function loadPly(src: string): Promise<THREE.Object3D> {
  const geo = await new PLYLoader().loadAsync(src);
  const hasColor = !!geo.getAttribute("color");
  let object: THREE.Object3D;
  if (geo.getIndex()) {
    if (!geo.getAttribute("normal")) geo.computeVertexNormals();
    object = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        vertexColors: hasColor,
        color: hasColor ? 0xffffff : 0xcfd8dc,
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.DoubleSide,
      })
    );
  } else {
    object = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.012,
        sizeAttenuation: true,
        vertexColors: hasColor,
        color: hasColor ? 0xffffff : 0x67e8f9,
      })
    );
  }
  return normalize(object);
}

function loadModel(src: string): Promise<THREE.Object3D> {
  const cached = modelCache.get(src);
  if (cached) return cached;

  const format = getModelFormat(src);
  const promise: Promise<THREE.Object3D> =
    format === "glb"
      ? getGltfLoader().loadAsync(src).then((gltf) => normalize(gltf.scene))
      : format === "ply"
      ? loadPly(src)
      : Promise.reject(new Error(`Unsupported format: ${src}`));

  modelCache.set(src, promise);
  // Nếu lỗi thì xóa khỏi cache để lần sau có thể thử lại
  promise.catch(() => modelCache.delete(src));
  return promise;
}

/** Gọi trên loading screen để tải + giải nén sẵn model. Không bao giờ throw. */
export function preloadModel(src: string): Promise<void> {
  return loadModel(src).then(
    () => undefined,
    () => undefined
  );
}

/**
 * Tải trước nhiều model khi trình duyệt rảnh, lần lượt từng file (không chiếm băng thông cùng lúc).
 * Trả về hàm hủy để gọi trong cleanup của useEffect.
 */
export function preloadModelsWhenIdle(paths: string[]): () => void {
  if (typeof window === "undefined") return () => {};
  let cancelled = false;
  const run = async () => {
    for (const path of paths) {
      if (cancelled) return;
      await preloadModel(path);
    }
  };
  // Safari chưa có requestIdleCallback nên kiểm tra lúc chạy, rồi dùng setTimeout thay thế
  const hasIdle = typeof window.requestIdleCallback === "function";
  const id = hasIdle
    ? window.requestIdleCallback(() => void run(), { timeout: 2500 })
    : window.setTimeout(() => void run(), 800);
  return () => {
    cancelled = true;
    if (hasIdle) window.cancelIdleCallback(id);
    else window.clearTimeout(id);
  };
}

/* --------------------------------- Component --------------------------------- */

export type ModelViewer3DProps = {
  src: string;
  alt?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  /** false: viewer bỏ qua chuột/cảm ứng (dùng làm nền trang trí). */
  interactive?: boolean;
  enableZoom?: boolean;
  exposure?: number;
  /** Kích thước điểm cho file .ply dạng point cloud (đơn vị đã chuẩn hóa). */
  pointSize?: number;
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
};

const OUT_MS = 260; // model cũ thu nhỏ + mờ dần
const IN_MS = 800; // model mới xoay vào + phóng to có nảy nhẹ
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeOutBack = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

type Anim = {
  phase: "idle" | "out" | "in";
  start: number;
  fromOpacity: number;
  fromScale: number;
  next: THREE.Object3D | null;
  nextSrc: string | null;
};

type Ctx = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  current: THREE.Object3D | null;
  currentSrc: string | null;
  opacity: number;
  anim: Anim;
  onSwapped: () => void;
};

function ModelViewer3DInner({
  src,
  alt = "3D model",
  autoRotate = false,
  autoRotateSpeed = 2,
  interactive = true,
  enableZoom = true,
  exposure = 1.2,
  pointSize = 0.012,
  className,
  style,
  onLoad,
}: ModelViewer3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<Ctx | null>(null);
  const autoRotateRef = useRef(autoRotate);
  const onLoadRef = useRef(onLoad);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  autoRotateRef.current = autoRotate;
  onLoadRef.current = onLoad;

  // 1) Khởi tạo renderer + scene MỘT LẦN (không tạo lại khi đổi model)
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(3, 4, 5);
    scene.add(key);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 200);
    camera.position.set(0, 0.5, 4.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    // OrbitControls đặt touch-action:none -> chạm vào model sẽ không cuộn được trang trên điện thoại.
    // pan-y: vuốt dọc vẫn cuộn trang, vuốt ngang để xoay model.
    renderer.domElement.style.touchAction = "pan-y";

    renderer.domElement.style.opacity = "0";
    const ctx: Ctx = {
      scene,
      camera,
      controls,
      renderer,
      current: null,
      currentSrc: null,
      opacity: 0,
      anim: { phase: "idle", start: 0, fromOpacity: 0, fromScale: 1, next: null, nextSrc: null },
      onSwapped: () => {
        setStatus("ready");
        onLoadRef.current?.();
      },
    };
    ctxRef.current = ctx;

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Chỉ render khi viewer đang nhìn thấy và tab đang mở -> không tốn GPU khi cuộn đi chỗ khác
    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(host);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!inView || document.hidden) return;

      // Hiệu ứng đổi model (theo thời gian thực nên không phụ thuộc tốc độ khung hình)
      const a = ctx.anim;
      if (a.phase !== "idle") {
        const now = performance.now();
        if (a.phase === "out") {
          const p = Math.min(1, (now - a.start) / OUT_MS);
          const e = p * p;
          ctx.opacity = a.fromOpacity * (1 - e);
          ctx.current?.scale.setScalar(a.fromScale * (1 - 0.15 * e));
          if (p >= 1 && a.next) {
            if (ctx.current) {
              scene.remove(ctx.current);
              ctx.current.scale.setScalar(1);
              ctx.current.rotation.y = 0;
            }
            ctx.current = a.next;
            ctx.currentSrc = a.nextSrc;
            a.next = null;
            scene.add(ctx.current);
            camera.position.set(0, 0.5, 4.2);
            controls.target.set(0, 0, 0);
            controls.update();
            a.phase = "in";
            a.start = now;
            ctx.onSwapped();
          }
        }
        if (a.phase === "in" && ctx.current) {
          const p = Math.min(1, (now - a.start) / IN_MS);
          const eo = easeOutCubic(p);
          ctx.opacity = Math.min(1, eo * 1.6);
          ctx.current.scale.setScalar(0.8 + 0.2 * easeOutBack(p));
          ctx.current.rotation.y = -Math.PI * 0.6 * (1 - eo);
          if (p >= 1) {
            a.phase = "idle";
            ctx.opacity = 1;
            ctx.current.scale.setScalar(1);
            ctx.current.rotation.y = 0;
          }
        }
        renderer.domElement.style.opacity = String(ctx.opacity);
      }

      controls.autoRotate = !!autoRotateRef.current;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      envTexture.dispose();
      pmrem.dispose();
      // KHÔNG dispose model: chúng nằm trong cache dùng chung
      if (ctx.current) scene.remove(ctx.current);
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      ctxRef.current = null;
    };
  }, []);

  // 2) Cập nhật các thiết lập nhẹ mà không dựng lại gì
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.renderer.toneMappingExposure = exposure;
    ctx.controls.enableZoom = enableZoom;
    ctx.controls.autoRotateSpeed = autoRotateSpeed;
  }, [exposure, enableZoom, autoRotateSpeed]);

  // 3) Đổi model: chỉ hoán đổi object trong scene (model cũ giữ nguyên tới khi model mới sẵn sàng)
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (getModelFormat(src) === "unknown") {
      setStatus("error");
      setErrorMsg(`Unsupported format: ${src}`);
      return;
    }

    let cancelled = false;
    setErrorMsg("");
    if (!modelCache.has(src)) setStatus("loading");

    const beginOut = () => {
      const a = ctx.anim;
      if (a.phase === "out") return;
      a.phase = "out";
      a.start = performance.now();
      a.fromOpacity = ctx.opacity;
      a.fromScale = ctx.current ? ctx.current.scale.x : 1;
    };

    // Bấm đổi model: bắt đầu thu model cũ NGAY, không chờ tải xong
    if (ctx.current && ctx.currentSrc !== src) beginOut();

    loadModel(src)
      .then((object) => {
        if (cancelled || ctxRef.current !== ctx) return;

        object.traverse((child) => {
          const pts = child as THREE.Points;
          if (pts.isPoints) (pts.material as THREE.PointsMaterial).size = pointSize;
        });

        if (!ctx.current) {
          // Model đầu tiên: hiện ra bằng hiệu ứng "in"
          ctx.scene.add(object);
          ctx.current = object;
          ctx.currentSrc = src;
          ctx.camera.position.set(0, 0.5, 4.2);
          ctx.controls.target.set(0, 0, 0);
          ctx.controls.update();
          ctx.anim.phase = "in";
          ctx.anim.start = performance.now();
          ctx.onSwapped();
          return;
        }

        if (object === ctx.current && ctx.anim.phase === "idle") return;

        ctx.anim.next = object;
        ctx.anim.nextSrc = src;
        beginOut();
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[ModelViewer3D]", src, err);
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Could not load model");
      });

    return () => {
      cancelled = true;
    };
  }, [src, pointSize]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
        ...style,
      }}
    >
      {status !== "ready" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center text-[11px] font-mono tracking-widest pointer-events-none">
          {status === "loading" ? (
            <span className="text-gray-400">LOADING MODEL…</span>
          ) : (
            <>
              <span className="text-red-400">FAILED TO LOAD MODEL</span>
              <span className="text-gray-500 break-all">{errorMsg}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const ModelViewer3D = memo(ModelViewer3DInner);
export default ModelViewer3D;
