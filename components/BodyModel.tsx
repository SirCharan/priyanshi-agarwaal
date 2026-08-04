"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type OutfitMode = "none" | "bikini" | "fitted" | "loose";

/** Face expression lock — same identity, only muscles change */
export type FaceExpression = {
  eyes: "open" | "half" | "closed";
  mouth: "closed" | "soft-open" | "open";
  smile: "none" | "soft" | "full";
};

export const DEFAULT_FACE: FaceExpression = {
  eyes: "open",
  mouth: "closed",
  smile: "soft",
};

export const FACE_PRESETS: { id: string; label: string; face: FaceExpression }[] =
  [
    { id: "neutral", label: "Neutral", face: { eyes: "open", mouth: "closed", smile: "none" } },
    { id: "soft-smile", label: "Soft smile", face: { eyes: "open", mouth: "closed", smile: "soft" } },
    { id: "full-smile", label: "Full smile", face: { eyes: "open", mouth: "closed", smile: "full" } },
    { id: "laugh", label: "Laugh (mouth open)", face: { eyes: "half", mouth: "open", smile: "full" } },
    { id: "soft-open", label: "Soft open mouth", face: { eyes: "open", mouth: "soft-open", smile: "none" } },
    { id: "serene", label: "Serene (eyes closed)", face: { eyes: "closed", mouth: "closed", smile: "soft" } },
    { id: "sleep", label: "Eyes closed neutral", face: { eyes: "closed", mouth: "closed", smile: "none" } },
    { id: "speak", label: "Speaking", face: { eyes: "open", mouth: "open", smile: "none" } },
  ];

type Measurements = {
  height_cm: number;
  weight_kg: number;
  bust_cm: number;
  underbust_cm?: number;
  waist_cm: number;
  hips_cm: number;
  shoulder_width_cm: number;
  arm_length_cm: number;
  inseam_cm: number;
  thigh_cm: number;
  calf_cm: number;
  neck_cm: number;
  torso_cm: number;
  build: string;
  hair: { style: string; color: string };
};

const DEFAULT_M: Measurements = {
  height_cm: 165,
  weight_kg: 52,
  bust_cm: 86,
  underbust_cm: 72,
  waist_cm: 64,
  hips_cm: 90,
  shoulder_width_cm: 38,
  arm_length_cm: 58,
  inseam_cm: 78,
  thigh_cm: 48,
  calf_cm: 33,
  neck_cm: 31,
  torso_cm: 42,
  build: "slim-athletic",
  hair: { style: "loose S-waves", color: "near-black" },
};

function rFromCirc(c: number) {
  return c / (2 * Math.PI);
}

/**
 * Lathe profile for torso: hip → waist → underbust → bust → chest/shoulder.
 * Y is height above hip center; X is radius — accurate 86-64-90 curves.
 */
function torsoLathePoints(M: Measurements, ease = 1): THREE.Vector2[] {
  const rHip = rFromCirc(M.hips_cm) * ease;
  const rWaist = rFromCirc(M.waist_cm) * ease;
  const rUnder = rFromCirc(M.underbust_cm ?? 72) * ease;
  const rBust = rFromCirc(M.bust_cm) * ease;
  const rChest = rBust * 0.88;
  // heights along torso (cm)
  const pts: [number, number][] = [
    [rHip * 0.55, 0], // crotch bridge
    [rHip * 0.98, 4],
    [rHip, 10],
    [rHip * 0.97, 16],
    [(rHip + rWaist) / 2, 22],
    [rWaist * 1.02, 28],
    [rWaist, 32], // waist navel
    [rWaist * 1.05, 36],
    [rUnder, 40], // underbust
    [rBust * 0.95, 44],
    [rBust, 48], // fullest bust
    [rBust * 0.96, 52],
    [rChest, 56],
    [rChest * 0.9, 60],
    [rFromCirc(M.neck_cm) * 1.4 * ease, 64],
  ];
  return pts.map(([x, y]) => new THREE.Vector2(x, y));
}

function legLathePoints(rThigh: number, rKnee: number, rCalf: number, rAnkle: number, len: number) {
  const t = (f: number) => f * len;
  return [
    new THREE.Vector2(rAnkle * 0.9, 0),
    new THREE.Vector2(rAnkle, t(0.04)),
    new THREE.Vector2(rCalf * 0.85, t(0.12)),
    new THREE.Vector2(rCalf, t(0.28)),
    new THREE.Vector2(rCalf * 0.95, t(0.4)),
    new THREE.Vector2(rKnee, t(0.48)),
    new THREE.Vector2(rThigh * 0.88, t(0.62)),
    new THREE.Vector2(rThigh, t(0.82)),
    new THREE.Vector2(rThigh * 0.96, t(0.95)),
    new THREE.Vector2(rThigh * 0.7, len),
  ];
}

function buildFace(
  head: THREE.Group,
  headR: number,
  face: FaceExpression,
  skin: THREE.Material,
  feature: THREE.Material,
  white: THREE.Material,
  iris: THREE.Material,
  lip: THREE.Material,
  track: (g: THREE.BufferGeometry) => THREE.BufferGeometry
) {
  const eyeY = 1.8;
  const eyeZ = headR * 0.78;
  const eyeX = 3.4;
  const eyeOpen =
    face.eyes === "open" ? 1 : face.eyes === "half" ? 0.45 : 0.08;

  for (const side of [-1, 1] as const) {
    // sclera
    const eye = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.15, 20, 16)),
      white
    );
    eye.scale.set(1, eyeOpen, 0.75);
    eye.position.set(side * eyeX, eyeY, eyeZ);
    head.add(eye);

    // iris
    const ir = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.55, 16, 12)),
      iris
    );
    ir.position.set(side * eyeX, eyeY, eyeZ + 0.7);
    ir.scale.set(1, eyeOpen, 1);
    head.add(ir);

    // pupil
    const pu = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.28, 12, 10)),
      feature
    );
    pu.position.set(side * eyeX, eyeY, eyeZ + 0.95);
    pu.scale.set(1, eyeOpen, 1);
    head.add(pu);

    // upper lid (closes eyes)
    if (face.eyes !== "open") {
      const lid = new THREE.Mesh(
        track(new THREE.SphereGeometry(1.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2)),
        skin
      );
      lid.position.set(side * eyeX, eyeY + 0.15, eyeZ);
      lid.rotation.x = face.eyes === "closed" ? 0.15 : 0.35;
      head.add(lid);
    }

    // brow
    const browLift = face.smile === "full" ? 0.25 : face.smile === "soft" ? 0.1 : 0;
    const brow = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.6, 0.28, 0.5)),
      feature
    );
    brow.position.set(side * eyeX, eyeY + 1.7 + browLift, eyeZ + 0.2);
    brow.rotation.z = side * -0.12;
    brow.rotation.x = -0.2;
    head.add(brow);
  }

  // nose
  const nose = new THREE.Mesh(
    track(new THREE.ConeGeometry(0.85, 2.4, 10)),
    skin
  );
  nose.rotation.x = Math.PI;
  nose.position.set(0, 0.2, headR * 0.92);
  head.add(nose);

  // mouth
  const smileW =
    face.smile === "full" ? 1.55 : face.smile === "soft" ? 1.25 : 1;
  const smileCurve =
    face.smile === "full" ? 0.45 : face.smile === "soft" ? 0.22 : 0;
  const mouthOpen =
    face.mouth === "open" ? 1.1 : face.mouth === "soft-open" ? 0.45 : 0.08;

  // lips
  const upperLip = new THREE.Mesh(
    track(new THREE.TorusGeometry(1.6 * smileW, 0.28, 8, 20, Math.PI)),
    lip
  );
  upperLip.position.set(0, -1.6 + smileCurve * 0.3, headR * 0.88);
  upperLip.rotation.x = Math.PI / 2 + 0.3;
  upperLip.rotation.z = Math.PI;
  head.add(upperLip);

  const lowerLip = new THREE.Mesh(
    track(new THREE.TorusGeometry(1.5 * smileW, 0.32, 8, 20, Math.PI)),
    lip
  );
  lowerLip.position.set(0, -1.85 - mouthOpen * 0.35 + smileCurve * 0.15, headR * 0.86);
  lowerLip.rotation.x = Math.PI / 2 - 0.15;
  head.add(lowerLip);

  if (face.mouth !== "closed") {
    const cavity = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.2 * smileW, mouthOpen * 1.2, 0.6)),
      feature
    );
    cavity.position.set(0, -1.75, headR * 0.82);
    head.add(cavity);
    // soft teeth strip for open mouth
    if (face.mouth === "open") {
      const teeth = new THREE.Mesh(
        track(new THREE.BoxGeometry(1.9 * smileW, 0.25, 0.35)),
        white
      );
      teeth.position.set(0, -1.55, headR * 0.88);
      head.add(teeth);
    }
  } else if (face.smile !== "none") {
    // closed smile — slight lip line lift
    const line = new THREE.Mesh(
      track(new THREE.TorusGeometry(1.4 * smileW, 0.08, 6, 24, Math.PI)),
      feature
    );
    line.position.set(0, -1.72 + smileCurve * 0.2, headR * 0.9);
    line.rotation.x = Math.PI / 2;
    line.rotation.z = Math.PI;
    head.add(line);
  }

  // cheeks apple for smile
  if (face.smile !== "none") {
    const puff = face.smile === "full" ? 1.1 : 0.7;
    for (const side of [-1, 1] as const) {
      const cheek = new THREE.Mesh(
        track(new THREE.SphereGeometry(1.4 * puff, 12, 10)),
        skin
      );
      cheek.position.set(side * 5.2, -0.6, headR * 0.55);
      cheek.scale.set(0.7, 0.65, 0.5);
      head.add(cheek);
    }
  }
}

function buildFigure(
  M: Measurements,
  outfit: OutfitMode,
  face: FaceExpression
): { root: THREE.Group; dispose: () => void } {
  const root = new THREE.Group();
  const disposables: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const skin = new THREE.MeshStandardMaterial({
    color: 0xc4a07a,
    roughness: 0.52,
    metalness: 0.02,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x14100e,
    roughness: 0.88,
  });
  const feature = new THREE.MeshStandardMaterial({
    color: 0x1a1210,
    roughness: 0.6,
  });
  const white = new THREE.MeshStandardMaterial({
    color: 0xf5f0ea,
    roughness: 0.4,
  });
  const iris = new THREE.MeshStandardMaterial({
    color: 0x3d2817,
    roughness: 0.35,
  });
  const lip = new THREE.MeshStandardMaterial({
    color: 0xb56b6b,
    roughness: 0.45,
  });
  const areolaMat = new THREE.MeshStandardMaterial({
    color: 0xa86b5a,
    roughness: 0.55,
  });
  const nippleMat = new THREE.MeshStandardMaterial({
    color: 0x8f5548,
    roughness: 0.5,
  });
  const bikiniMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    roughness: 0.4,
    metalness: 0.1,
  });
  const fittedMat = new THREE.MeshStandardMaterial({
    color: 0x2a3d55,
    roughness: 0.35,
    metalness: 0.08,
    transparent: true,
    opacity: 0.78,
  });
  const looseMat = new THREE.MeshStandardMaterial({
    color: 0x8b3a3a,
    roughness: 0.65,
    metalness: 0,
    transparent: true,
    opacity: 0.52,
    side: THREE.DoubleSide,
  });
  materials.push(
    skin,
    hairMat,
    feature,
    white,
    iris,
    lip,
    areolaMat,
    nippleMat,
    bikiniMat,
    fittedMat,
    looseMat
  );

  const track = (g: THREE.BufferGeometry) => {
    disposables.push(g);
    return g;
  };
  const add = (mesh: THREE.Object3D) => {
    root.add(mesh);
    return mesh;
  };

  const rHip = rFromCirc(M.hips_cm);
  const rThigh = rFromCirc(M.thigh_cm);
  const rCalf = rFromCirc(M.calf_cm);
  const rNeck = rFromCirc(M.neck_cm);
  const rShoulder = M.shoulder_width_cm / 2;
  const rBust = rFromCirc(M.bust_cm);
  const rWaist = rFromCirc(M.waist_cm);

  const legLen = M.inseam_cm;
  const headR = 10.5;
  const neckH = 8;
  const hipY = legLen;
  const torsoH = 64; // matches lathe profile max Y

  // --- Legs with thigh→knee→calf curves ---
  for (const side of [-1, 1] as const) {
    const x = side * rHip * 0.36;
    const legPts = legLathePoints(
      rThigh,
      (rThigh + rCalf) * 0.48,
      rCalf,
      rFromCirc(M.calf_cm * 0.55),
      legLen
    );
    const leg = new THREE.Mesh(
      track(new THREE.LatheGeometry(legPts, 28)),
      skin
    );
    leg.position.set(x, 0, 0);
    add(leg);

    const foot = new THREE.Mesh(track(new THREE.BoxGeometry(5.8, 2.4, 13)), skin);
    foot.position.set(x, 1.2, 3);
    add(foot);
  }

  // --- Torso lathe: full curves for body-fit clothing ---
  const torsoGeo = track(new THREE.LatheGeometry(torsoLathePoints(M, 1), 48));
  const torso = new THREE.Mesh(torsoGeo, skin);
  torso.position.y = hipY;
  add(torso);

  // --- Full anatomy: breasts + nipples (for bikini / body-fit QA) ---
  const bustY = hipY + 48;
  for (const side of [-1, 1] as const) {
    const breast = new THREE.Mesh(
      track(new THREE.SphereGeometry(rBust * 0.42, 32, 24)),
      skin
    );
    breast.position.set(side * rBust * 0.38, bustY, rBust * 0.48);
    breast.scale.set(1.08, 0.95, 0.9);
    add(breast);

    // areola
    const areola = new THREE.Mesh(
      track(new THREE.CircleGeometry(rBust * 0.12, 20)),
      areolaMat
    );
    areola.position.set(
      side * rBust * 0.4,
      bustY - 0.3,
      rBust * 0.48 + rBust * 0.38
    );
    add(areola);

    // nipple
    const nipple = new THREE.Mesh(
      track(new THREE.SphereGeometry(rBust * 0.045, 12, 10)),
      nippleMat
    );
    nipple.position.set(
      side * rBust * 0.4,
      bustY - 0.3,
      rBust * 0.48 + rBust * 0.4
    );
    add(nipple);
  }

  // --- Glutes (full rear volume) ---
  for (const side of [-1, 1] as const) {
    const glute = new THREE.Mesh(
      track(new THREE.SphereGeometry(rHip * 0.48, 28, 22)),
      skin
    );
    glute.position.set(side * rHip * 0.42, hipY + 7, -rHip * 0.55);
    glute.scale.set(0.95, 1.15, 1.05);
    add(glute);

    // outer hip / side curve
    const hipCap = new THREE.Mesh(
      track(new THREE.SphereGeometry(rHip * 0.4, 20, 16)),
      skin
    );
    hipCap.position.set(side * rHip * 0.62, hipY + 9, -rHip * 0.08);
    hipCap.scale.set(0.75, 1.1, 0.85);
    add(hipCap);
  }
  // glute crease / cleavage rear
  const gluteJoin = new THREE.Mesh(
    track(new THREE.SphereGeometry(rHip * 0.28, 16, 12)),
    skin
  );
  gluteJoin.position.set(0, hipY + 5.5, -rHip * 0.35);
  gluteJoin.scale.set(0.6, 0.9, 0.7);
  add(gluteJoin);

  // --- Pelvis / mons + camel-toe form (bikini bottom QA) ---
  const mons = new THREE.Mesh(
    track(new THREE.SphereGeometry(rHip * 0.28, 20, 16)),
    skin
  );
  mons.position.set(0, hipY + 3.5, rHip * 0.42);
  mons.scale.set(1.15, 0.85, 0.75);
  add(mons);

  // labial ridge / camel toe (center front)
  const ridge = new THREE.Mesh(
    track(new THREE.CapsuleGeometry(0.55, 4.2, 6, 12)),
    skin
  );
  ridge.position.set(0, hipY + 2.2, rHip * 0.55);
  ridge.rotation.x = 0.15;
  add(ridge);

  // soft inner-thigh contact at crotch
  for (const side of [-1, 1] as const) {
    const pad = new THREE.Mesh(
      track(new THREE.SphereGeometry(rHip * 0.18, 14, 12)),
      skin
    );
    pad.position.set(side * rHip * 0.22, hipY + 1.5, rHip * 0.25);
    pad.scale.set(0.8, 1.1, 0.9);
    add(pad);
  }

  const shoulderY = hipY + torsoH + 2;
  const sh = new THREE.Mesh(
    track(new THREE.CapsuleGeometry(4.2, M.shoulder_width_cm - 10, 8, 16)),
    skin
  );
  sh.rotation.z = Math.PI / 2;
  sh.position.y = shoulderY;
  add(sh);

  // Arms with slight taper
  const armLen = M.arm_length_cm;
  for (const side of [-1, 1] as const) {
    const g = new THREE.Group();
    const upper = new THREE.Mesh(
      track(new THREE.CylinderGeometry(3.2, 2.7, armLen * 0.48, 18)),
      skin
    );
    upper.position.y = -armLen * 0.24;
    const lower = new THREE.Mesh(
      track(new THREE.CylinderGeometry(2.55, 2.0, armLen * 0.48, 18)),
      skin
    );
    lower.position.y = -armLen * 0.72;
    const hand = new THREE.Mesh(track(new THREE.SphereGeometry(2.15, 12, 10)), skin);
    hand.position.y = -armLen * 0.98;
    g.add(upper, lower, hand);
    g.position.set(side * (rShoulder - 1.5), shoulderY, 0);
    g.rotation.z = side * 0.12;
    root.add(g);
  }

  // Neck
  add(
    new THREE.Mesh(
      track(new THREE.CylinderGeometry(rNeck, rNeck * 1.06, neckH, 20)),
      skin
    )
  ).position.y = shoulderY + neckH / 2 + 1.5;

  // Head + face expressions
  const headY = shoulderY + neckH + headR + 1.5;
  const headGroup = new THREE.Group();
  headGroup.position.y = headY;
  const skull = new THREE.Mesh(track(new THREE.SphereGeometry(headR, 36, 28)), skin);
  headGroup.add(skull);
  buildFace(headGroup, headR, face, skin, feature, white, iris, lip, track);
  root.add(headGroup);

  // Hair lock
  const hairCap = new THREE.Mesh(
    track(
      new THREE.SphereGeometry(headR * 1.18, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.75)
    ),
    hairMat
  );
  hairCap.position.set(0, headY + 1.2, -1.2);
  add(hairCap);

  const bangs = new THREE.Mesh(track(new THREE.BoxGeometry(13, 3.2, 4.5)), hairMat);
  bangs.position.set(-1.2, headY + 2, headR * 0.72);
  bangs.rotation.x = -0.4;
  add(bangs);

  const fall = new THREE.Mesh(
    track(new THREE.CylinderGeometry(5.5, 3.2, 48, 16)),
    hairMat
  );
  fall.position.set(0, headY - 30, -7);
  add(fall);

  // --- Outfit layers (same skeleton / anatomy underneath) ---
  if (outfit === "bikini") {
    // triangle top
    for (const side of [-1, 1] as const) {
      const cup = new THREE.Mesh(
        track(new THREE.SphereGeometry(rBust * 0.36, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.65)),
        bikiniMat
      );
      cup.position.set(side * rBust * 0.36, bustY + 0.4, rBust * 0.4);
      cup.scale.set(1.05, 0.9, 0.75);
      cup.rotation.x = -0.35;
      add(cup);
    }
    // string bridge
    const bridge = new THREE.Mesh(
      track(new THREE.BoxGeometry(rBust * 0.5, 0.35, 0.35)),
      bikiniMat
    );
    bridge.position.set(0, bustY + 1.2, rBust * 0.55);
    add(bridge);
    // neck ties
    for (const side of [-1, 1] as const) {
      const strap = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.2, 0.2, 14, 8)),
        bikiniMat
      );
      strap.position.set(side * 3, bustY + 8, rBust * 0.15);
      strap.rotation.z = side * 0.45;
      add(strap);
    }
    // bottom — high-cut, leaves glute + camel-toe readable
    const bottom = new THREE.Mesh(
      track(new THREE.SphereGeometry(rHip * 0.38, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.55)),
      bikiniMat
    );
    bottom.position.set(0, hipY + 3, rHip * 0.15);
    bottom.scale.set(1.2, 0.75, 1.05);
    add(bottom);
    const backStrap = new THREE.Mesh(
      track(new THREE.BoxGeometry(rHip * 0.35, 0.4, 0.35)),
      bikiniMat
    );
    backStrap.position.set(0, hipY + 6, -rHip * 0.5);
    add(backStrap);
    // side hip strings
    for (const side of [-1, 1] as const) {
      const hs = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.22, 0.22, rHip * 0.9, 8)),
        bikiniMat
      );
      hs.position.set(side * rHip * 0.55, hipY + 5, 0);
      hs.rotation.z = Math.PI / 2;
      add(hs);
    }
  }

  if (outfit === "fitted") {
    // Bodycon: lathe slightly outside body profile so it wraps bust/waist/hip
    const fitGeo = track(new THREE.LatheGeometry(torsoLathePoints(M, 1.06), 48));
    const fit = new THREE.Mesh(fitGeo, fittedMat);
    fit.position.y = hipY;
    add(fit);

    for (const side of [-1, 1] as const) {
      const legPts = legLathePoints(
        rThigh * 1.06,
        (rThigh + rCalf) * 0.5,
        rCalf * 1.06,
        rCalf * 0.6,
        legLen * 0.98
      );
      const leg = new THREE.Mesh(track(new THREE.LatheGeometry(legPts, 24)), fittedMat);
      leg.position.set(side * rHip * 0.36, 0, 0);
      add(leg);
    }

    // Bust wrap cups
    for (const side of [-1, 1] as const) {
      const cup = new THREE.Mesh(
        track(new THREE.SphereGeometry(rBust * 0.44, 20, 16)),
        fittedMat
      );
      cup.position.set(side * rBust * 0.36, hipY + 48, rBust * 0.45);
      cup.scale.set(1.08, 0.92, 0.85);
      add(cup);
    }
  }

  if (outfit === "loose") {
    const easePts = torsoLathePoints(M, 1.38).map((p, i, arr) => {
      // flare more toward hem
      const t = i / (arr.length - 1);
      return new THREE.Vector2(p.x * (1 + t * 0.25), p.y);
    });
    // extend hem below hip
    easePts.unshift(new THREE.Vector2(rHip * 1.7, -18));
    easePts.unshift(new THREE.Vector2(rHip * 1.55, -8));
    const dress = new THREE.Mesh(
      track(new THREE.LatheGeometry(easePts, 40)),
      looseMat
    );
    dress.position.y = hipY;
    add(dress);
  }

  // subtle waist ring for measurement QA
  const waistRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(rWaist * 1.02, 0.15, 8, 48)),
    new THREE.MeshBasicMaterial({ color: 0x8b3a3a, transparent: true, opacity: 0.35 })
  );
  materials.push(waistRing.material as THREE.Material);
  waistRing.rotation.x = Math.PI / 2;
  waistRing.position.y = hipY + 32;
  add(waistRing);

  return {
    root,
    dispose: () => {
      disposables.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}

export default function BodyModel({
  outfit = "none",
  face = DEFAULT_FACE,
}: {
  outfit?: OutfitMode;
  face?: FaceExpression;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<Measurements>(DEFAULT_M);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/consistency/measurements.json")
      .then((r) => r.json())
      .then((j) => setM({ ...DEFAULT_M, ...j }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth || 640;
    const h = el.clientHeight || 720;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, w / h, 1, 2000);
    camera.position.set(150, 100, 250);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, m.height_cm * 0.52, 0);
    controls.enableDamping = true;
    controls.minDistance = 70;
    controls.maxDistance = 480;

    scene.add(new THREE.AmbientLight(0xfff5eb, 0.55));
    const key = new THREE.DirectionalLight(0xffe8d0, 1.2);
    key.position.set(90, 170, 110);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8c0ff, 0.4);
    fill.position.set(-110, 70, -50);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xfff0e0, 0.3);
    rim.position.set(0, 100, -120);
    scene.add(rim);

    scene.add(new THREE.GridHelper(200, 20, 0xd9cfc3, 0xebe3d8));

    const hLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(50, 0, 0),
        new THREE.Vector3(50, m.height_cm, 0),
      ]),
      new THREE.LineBasicMaterial({ color: 0x8b3a3a })
    );
    scene.add(hLine);

    const figure = buildFigure(m, outfit, face);
    scene.add(figure.root);
    setReady(true);

    let raf = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      figure.dispose();
      hLine.geometry.dispose();
      (hLine.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [m, outfit, face]);

  return (
    <div className="relative h-full min-h-[480px] w-full">
      <div ref={mountRef} className="absolute inset-0" />
      {!ready && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          Loading body model…
        </p>
      )}
    </div>
  );
}
