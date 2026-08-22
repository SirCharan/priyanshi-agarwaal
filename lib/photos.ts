export type Photo = {
  id: string;
  src: string;
  title: string;
  place?: string;
  tag: "fashion" | "architecture" | "workout";
};

/** Fashion frames — Imagine set (local LoRA plates are off Vercel) */
export const photos: Photo[] = [
  // New expansion (Imagine set)
  {
    id: "gen-01",
    src: "/images/gen-01-emerald-wrap.jpg",
    title: "Emerald Wrap",
    place: "Full front · midday tropical",
    tag: "fashion",
  },
  {
    id: "gen-02",
    src: "/images/gen-02-cream-blazer.jpg",
    title: "Cream Blazer Walk",
    place: "3/4 · soft overcast",
    tag: "fashion",
  },
  {
    id: "gen-03",
    src: "/images/gen-03-turtleneck-profile.jpg",
    title: "Turtleneck Profile",
    place: "True side · golden hour",
    tag: "fashion",
  },
  {
    id: "gen-04",
    src: "/images/gen-04-red-overshoulder.jpg",
    title: "Red Over-Shoulder",
    place: "Back 3/4 · sunset",
    tag: "fashion",
  },
  {
    id: "gen-05",
    src: "/images/gen-05-slip-denim.jpg",
    title: "Slip & Denim",
    place: "Low hero · hard noon",
    tag: "fashion",
  },
  {
    id: "gen-06",
    src: "/images/gen-06-cobalt-seated.jpg",
    title: "Cobalt Seated",
    place: "3/4 sit · open shade",
    tag: "fashion",
  },
  {
    id: "gen-07",
    src: "/images/gen-07-beauty-beige.jpg",
    title: "Beauty Beige",
    place: "Close front · soft fill",
    tag: "fashion",
  },
  {
    id: "gen-08",
    src: "/images/gen-08-blazer-bluehour.jpg",
    title: "Blue Hour Laugh",
    place: "Close 3/4 · rim light",
    tag: "fashion",
  },
  {
    id: "gen-09",
    src: "/images/gen-09-navy-jumpsuit.jpg",
    title: "Navy Jumpsuit",
    place: "Full front · soft afternoon",
    tag: "fashion",
  },
  {
    id: "gen-10",
    src: "/images/gen-10-plum-night.jpg",
    title: "Plum Night",
    place: "Back turn · string lights",
    tag: "fashion",
  },
  {
    id: "gen-11",
    src: "/images/gen-11-grey-studio.jpg",
    title: "Grey Studio",
    place: "Full front · softbox",
    tag: "fashion",
  },
  {
    id: "gen-12",
    src: "/images/gen-12-coral-coord.jpg",
    title: "Coral Co-ord",
    place: "Dynamic 3/4 · golden rim",
    tag: "fashion",
  },

  // Original Grok Imagine set
  {
    id: "3cf63eb8",
    src: "/images/3cf63eb8-3338-46e3-9d8b-2d08d775ed4c.jpg",
    title: "Yellow Floral Sundress",
    place: "Tropical garden · full front",
    tag: "fashion",
  },
  {
    id: "142c2511",
    src: "/images/142c2511-9d2c-4469-a540-524ff39d818c.jpg",
    title: "Linen & Laugh",
    place: "White shirt · blue shorts",
    tag: "fashion",
  },
  {
    id: "de4e3f32",
    src: "/images/de4e3f32-a973-4dad-b1d7-1a6efe06141e.jpg",
    title: "Coral Maxi",
    place: "Side profile · golden hour",
    tag: "fashion",
  },
  {
    id: "fdcb4672",
    src: "/images/fdcb4672-faef-4448-bbf3-d366dfd03679.jpg",
    title: "Olive Slip",
    place: "Seated · garden bench",
    tag: "fashion",
  },
  {
    id: "6b204030",
    src: "/images/6b204030-f231-4855-b1aa-f25a077957a0.jpg",
    title: "Soft Close-Up",
    place: "Beige cashmere · beauty",
    tag: "fashion",
  },
  {
    id: "312ac49f",
    src: "/images/312ac49f-fc1e-458f-83d9-3d1e0a2cc316.jpg",
    title: "Fashion Frame I",
    place: "Grok Imagine",
    tag: "fashion",
  },
  {
    id: "76e1356d",
    src: "/images/76e1356d-e141-4bc4-962f-b73f8a63681e.jpg",
    title: "Fashion Frame II",
    place: "Grok Imagine · angle study",
    tag: "fashion",
  },
];

/** Photoreal nude body-reference plates (clothing-fit lock) */
export const bodyRefs: Photo[] = [
  {
    id: "body-front-nude",
    src: "/images/body-ref/body-front-nude.png",
    title: "Body front · nude lock",
    place: "Studio · full anatomy",
    tag: "architecture",
  },
  {
    id: "body-34-nude",
    src: "/images/body-ref/body-34-nude.png",
    title: "Body 3/4 · nude",
    place: "Studio",
    tag: "architecture",
  },
  {
    id: "body-side-nude",
    src: "/images/body-ref/body-side-nude.png",
    title: "Body side · nude",
    place: "Studio · silhouette",
    tag: "architecture",
  },
  {
    id: "body-back-nude",
    src: "/images/body-ref/body-back-nude.png",
    title: "Body back · nude",
    place: "Studio · rear",
    tag: "architecture",
  },
];

/** Reproducible face/body architecture boards */
export const architecture: Photo[] = [
  {
    id: "arch-face",
    src: "/images/architecture/arch-face-orthographic.jpg",
    title: "Face Multi-Angle",
    place: "Front · 3/4 L · 3/4 R · profile",
    tag: "architecture",
  },
  {
    id: "arch-body",
    src: "/images/architecture/arch-body-turnaround.jpg",
    title: "Body Turnaround",
    place: "Front · 3/4 · side · back",
    tag: "architecture",
  },
  {
    id: "arch-expr",
    src: "/images/architecture/arch-expression-sheet.jpg",
    title: "Expression Sheet",
    place: "Neutral · smile · laugh · serene",
    tag: "architecture",
  },
  {
    id: "arch-light",
    src: "/images/architecture/arch-lighting-study.jpg",
    title: "Lighting Study",
    place: "Golden · overcast · noon · blue hour",
    tag: "architecture",
  },
];

/** Identity-locked workout / fitness set (modest athletic wear) */
export const workout: Photo[] = [
  {
    id: "wo-01",
    src: "/images/workout/wo-01-run-profile.jpg",
    title: "Run Profile",
    place: "Outdoor · golden hour",
    tag: "workout",
  },
  {
    id: "wo-02",
    src: "/images/workout/wo-02-gym-squat.jpg",
    title: "Gym Squat",
    place: "Dumbbells · long-sleeve set",
    tag: "workout",
  },
  {
    id: "wo-03",
    src: "/images/workout/wo-03-outdoor-run.jpg",
    title: "Park Run",
    place: "Mid-stride · coral top",
    tag: "workout",
  },
  {
    id: "wo-04",
    src: "/images/workout/wo-04-yoga-warrior.jpg",
    title: "Yoga Warrior",
    place: "Studio · sage set",
    tag: "workout",
  },
  {
    id: "wo-05",
    src: "/images/workout/wo-05-boxing.jpg",
    title: "Boxing Guard",
    place: "Gym · navy training",
    tag: "workout",
  },
  {
    id: "wo-06",
    src: "/images/workout/wo-06-cable-row.jpg",
    title: "Cable Row",
    place: "Strength · seated pull",
    tag: "workout",
  },
  {
    id: "wo-07",
    src: "/images/workout/wo-07-stretch-hoodie.jpg",
    title: "Cool-down Stretch",
    place: "Hoodie · calf stretch",
    tag: "workout",
  },
  {
    id: "wo-08",
    src: "/images/workout/wo-08-post-workout.jpg",
    title: "Post-workout",
    place: "Close · towel · soft smile",
    tag: "workout",
  },
  {
    id: "wo-09",
    src: "/images/workout/wo-09-cycling.jpg",
    title: "Cycling",
    place: "Outdoor · road bike",
    tag: "workout",
  },
];

export const fashionPhotos = photos.filter((p) => p.tag === "fashion");
export const workoutPhotos = workout;
