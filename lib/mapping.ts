/** 3D mapping + pose assets (also archived under public/images) */

export type MapAsset = {
  id: string;
  src: string;
  title: string;
  kind: "orbit" | "pose";
  yawDeg?: number;
};

export const orbitFrames: MapAsset[] = [
  0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
].map((deg) => ({
  id: `orbit-${String(deg).padStart(3, "0")}`,
  src: `/images/mapping/orbit/orbit-${String(deg).padStart(3, "0")}.jpg`,
  title: `Orbit ${deg}°`,
  kind: "orbit" as const,
  yawDeg: deg,
}));

export const poseFrames: MapAsset[] = [
  {
    id: "pose-stand",
    src: "/images/mapping/poses/pose-stand.jpg",
    title: "Stand",
    kind: "pose",
  },
  {
    id: "pose-walk",
    src: "/images/mapping/poses/pose-walk.jpg",
    title: "Walk",
    kind: "pose",
  },
  {
    id: "pose-sit-chair",
    src: "/images/mapping/poses/pose-sit-chair.jpg",
    title: "Sit (chair)",
    kind: "pose",
  },
  {
    id: "pose-sit-ground",
    src: "/images/mapping/poses/pose-sit-ground.jpg",
    title: "Sit (ground)",
    kind: "pose",
  },
];
