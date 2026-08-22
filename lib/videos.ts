export type Clip = {
  id: string;
  src: string;
  poster?: string;
  title: string;
  note: string;
};

export const clips: Clip[] = [
  {
    id: "garden-walk",
    src: "/videos/garden-walk.mp4",
    poster: "/images/gen-44-yellow-walk.jpg",
    title: "Park walk",
    note: "Yellow sundress · tree-lined path",
  },
];
