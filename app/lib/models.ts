
export type ModelAsset = {
  id: string;
  name: string;
  modelPath?: string;
  embedUrl: string;
};

const sketchfab = (uid: string) =>
  `https://sketchfab.com/models/${uid}/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_infos=0&ui_watermark=0&ui_controls=0&ui_stop=0&ui_inspector=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_theme=dark&dnt=1&scrollwheel=0`;

export const MODELS: Record<"starship" | "orion" | "discovery" | "jwst", ModelAsset> = {
  starship: {
    id: "starship",
    name: "SpaceX Starship",
    modelPath: "/models/starship.glb",
    embedUrl: sketchfab("97875d14b63e4b9ca9ed425ef4253306"),
  },
  orion: {
    id: "orion",
    name: "Artemis II Orion",
    modelPath: "/models/orion.glb",
    embedUrl: sketchfab("f025cec8c7fb4eccb83b54df8b9a6ea7"),
  },
  discovery: {
    id: "discovery",
    name: "Space Shuttle OV-103",
    modelPath: "/models/discovery.glb",
    embedUrl: sketchfab("5f7176a2ae284d6b99fc970c9d265c04"),
  },
  jwst: {
    id: "jwst",
    name: "James Webb Space Telescope",
    modelPath: "/models/jwst.glb",
    embedUrl: sketchfab("6c92c08a672640afb58ee44d248fd0fe"),
  },
};

/** Tất cả file model cục bộ (dùng để tải trước). */
export const LOCAL_MODEL_PATHS: string[] = Object.values(MODELS)
  .map((m) => m.modelPath)
  .filter((p): p is string => !!p);
