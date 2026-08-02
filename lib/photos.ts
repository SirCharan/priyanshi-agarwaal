export type Photo = {
  id: string;
  src: string;
  title: string;
  place?: string;
  tag: "fashion" | "architecture";
};

/** Fashion frames — original Imagine set + consistency expansion */
export const photos: Photo[] = [
  // New expansion (hero-first: emerald)
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

export const fashionPhotos = photos.filter((p) => p.tag === "fashion");
