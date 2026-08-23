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
  {
    id: "gym-squat",
    src: "/videos/gym-squat.mp4",
    poster: "/images/workout/wo-11-squat-deep.jpg",
    title: "Gym squat",
    note: "Dumbbells · stand up from the hole",
  },
  {
    id: "barbell-squat",
    src: "/videos/barbell-squat.mp4",
    poster: "/images/workout/wo-16-barbell-squat.jpg",
    title: "Barbell back squat",
    note: "Sports bra · sweaty · stand up",
  },
];
