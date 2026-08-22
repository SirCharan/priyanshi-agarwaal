export type Clip = {
  id: string;
  src: string;
  poster?: string;
  title: string;
  note: string;
};

export const clips: Clip[] = [
  {
    id: "v1-over-shoulder",
    src: "/videos/v1-over-shoulder.mp4",
    poster: "/videos/v1-over-shoulder.jpg",
    title: "Over-shoulder",
    note: "5s · 9:16 · WAN I2V · 16 fps",
  },
];
