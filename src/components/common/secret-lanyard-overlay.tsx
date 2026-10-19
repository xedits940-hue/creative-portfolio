"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { X, Lock, Unlock } from "lucide-react";
import MotivationalVaultView from "./motivational-vault-view";
import ScrambledText from "./ScrambledText";
import { useSecretLanyard } from "@/providers/secret-lanyard-provider";


const VT_PIN_CODE = "09";

declare global {
  interface Window {
    vtUpdateCardScreenPos?: (x: number, y: number, angle?: number) => void;
  }
}

interface SimulationBody {
  position: THREE.Vector3;
  previous: THREE.Vector3;
  velocity: THREE.Vector3;
  quaternion: THREE.Quaternion;
  previousQuaternion: THREE.Quaternion;
  angular: THREE.Vector3;
  mass: number;
  inverseInertia: THREE.Vector3;
  hang: THREE.Vector3;
}

interface GrabState {
  local: THREE.Vector3;
  rotation: THREE.Quaternion;
  reach: number;
  raw: THREE.Vector3;
  target: THREE.Vector3;
}

interface SimulationState {
  nodes: THREE.Vector3[];
  previous: THREE.Vector3[];
  velocities: THREE.Vector3[];
  lengths: Float64Array;
  impulses: Float64Array;
  rest: number;
  anchor: THREE.Vector3;
  body: SimulationBody;
  grab: GrabState | null;
  turn: number;
  twist: number;
  twistRaw: number;
  calm: number;
  introActive: boolean;
  introElapsed: number;
  flipLockUntil: number;
}

interface PhysicsConfig {
  gravity: number;
  hold: number;
  stiffness: number;
  spring: number;
  bandDamping: number;
  linearDrag: number;
  angularDrag: number;
  air: number;
  broadside: number;
  spinAir: number;
  nodeDrag: number;
  nodeAir: number;
  twist: number;
  twistDamping: number;
  grip: number;
  gripDamping: number;
  breeze: number;
}

interface CardLayout {
  width: number;
  height: number;
  radius: number;
  slot: { width: number; height: number; y: number };
  ringY: number;
  hangY: number;
}

interface PressState {
  x: number;
  y: number;
  time: number;
}

export default function SecretLanyardOverlay() {
  const { isOpen, isUnlocked, closeLanyard, unlockVault } = useSecretLanyard();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [pin, setPin] = useState("");
  const [pinStatus, setPinStatus] = useState<"idle" | "error" | "success">("idle");
  const [isMobileTouch, setIsMobileTouch] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);

  // References to control Three.js simulation instance
  const startSimulationRef = useRef<(() => void) | null>(null);
  const stopSimulationRef = useRef<(() => void) | null>(null);
  const triggerDropRef = useRef<(() => void) | null>(null);

  const handleClose = useCallback(() => {
    setPin("");
    setPinStatus("idle");
    closeLanyard();
  }, [closeLanyard]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch = (window.matchMedia("(hover: none) and (pointer: coarse)").matches || "ontouchstart" in window);
      setIsMobileTouch(isTouch);
    }
  }, []);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const verifyPin = useCallback((val: string) => {
    if (val.length === 2) {
      if (val === VT_PIN_CODE) {
        setPinStatus("success");
        try {
          if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
        } catch {}
        setTimeout(() => {
          unlockVault();
        }, 400);
      } else {
        setPinStatus("error");
        try {
          if (navigator.vibrate) navigator.vibrate([60, 60, 60]);
        } catch {}
        setTimeout(() => {
          setPin("");
          setPinStatus("idle");
        }, 500);
      }
    }
  }, [unlockVault]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
    setPin(val);
    setPinStatus("idle");
    verifyPin(val);
  };

  // Keyboard typing directly anywhere on screen without finding the input:
  useEffect(() => {
    if (!isOpen || isUnlocked) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
        setPinStatus("idle");
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        setPin((prev) => {
          if (prev.length >= 2) return prev;
          const next = prev + e.key;
          verifyPin(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isUnlocked, verifyPin]);

  // When isOpen changes, instantly trigger smooth physical drop and show mobile hint for 3.5s only
  useEffect(() => {
    if (isOpen) {
      setPin("");
      setPinStatus("idle");
      if (triggerDropRef.current) {
        triggerDropRef.current();
      }
      if (startSimulationRef.current) {
        startSimulationRef.current();
      }
      if (isMobileTouch) {
        setShowMobileHint(true);
        const timer = setTimeout(() => {
          setShowMobileHint(false);
        }, 3600);
        return () => clearTimeout(timer);
      }
    } else {
      setShowMobileHint(false);
      if (stopSimulationRef.current) {
        stopSimulationRef.current();
      }
    }
  }, [isOpen, isMobileTouch]);

  // Initialize Three.js Lanyard Scene ONCE so it's always warm and zero-latency
  useEffect(() => {
    const stage = containerRef.current;
    if (!stage) return;

    window.vtUpdateCardScreenPos = (x: number, y: number, angle = 0) => {
      if (anchorRef.current) {
        anchorRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`;
      }
    };

    /* ============================================================
       THREE.JS LANYARD PHYSICS ENGINE - PURE LUXURY RED & BLACK
    ============================================================ */

    const CARD_SIZES: Record<string, [number, number]> = {
      portrait: [1.6, 2.25],
      landscape: [2.25, 1.6],
    };
    const ANCHORS: Record<string, number> = { left: 0.27, center: 0.5, right: 0.73 };
    const THICKNESS = 0.018;
    const BEVEL = 0.007;
    const JOINTS = 4;
    const NODE_WEIGHT = 1 / 0.05;
    const MAX_STEP = 1 / 360;
    const ITERATIONS = 6;
    const MIN_GUIDE = 1;
    const MIN_SEGMENT = 0.015;
    const BEND_SMOOTHING = 0.06;
    const GRAB_FOLLOW_RATE = 40;
    const INTRO_SETTLE_DURATION = 0.8;
    const SAMPLES = 96;
    const FOV = 24;
    const STRAP_WIDTH = 0.36;
    const RING_RADIUS = 0.095;
    const RING_TUBE = 0.0135;
    const EYELET_RADIUS = 0.036;
    const CLAMP_BODY = 0.15;
    const FACE_WIDTH = 1024;

    const BAND_COLUMNS = [0, 0.07, 0.93, 1];
    const BAND_BEND = [-0.95, -0.28, 0.28, 0.95];

    const METALS = {
      silver: { color: "#d9dce2", roughness: 0.16 },
    };

    function clamp(value: number, min: number, max: number) {
      return Math.min(max, Math.max(min, value));
    }
    function mix(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function parseColor(value: string, fallback: [number, number, number]): [number, number, number] {
      try {
        const cv = document.createElement("canvas");
        const ctx = cv.getContext("2d");
        if (!ctx) return fallback;
        ctx.fillStyle = "#000000";
        ctx.fillStyle = value;
        const resolved = ctx.fillStyle;
        if (resolved.indexOf("#") === 0) {
          const n = parseInt(resolved.slice(1), 16);
          return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
        }
        const parts = resolved.match(/[\d.]+/g);
        if (!parts || parts.length < 3) return fallback;
        return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
      } catch {
        return fallback;
      }
    }


    function seeded(start: number) {
      let state = start >>> 0;
      return function () {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function traceRoundedRect(path: THREE.Shape | THREE.Path, x: number, y: number, width: number, height: number, radius: number) {
      const r = Math.max(0, Math.min(radius, width / 2, height / 2));
      const k = r * 0.4477;
      path.moveTo(x + r, y);
      path.lineTo(x + width - r, y);
      path.bezierCurveTo(x + width - k, y, x + width, y + k, x + width, y + r);
      path.lineTo(x + width, y + height - r);
      path.bezierCurveTo(x + width, y + height - k, x + width - k, y + height, x + width - r, y + height);
      path.lineTo(x + r, y + height);
      path.bezierCurveTo(x + k, y + height, x, y + height - k, x, y + height - r);
      path.lineTo(x, y + r);
      path.bezierCurveTo(x, y + k, x + k, y, x + r, y);
    }

    function cardLayout(orientation: "portrait" | "landscape", cornerRadius: number): CardLayout {
      const size = CARD_SIZES[orientation] || CARD_SIZES.portrait;
      const width = size[0], height = size[1];
      const radius = mix(0.03, Math.min(width, height) * 0.2, clamp(cornerRadius, 0, 1));
      const slot = { width: 0.34, height: 0.07, y: height / 2 - 0.13 };
      const ringY = height / 2 - 0.055;
      return { width, height, radius, slot, ringY, hangY: ringY + RING_RADIUS };
    }

    function buildCardGeometry(layout: CardLayout) {
      const { width, height, radius, slot } = layout;
      const outline = new THREE.Shape();
      traceRoundedRect(
        outline,
        -width / 2 + BEVEL,
        -height / 2 + BEVEL,
        width - BEVEL * 2,
        height - BEVEL * 2,
        Math.max(radius - BEVEL, 0.005)
      );
      const hole = new THREE.Path();
      traceRoundedRect(
        hole,
        -slot.width / 2 - BEVEL,
        slot.y - slot.height / 2 - BEVEL,
        slot.width + BEVEL * 2,
        slot.height + BEVEL * 2,
        slot.height / 2 + BEVEL
      );
      outline.holes.push(hole);
      const body = new THREE.ExtrudeGeometry(outline, {
        depth: THICKNESS,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: BEVEL,
        bevelSegments: 5,
        curveSegments: 24,
      });
      body.translate(0, 0, -THICKNESS / 2);
      const face = new THREE.ShapeGeometry(outline, 24);
      const position = face.getAttribute("position");
      const uv = face.getAttribute("uv");
      for (let i = 0; i < position.count; i++) {
        uv.setXY(i, (position.getX(i) + width / 2) / width, (position.getY(i) + height / 2) / height);
      }
      uv.needsUpdate = true;
      return { body, face };
    }

    function buildClampGeometry(width: number) {
      const shape = new THREE.Shape();
      const w = width * 1.16;
      traceRoundedRect(shape, -w / 2 + 0.014, -CLAMP_BODY / 2 + 0.014, w - 0.028, CLAMP_BODY - 0.028, 0.024);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.014,
        bevelSize: 0.014,
        bevelSegments: 6,
        curveSegments: 10,
      });
      geometry.translate(0, 0, -0.01);
      return geometry;
    }

    function buildBandGeometry(count: number) {
      const columns = BAND_COLUMNS.length;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
      geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
      geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(count * columns * 2), 2));
      const index: number[] = [];
      for (let i = 0; i < count - 1; i++) {
        for (let c = 0; c < columns - 1; c++) {
          const a = i * columns + c;
          index.push(a, a + columns, a + 1, a + 1, a + columns, a + columns + 1);
        }
      }
      geometry.setIndex(index);
      return geometry;
    }

    function buildEnvironment(glRenderer: THREE.WebGLRenderer) {
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0.035, 0.035, 0.04);
      const geometry = new THREE.PlaneGeometry(1, 1);
      const materials: THREE.MeshBasicMaterial[] = [];
      function panel(intensity: number, pos: [number, number, number], scale: [number, number], rotation = 0) {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(intensity, intensity, intensity),
          side: THREE.DoubleSide,
        });
        materials.push(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos[0], pos[1], pos[2]);
        mesh.scale.set(scale[0], scale[1], 1);
        mesh.lookAt(0, 0, 0);
        mesh.rotateZ(rotation);
        envScene.add(mesh);
      }
      panel(2.6, [0, 4.5, 8], [9, 4]);
      panel(6, [-5.5, 0.5, 7], [0.9, 14]);
      panel(4, [5, -0.5, 8], [0.6, 14]);
      panel(3.5, [0, -1, 9], [24, 0.35], Math.PI / 3);
      panel(2.5, [1, 2.5, 9], [24, 0.2], Math.PI / 3);
      panel(1.4, [0, 6, -6], [12, 4]);
      panel(0.5, [0, -7, 1], [16, 6]);
      panel(0.9, [8, 0, -2], [4, 10]);
      const pmrem = new THREE.PMREMGenerator(glRenderer);
      const target = pmrem.fromScene(envScene, 0.035);
      pmrem.dispose();
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      return target;
    }

    function makeCanvasTexture(cv: HTMLCanvasElement, aniso: number) {
      const texture = new THREE.CanvasTexture(cv);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = aniso;
      return texture;
    }

    

    function buildWeaveTexture() {
      const size = 128;
      const threads = 8;
      const random = seeded(19);
      const fiber = new Float32Array(size * size);
      for (let k = 0; k < fiber.length; k++) fiber[k] = random();
      function profile(f: number) {
        return Math.sqrt(Math.max(0, 1 - 4 * f * f));
      }
      function height(x: number, y: number) {
        const px = ((x % size) + size) % size;
        const py = ((y % size) + size) % size;
        const u = (px / size) * threads;
        const v = (py / size) * threads;
        const cu = Math.floor(u);
        const cv = Math.floor(v);
        const fu = u - cu - 0.5;
        const fv = v - cv - 0.5;
        const lift = (cu + cv) % 2 === 0;
        const warp = profile(fu) * (0.55 + 0.45 * Math.cos(fv * Math.PI * (lift ? 1 : 0.6)));
        const weft = profile(fv) * (0.55 + 0.45 * Math.cos(fu * Math.PI * (lift ? 0.6 : 1)));
        return (lift ? Math.max(warp, weft * 0.7) : Math.max(weft, warp * 0.7)) + fiber[py * size + px] * 0.08;
      }
      const data = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const nx = (height(x - 1, y) - height(x + 1, y)) * 1.6;
          const ny = (height(x, y - 1) - height(x, y + 1)) * 1.6;
          const length = Math.hypot(nx, ny, 1);
          const i = (y * size + x) * 4;
          data[i] = ((nx / length) * 0.5 + 0.5) * 255;
          data[i + 1] = ((ny / length) * 0.5 + 0.5) * 255;
          data[i + 2] = ((1 / length) * 0.5 + 0.5) * 255;
          data[i + 3] = 255;
        }
      }
      const texture = new THREE.DataTexture(data, size, size);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      return texture;
    }

    // ORIGINAL PURE RED & BLACK LUXURY FINISH (NO RAINBOW / NO NOISE)
    function paintFace(canvas: HTMLCanvasElement, color: [number, number, number], logoImageElement?: HTMLImageElement | null) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      // Base Obsidian Carbon
      ctx.fillStyle = "#070709";
      ctx.fillRect(0, 0, w, h);

      // Deep Ruby & Crimson Luxury Gradient
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#060608");
      base.addColorStop(0.35, "#140306");
      base.addColorStop(0.70, "#48080f");
      base.addColorStop(1, "#8e0e18");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Subtle fine carbon weave pattern
      ctx.save();
      ctx.fillStyle = "rgba(255, 40, 55, 0.025)";
      for (let y = 0; y < h; y += 6) {
        ctx.fillRect(0, y, w, 1);
      }
      for (let x = 0; x < w; x += 6) {
        ctx.fillRect(x, 0, 1, h);
      }
      ctx.restore();

      // Delicate diagonal glass sheen (pure white monochrome, zero rainbow)
      const sheen = ctx.createLinearGradient(0, 0, w * 0.8, h * 0.6);
      sheen.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      sheen.addColorStop(0.4, "rgba(255, 255, 255, 0.02)");
      sheen.addColorStop(1, "rgba(255, 255, 255, 0.0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);


      // Center Studio Logo
      if (logoImageElement) {
        const logoSize = Math.min(w, h) * 0.34;
        ctx.save();
        // Subtle crimson ambient backglow behind logo
        const logoGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, logoSize * 0.8);
        logoGlow.addColorStop(0, "rgba(255, 35, 50, 0.25)");
        logoGlow.addColorStop(1, "rgba(255, 35, 50, 0)");
        ctx.fillStyle = logoGlow;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, logoSize * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(logoImageElement, (w - logoSize) / 2, (h - logoSize) / 2 - 10, logoSize, logoSize);
        ctx.restore();
      }

      // Exclusive Quote below logo (Where inspiration becomes obsession)
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "700 " + Math.round(w * 0.027) + "px sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText("WHERE INSPIRATION BECOMES OBSESSION", w / 2, h / 2 + Math.min(w, h) * 0.23);
      ctx.restore();
    }

    function paintStrap(canvas: HTMLCanvasElement) {
      const across = 192;
      const along = across * 2;
      canvas.width = across;
      canvas.height = along;
      const ctx = canvas.getContext("2d");
      if (!ctx) return along / across;
      
      // Jet black obsidian lanyard strap
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, across, along);

      // Fine woven thread micro-texture
      ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
      for (let y = 0; y < along; y += 4) ctx.fillRect(0, y, across, 1);

      // Crimson racing edge lines
      ctx.fillStyle = "#ff2d3d";
      ctx.fillRect(across * 0.08, 0, 3.5, along);
      ctx.fillRect(across * 0.92 - 3.5, 0, 3.5, along);

      // Metallic micro-stitches
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      for (let y2 = 0; y2 < along; y2 += 14) {
        ctx.fillRect(across * 0.15, y2, 2, 6);
        ctx.fillRect(across * 0.85 - 2, y2, 2, 6);
      }
      return along / across;
    }

    function createSimulation(): SimulationState {
      function vectors() {
        const arr = [];
        for (let i = 0; i <= JOINTS; i++) arr.push(new THREE.Vector3());
        return arr;
      }
      return {
        nodes: vectors(),
        previous: vectors(),
        velocities: vectors(),
        lengths: new Float64Array(JOINTS),
        impulses: new Float64Array(JOINTS),
        rest: 1,
        anchor: new THREE.Vector3(),
        body: {
          position: new THREE.Vector3(),
          previous: new THREE.Vector3(),
          velocity: new THREE.Vector3(),
          quaternion: new THREE.Quaternion(),
          previousQuaternion: new THREE.Quaternion(),
          angular: new THREE.Vector3(),
          mass: 1,
          inverseInertia: new THREE.Vector3(1, 1, 1),
          hang: new THREE.Vector3(),
        },
        grab: null,
        turn: 0,
        twist: 0,
        twistRaw: 0,
        calm: 0,
        introActive: false,
        introElapsed: 0,
        flipLockUntil: 0,
      };
    }

    const scratch = {
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      c: new THREE.Vector3(),
      d: new THREE.Vector3(),
      e: new THREE.Vector3(),
      f: new THREE.Vector3(),
      g: new THREE.Vector3(),
      h: new THREE.Vector3(),
      pin: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      r: new THREE.Quaternion(),
    };

    function applyInverseInertia(body: SimulationBody, vector: THREE.Vector3, out: THREE.Vector3) {
      scratch.r.copy(body.quaternion).invert();
      out.copy(vector).applyQuaternion(scratch.r);
      out.set(out.x * body.inverseInertia.x, out.y * body.inverseInertia.y, out.z * body.inverseInertia.z);
      return out.applyQuaternion(body.quaternion);
    }

    function rotateBody(q: THREE.Quaternion, w: THREE.Vector3) {
      const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
      q.x += 0.5 * (w.x * qw + w.y * qz - w.z * qy);
      q.y += 0.5 * (w.y * qw + w.z * qx - w.x * qz);
      q.z += 0.5 * (w.z * qw + w.x * qy - w.y * qx);
      q.w += 0.5 * (-w.x * qx - w.y * qy - w.z * qz);
      q.normalize();
    }

    function bodyWeight(body: SimulationBody, r: THREE.Vector3, normal: THREE.Vector3) {
      const rn = scratch.c.crossVectors(r, normal);
      return 1 / body.mass + rn.dot(applyInverseInertia(body, rn, scratch.d));
    }

    function pushBody(body: SimulationBody, r: THREE.Vector3, impulse: THREE.Vector3) {
      body.position.addScaledVector(impulse, 1 / body.mass);
      rotateBody(body.quaternion, applyInverseInertia(body, scratch.e.crossVectors(r, impulse), scratch.f));
    }

    function solveSegment(sim: SimulationState, i: number, h: number, physics: PhysicsConfig) {
      const { nodes, body } = sim;
      const a = nodes[i];
      const wa = i === 0 ? 0 : NODE_WEIGHT;
      const last = i === JOINTS - 1;
      const r = scratch.g;
      let b = nodes[i + 1];
      if (last) {
        r.copy(body.hang).applyQuaternion(body.quaternion);
        b = scratch.b.copy(body.position).add(r);
      }
      const delta = scratch.a.subVectors(b, a);
      const length = delta.length();
      const stretch = length - sim.rest;
      if (stretch <= 0 || length < 1e-9) return;
      const normal = delta.divideScalar(length);
      const wb = last ? bodyWeight(body, r, normal) : NODE_WEIGHT;
      const rate = (length - sim.lengths[i]) / h;
      const tension =
        physics.hold * Math.tanh((physics.stiffness * stretch) / physics.hold) +
        physics.spring * stretch +
        physics.bandDamping * Math.max(0, rate);
      const room = tension * h * h - sim.impulses[i];
      if (room <= 0) return;
      const lambda = Math.min(stretch / (wa + wb), room);
      sim.impulses[i] += lambda;
      if (wa) a.addScaledVector(normal, lambda * wa);
      if (last) pushBody(body, r, normal.multiplyScalar(-lambda));
      else b.addScaledVector(normal, -lambda * wb);
    }

    function solvePin(body: SimulationBody, grab: GrabState, target: THREE.Vector3) {
      const r = scratch.g.copy(grab.local).applyQuaternion(body.quaternion);
      const delta = scratch.a.copy(target).sub(body.position).sub(r);
      const distance = delta.length();
      if (distance < 1e-9) return;
      const normal = delta.divideScalar(distance);
      const lambda = distance / bodyWeight(body, r, normal);
      pushBody(body, r, normal.multiplyScalar(lambda));
    }

    function placeHanging(sim: SimulationState, layout: CardLayout, intro: boolean) {
      const { nodes, previous, velocities, body, anchor } = sim;
      nodes[0].copy(anchor);

      for (let j = 1; j <= JOINTS; j++) {
        nodes[j].copy(nodes[j - 1]);
        nodes[j].y -= sim.rest * (intro ? 0.78 : 1.0);
        nodes[j].x += (j % 2 === 0 ? 1 : -1) * 0.008 * j;
        previous[j].copy(nodes[j]);
        velocities[j].set(0, 0, 0);
      }

      body.hang.set(0, layout.hangY, 0);
      if (intro) {
        body.quaternion.setFromAxisAngle(scratch.h.set(0.18, 1, 0.08).normalize(), 0.18);
      } else {
        body.quaternion.identity();
      }

      const offset = scratch.a.copy(body.hang).applyQuaternion(body.quaternion);
      body.position.copy(nodes[JOINTS]).sub(offset);
      body.previous.copy(body.position);
      body.previousQuaternion.copy(body.quaternion);
      body.velocity.set(0, intro ? -0.5 : 0, 0);
      body.angular.set(0, 0, 0);
      previous[0].copy(nodes[0]);
      velocities[0].set(0, 0, 0);
      sim.lengths.fill(sim.rest);
      sim.turn = 0;
      sim.twist = 0;
      sim.twistRaw = 0;
      sim.calm = 0;
      sim.introActive = !!intro;
      sim.introElapsed = 0;
      sim.flipLockUntil = 0;
    }

    function configureSimulation(sim: SimulationState, layout: CardLayout, length: number) {
      sim.rest = length / JOINTS;
      const { width, height } = layout;
      const { body } = sim;
      const t = THICKNESS + BEVEL * 2;
      body.mass = 1;
      body.inverseInertia.set(
        12 / (height * height + t * t),
        12 / (width * width + t * t),
        12 / (width * width + height * height)
      );
      body.hang.set(0, layout.hangY, 0);
    }

    function sanitize(sim: SimulationState, layout: CardLayout) {
      const { body } = sim;
      let bad = !isFinite(body.position.x + body.position.y + body.position.z + body.quaternion.w);
      if (!bad) {
        for (let i = 0; i <= JOINTS; i++) {
          const n = sim.nodes[i];
          if (!isFinite(n.x + n.y + n.z)) {
            bad = true;
            break;
          }
        }
      }
      if (bad) {
        sim.grab = null;
        placeHanging(sim, layout, false);
      }
    }

    function stepSimulation(sim: SimulationState, dt: number, physics: PhysicsConfig, timeVal: number) {
      if (sim.introActive) sim.introElapsed += dt;

      const steps = Math.max(1, Math.ceil(dt / MAX_STEP - 1e-6));
      const h = dt / steps;
      const { nodes, previous, velocities, body } = sim;
      const windX = physics.breeze * (Math.sin(timeVal * 0.53) * 0.7 + Math.sin(timeVal * 1.31 + 1.7) * 0.3) * 3;
      const windZ = physics.breeze * Math.sin(timeVal * 0.37 + 0.6) * 2;
      const grab = sim.grab;
      const pinVec = scratch.pin;
      const nodeDrag = Math.exp(-physics.nodeDrag * h);
      const linearDrag = Math.exp(-physics.linearDrag * h);
      const angularDrag = Math.exp(-physics.angularDrag * h);

      for (let s = 0; s < steps; s++) {
        const gravX = physics.gravity * currentTiltX;
        const gravY = physics.gravity * currentTiltY;

        for (let i = 1; i < JOINTS; i++) {
          const v = velocities[i];
          v.x += (gravX + windX) * h;
          v.y += gravY * h;
          v.z += windZ * h;
          previous[i].copy(nodes[i]);
          nodes[i].addScaledVector(v, h);
        }

        body.previous.copy(body.position);
        body.previousQuaternion.copy(body.quaternion);
        const q = body.quaternion;
        if (grab) {
          const turn = scratch.q.copy(grab.rotation).multiply(scratch.r.copy(q).invert());
          if (turn.w < 0) turn.set(-turn.x, -turn.y, -turn.z, -turn.w);
          const torque = scratch.a.set(turn.x, turn.y, turn.z).multiplyScalar(2 * physics.grip);
          torque.addScaledVector(body.angular, -physics.gripDamping);
          body.angular.addScaledVector(applyInverseInertia(body, torque, scratch.b), h);
        }
        const up = scratch.a.set(0, 1, 0).applyQuaternion(q);
        const front = scratch.b.set(-up.x * up.z, -up.y * up.z, 1 - up.z * up.z);
        if (front.lengthSq() > 1e-3) {
          const facing = scratch.d.set(0, 0, 1).applyQuaternion(q);
          const raw = Math.atan2(scratch.e.crossVectors(front, facing).dot(up), front.dot(facing));
          let turned = raw - sim.twistRaw;
          if (turned > Math.PI) turned -= Math.PI * 2;
          else if (turned < -Math.PI) turned += Math.PI * 2;
          sim.twist += turned;
          sim.twistRaw = raw;
        }
        if (!grab) {
          const spin = body.angular.dot(up);
          body.angular.addScaledVector(up, (physics.twist * (sim.turn - sim.twist) - physics.twistDamping * spin) * h);
        }
        body.velocity.x += (gravX + windX * 0.35) * h;
        body.velocity.y += gravY * h;
        body.velocity.z += windZ * 0.35 * h;
        body.position.addScaledVector(body.velocity, h);
        rotateBody(body.quaternion, scratch.f.copy(body.angular).multiplyScalar(h));

        sim.impulses.fill(0);

        if (grab) {
          const followAlpha = 1 - Math.exp(-GRAB_FOLLOW_RATE * h);
          grab.target.lerp(grab.raw, followAlpha);
          pinVec.copy(grab.target);
        }

        for (let iteration = 0; iteration < ITERATIONS; iteration++) {
          for (let seg = 0; seg < JOINTS; seg++) solveSegment(sim, seg, h, physics);
          if (grab) solvePin(body, grab, pinVec);
        }

        for (let bi = 1; bi < JOINTS; bi++) {
          scratch.a.addVectors(nodes[bi - 1], nodes[bi + 1]).multiplyScalar(0.5);
          nodes[bi].lerp(scratch.a, BEND_SMOOTHING);
        }

        for (let mi = 0; mi < JOINTS; mi++) {
          const pA = nodes[mi];
          const pB = nodes[mi + 1];
          const d = scratch.a.subVectors(pB, pA);
          const dl = d.length();
          if (dl > 1e-7 && dl < MIN_SEGMENT) {
            const push = (MIN_SEGMENT - dl) * 0.5;
            d.multiplyScalar(1 / dl);
            if (mi !== 0) pA.addScaledVector(d, -push);
            if (mi + 1 !== JOINTS) pB.addScaledVector(d, push);
          } else if (dl <= 1e-7) {
            if (mi + 1 !== JOINTS) pB.y -= MIN_SEGMENT;
          }
        }

        for (let n = 1; n < JOINTS; n++) {
          const vv = velocities[n].subVectors(nodes[n], previous[n]).divideScalar(h).multiplyScalar(nodeDrag);
          vv.multiplyScalar(1 / (1 + physics.nodeAir * vv.length() * h));
        }
        body.velocity.subVectors(body.position, body.previous).divideScalar(h);
        const dq = scratch.q.copy(body.previousQuaternion).invert().premultiply(body.quaternion);
        body.angular.set(dq.x, dq.y, dq.z).multiplyScalar((2 / h) * (dq.w < 0 ? -1 : 1));

        const normal = scratch.a.set(0, 0, 1).applyQuaternion(body.quaternion);
        const across = body.velocity.dot(normal);
        const along = scratch.b.copy(body.velocity).addScaledVector(normal, -across);
        along.multiplyScalar(1 / (1 + physics.air * along.length() * h));
        body.velocity
          .copy(along)
          .addScaledVector(normal, across / (1 + physics.broadside * Math.abs(across) * h))
          .multiplyScalar(linearDrag);
        body.angular.multiplyScalar(angularDrag / (1 + physics.spinAir * body.angular.length() * h));
        if (body.velocity.lengthSq() > 3600) body.velocity.setLength(60);
        if (body.angular.lengthSq() > 1600) body.angular.setLength(40);

        nodes[JOINTS].copy(body.hang).applyQuaternion(body.quaternion).add(body.position);
        for (let k = 0; k < JOINTS; k++) sim.lengths[k] = nodes[k].distanceTo(nodes[k + 1]);
      }

      const energy = body.velocity.lengthSq() + body.angular.lengthSq() * 0.3;
      sim.calm = energy < 2e-4 ? sim.calm + dt : 0;
    }

    /* ============================================================
       SETUP THREE SCENE & RENDERER
    ============================================================ */

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    const canvas = renderer.domElement;
    canvas.className = "lanyard-canvas";
    canvas.setAttribute("aria-hidden", "true");
    stage.appendChild(canvas);

    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const scene = new THREE.Scene();
    const environment = buildEnvironment(renderer);
    scene.environment = environment.texture;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(-2.5, 4, 6);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
    fillLight.position.set(3, -1, 4);
    scene.add(keyLight, fillLight);

    const frontCanvas = document.createElement("canvas");
    const backCanvas = document.createElement("canvas");
    const strapCanvas = document.createElement("canvas");
    const frontTexture = makeCanvasTexture(frontCanvas, anisotropy);
    const backTexture = makeCanvasTexture(backCanvas, anisotropy);
    const strapTexture = makeCanvasTexture(strapCanvas, anisotropy);
    strapTexture.wrapS = THREE.ClampToEdgeWrapping;
    strapTexture.wrapT = THREE.RepeatWrapping;
    const weave = buildWeaveTexture();

    // Pure luxury obsidian finish - NO rainbow shader
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.95,
      clearcoatRoughness: 0.06,
    });
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.95,
      clearcoatRoughness: 0.06,
    });

    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#160305"),
      roughness: 0.32,
      metalness: 0.25,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#dcdde2"),
      metalness: 0.95,
      roughness: 0.18,
    });
    const bandMaterial = new THREE.MeshPhysicalMaterial({
      map: strapTexture,
      normalMap: weave,
      normalScale: new THREE.Vector2(0.7, 0.7),
      roughness: 0.68,
      sheen: 1,
      sheenRoughness: 0.42,
      sheenColor: new THREE.Color(0.32, 0.32, 0.34),
      side: THREE.DoubleSide,
    });

    const cardGroup = new THREE.Group();
    const bodyMesh = new THREE.Mesh(undefined, edgeMaterial);
    const frontMesh = new THREE.Mesh(undefined, frontMaterial);
    const backMesh = new THREE.Mesh(undefined, backMaterial);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(RING_RADIUS, RING_TUBE, 18, 72), metalMaterial);
    ring.rotation.y = Math.PI / 2 - 0.7;
    cardGroup.add(bodyMesh, frontMesh, backMesh, ring);
    scene.add(cardGroup);

    const bandGeometry = buildBandGeometry(SAMPLES);
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.frustumCulled = false;
    scene.add(band);

    const clampGroup = new THREE.Group();
    const clampMesh = new THREE.Mesh(buildClampGeometry(STRAP_WIDTH), metalMaterial);
    clampMesh.position.y = EYELET_RADIUS + CLAMP_BODY / 2 - 0.004;
    const eyelet = new THREE.Mesh(new THREE.TorusGeometry(EYELET_RADIUS, 0.0105, 14, 40), metalMaterial);
    clampGroup.add(clampMesh, eyelet);
    scene.add(clampGroup);

    const sim = createSimulation();
    const controls: THREE.Vector3[] = [];
    const mouth = new THREE.Vector3();
    const tuck = new THREE.Vector3();
    const curve = new THREE.CatmullRomCurve3(controls, false, "centripetal");
    const view = { width: 1, height: 1 };
    let layout = cardLayout("portrait", 0.3);
    const strapScale = STRAP_WIDTH * 0.65;
    let tileRatio = 2;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let alive = true;
    let placed = false;
    let hovering = false;
    let press: PressState | null = null;
    let targetTiltX = 0;
    let targetTiltY = -1;
    let currentTiltX = 0;
    let currentTiltY = -1;

    // Load VTECH logo for card face
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = "/vtech-studios-logo.png";
    logoImg.onload = () => {
      paintFaces();
    };

    function paintFaces() {
      const color = parseColor("#210709", [1, 1, 1]);
      const width = FACE_WIDTH;
      const height = Math.round((FACE_WIDTH * layout.height) / layout.width);
      if (frontCanvas.width !== width || frontCanvas.height !== height) {
        frontCanvas.width = width;
        frontCanvas.height = height;
        backCanvas.width = width;
        backCanvas.height = height;
      }
      paintFace(frontCanvas, color, logoImg);
      paintFace(backCanvas, color, logoImg);
      frontTexture.needsUpdate = true;
      backTexture.needsUpdate = true;
      start();
    }

    function repaintStrap() {
      tileRatio = paintStrap(strapCanvas);
      weave.repeat.set(2, 2 * tileRatio);
      strapTexture.needsUpdate = true;
      start();
    }

    function frameView() {
      const aspect = view.width / view.height;
      let viewHeight = layout.height / 0.55;
      const minimumWidth = layout.width / 0.72;
      if (viewHeight * aspect < minimumWidth) viewHeight = minimumWidth / aspect;
      const viewWidth = viewHeight * aspect;
      camera.aspect = aspect;
      camera.position.set(0, 0, viewHeight / 2 / Math.tan((FOV * Math.PI) / 360));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      const anchorX = (ANCHORS.center - 0.5) * viewWidth;
      const anchorY = viewHeight / 2 + 0.2;
      const cardTop = viewHeight / 2 - viewHeight * mix(0.12, 0.42, 0.5);
      const hangTop = cardTop + (layout.hangY - layout.height / 2);
      sim.anchor.set(anchorX, anchorY, 0);
      configureSimulation(sim, layout, anchorY - hangTop);
      sim.nodes[0].copy(sim.anchor);
      sim.previous[0].copy(sim.anchor);
    }

    function apply() {
      layout = cardLayout("portrait", 0.3);
      const geometry = buildCardGeometry(layout);
      if (bodyMesh.geometry) bodyMesh.geometry.dispose();
      if (frontMesh.geometry) frontMesh.geometry.dispose();
      if (backMesh.geometry) backMesh.geometry.dispose();
      bodyMesh.geometry = geometry.body;
      frontMesh.geometry = geometry.face;
      backMesh.geometry = geometry.face.clone();
      frontMesh.position.z = THICKNESS / 2 + BEVEL + 0.0006;
      backMesh.rotation.y = Math.PI;
      backMesh.position.z = -(THICKNESS / 2 + BEVEL + 0.0006);
      ring.position.set(0, layout.ringY, 0);

      frameView();
      if (!placed) {
        placeHanging(sim, layout, true);
        placed = true;
      }

      paintFaces();
      repaintStrap();

      const card = parseColor("#210709", [1, 1, 1]);
      [frontMaterial, backMaterial].forEach((material) => {
        material.roughness = 0.28;
        material.metalness = 0.05;
        material.clearcoat = 1;
        material.clearcoatRoughness = 0.08;
      });

      edgeMaterial.color.setRGB(card[0] * 0.92, card[1] * 0.92, card[2] * 0.92, THREE.SRGBColorSpace);
      edgeMaterial.roughness = 0.3;
      edgeMaterial.metalness = 0.05;
      edgeMaterial.clearcoat = 1;
      edgeMaterial.clearcoatRoughness = 0.08;
      const metalLook = METALS.silver;
      metalMaterial.color.set(metalLook.color);
      metalMaterial.roughness = metalLook.roughness;

      clampMesh.geometry.dispose();
      clampMesh.geometry = buildClampGeometry(strapScale);
      canvas.style.touchAction = "none";
      start();
    }

    const points: THREE.Vector3[] = [];
    const sides: THREE.Vector3[] = [];
    for (let pIdx = 0; pIdx < SAMPLES; pIdx++) {
      points.push(new THREE.Vector3());
      sides.push(new THREE.Vector3());
    }
    const bends = BAND_BEND.map((angle) => [Math.cos(angle), Math.sin(angle)]);
    const work = {
      tangent: new THREE.Vector3(),
      toCamera: new THREE.Vector3(),
      basis: new THREE.Matrix4(),
      up: new THREE.Vector3(),
      across: new THREE.Vector3(),
      facing: new THREE.Vector3(),
      end: new THREE.Vector3(),
    };

    function updateBand() {
      const hang = sim.nodes[JOINTS];
      const reach = EYELET_RADIUS + CLAMP_BODY + 0.05;

      let guide = JOINTS - 1;
      while (guide > MIN_GUIDE && sim.nodes[guide].distanceTo(hang) < reach * 1.1) guide--;

      const axis = work.up.subVectors(sim.nodes[guide], hang);
      if (axis.lengthSq() < 1e-8) axis.set(0, 1, 0).applyQuaternion(sim.body.quaternion);
      axis.normalize();
      mouth.copy(hang).addScaledVector(axis, reach);
      tuck.copy(hang).addScaledVector(axis, EYELET_RADIUS + CLAMP_BODY * 0.35);
      controls.length = 0;
      for (let i = 0; i <= guide; i++) controls.push(sim.nodes[i]);
      controls.push(mouth, tuck);
      curve.updateArcLengths();
      for (let j = 0; j < SAMPLES; j++) curve.getPointAt(j / (SAMPLES - 1), points[j]);
      const length = curve.getLength();

      if (!isFinite(length) || length < 1e-5) return;

      const held = 1 - mouth.distanceTo(tuck) / Math.max(length, 0.001);
      const position = bandGeometry.getAttribute("position") as THREE.BufferAttribute;
      const normal = bandGeometry.getAttribute("normal") as THREE.BufferAttribute;
      const uv = bandGeometry.getAttribute("uv") as THREE.BufferAttribute;
      const columns = BAND_COLUMNS.length;
      const restLength = sim.rest * JOINTS;
      const repeats = restLength / (strapScale * tileRatio);
      const width = strapScale / Math.pow(Math.max(1, length / Math.max(restLength, 0.001)), 0.35);
      const { tangent, toCamera, across, facing } = work;
      for (let k = 0; k < SAMPLES; k++) {
        tangent.subVectors(points[Math.min(SAMPLES - 1, k + 1)], points[Math.max(0, k - 1)]);
        if (tangent.lengthSq() < 1e-12) tangent.set(0, -1, 0);
        tangent.normalize();
        toCamera.subVectors(camera.position, points[k]).normalize();
        const side = sides[k].crossVectors(toCamera, tangent);
        if (side.lengthSq() < 1e-10) side.copy(k > 0 ? sides[k - 1] : scratch.a.set(1, 0, 0));
        side.normalize();
        if (k > 0 && side.dot(sides[k - 1]) < 0) side.negate();
        const angle = -sim.twist * Math.pow(Math.min(1, k / (SAMPLES - 1) / held), 1.3);
        facing.crossVectors(tangent, side);
        across.copy(side).multiplyScalar(Math.cos(angle)).addScaledVector(facing, Math.sin(angle));
        facing.crossVectors(tangent, across);
        const p = points[k];
        const v = (1 - k / (SAMPLES - 1)) * repeats;
        for (let c = 0; c < columns; c++) {
          const idx = k * columns + c;
          const offset = (BAND_COLUMNS[c] - 0.5) * width;
          const bendCos = bends[c][0], bendSin = bends[c][1];
          position.setXYZ(idx, p.x + across.x * offset, p.y + across.y * offset, p.z + across.z * offset);
          normal.setXYZ(
            idx,
            facing.x * bendCos + across.x * bendSin,
            facing.y * bendCos + across.y * bendSin,
            facing.z * bendCos + across.z * bendSin
          );
          uv.setXY(idx, BAND_COLUMNS[c], v);
        }
      }
      work.end.copy(across);
      position.needsUpdate = true;
      normal.needsUpdate = true;
      uv.needsUpdate = true;

      across.copy(work.end).addScaledVector(axis, -work.end.dot(axis)).normalize();
      facing.crossVectors(across, axis).normalize();
      work.basis.makeBasis(across, axis, facing);
      clampGroup.quaternion.setFromRotationMatrix(work.basis);
      clampGroup.position.copy(hang);
    }

    function render() {
      cardGroup.position.copy(sim.body.position);
      cardGroup.quaternion.copy(sim.body.quaternion);
      updateBand();
      renderer.render(scene, camera);

      if (window.vtUpdateCardScreenPos) {
        // Calculate the bottom center of the card in 3D
        scratch.a.set(0, -layout.height * 0.505, 0).applyQuaternion(sim.body.quaternion).add(sim.body.position);
        scratch.a.project(camera);
        const screenX = (scratch.a.x * 0.5 + 0.5) * view.width;
        const screenY = (1 - (scratch.a.y * 0.5 + 0.5)) * view.height;

        // Card 2D angle for smooth matching tilt
        scratch.b.set(1, 0, 0).applyQuaternion(sim.body.quaternion);
        const angle = Math.atan2(scratch.b.y, scratch.b.x);

        window.vtUpdateCardScreenPos(screenX, screenY, -angle);
      }
    }

    function physics(): PhysicsConfig {
      const gravity = 40;
      const weight = Math.max(gravity, 20);
      const springy = 0.5;
      const settle = 0.5;

      let introBoost = 0;
      if (sim.introActive) {
        const t = clamp(sim.introElapsed / INTRO_SETTLE_DURATION, 0, 1);
        introBoost = 1 - (t * t * (3 - 2 * t));
        if (t >= 1) sim.introActive = false;
      }

      const effectiveSettle = clamp(settle + introBoost * 0.45, 0, 1);
      const effectiveBreeze = 0.45 * (1 - introBoost * 0.85);

      return {
        gravity,
        hold: weight * mix(2.2, 5.5, springy),
        stiffness: weight * 10 * JOINTS,
        spring: weight * mix(0.1, 0.4, springy) * JOINTS,
        bandDamping: weight * mix(0.3, 0.08, springy) * JOINTS * (1 + introBoost * 1.5),
        linearDrag: 0.25 * Math.pow(16, effectiveSettle),
        angularDrag: 0.5 * Math.pow(12, effectiveSettle),
        air: 0.15,
        broadside: 0.5,
        spinAir: 0.03,
        nodeDrag: 2 + introBoost * 6,
        nodeAir: 0.2,
        twist: 30,
        twistDamping: 3,
        grip: 40,
        gripDamping: 6,
        breeze: effectiveBreeze,
      };
    }

    function tick(now: number) {
      raf = 0;
      if (!alive) return;
      const dt = Math.min(1 / 24, Math.max(1 / 480, (now - last) / 1000));
      last = now;
      time += dt;

      // Smoothly interpolate device tilt gravity (responsively follows mobile wobble)
      currentTiltX += (targetTiltX - currentTiltX) * (1 - Math.exp(-dt * 8));
      currentTiltY += (targetTiltY - currentTiltY) * (1 - Math.exp(-dt * 8));

      const current = physics();
      stepSimulation(sim, dt, current, time);
      sanitize(sim, layout);
      render();
      const resting = sim.calm > 1.2 && !sim.grab && current.breeze === 0 && !sim.introActive && Math.abs(currentTiltX) < 0.02 && Math.abs(currentTiltY + 1) < 0.02;
      if (!resting) raf = requestAnimationFrame(tick);
    }

    function start() {
      if (raf || !alive) return;
      sim.calm = 0;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function triggerDrop() {
      placeHanging(sim, layout, true);
      start();
    }

    startSimulationRef.current = start;
    stopSimulationRef.current = stop;
    triggerDropRef.current = triggerDrop;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function toPointer(e: PointerEvent | Touch) {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
    }

    function pickCard() {
      cardGroup.updateMatrixWorld();
      const hits = raycaster.intersectObjects([bodyMesh, frontMesh, backMesh], false);
      return hits[0] || null;
    }

    // Touch & Pointer Down: Grabs card cleanly on mobile and desktop!
    function onPointerDown(event: PointerEvent) {
      if (event.button > 0) return;
      toPointer(event);
      const hit = pickCard();
      if (!hit) return;
      sim.grab = {
        local: hit.point.clone().sub(sim.body.position).applyQuaternion(sim.body.quaternion.clone().invert()),
        rotation: sim.body.quaternion.clone(),
        reach: hit.distance,
        raw: hit.point.clone(),
        target: hit.point.clone(),
      };
      press = { x: event.clientX, y: event.clientY, time: performance.now() };
      canvas.style.cursor = "grabbing";
      if (canvas.setPointerCapture) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch {}
      }
      start();
    }

    // Pointer Move: Stretches, moves and swings card with full elasticity!
    function onPointerMove(event: PointerEvent) {
      toPointer(event);
      if (sim.grab) {
        if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6) press = null;
        raycaster.ray.at(sim.grab.reach, sim.grab.raw);
        canvas.style.cursor = "grabbing";
        start();
        return;
      }
      hovering = !!pickCard();
      canvas.style.cursor = hovering ? "grab" : "default";
    }

    // Pointer Up: Releases card and sets it swinging gracefully!
    function onPointerUp(event: PointerEvent) {
      if (!sim.grab) return;
      sim.grab = null;
      canvas.style.cursor = hovering ? "grab" : "default";

      press = null;
      if (canvas.releasePointerCapture) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch {}
      }
      start();
    }

    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    canvas.addEventListener("pointermove", onPointerMove, { passive: false });
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    function onDeviceOrientation(e: DeviceOrientationEvent) {
      if (e.gamma === null && e.beta === null) return;
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;

      // Gamma [-90, 90]: lateral tilt (left / right)
      const gRad = (gamma * Math.PI) / 180;
      targetTiltX = Math.sin(gRad) * 1.6;

      // Beta [-180, 180]: longitudinal tilt (upside down detection)
      // When phone is turned upside down, reverse gravity so the card falls toward the opposite side!
      if (beta < -30 || beta > 130) {
        targetTiltY = 0.85;
      } else {
        targetTiltY = -Math.cos(gRad * 0.4);
      }
      start();
    }

    function onDeviceMotion(e: DeviceMotionEvent) {
      if (!e.acceleration) return;
      const ax = e.acceleration.x ?? 0;
      const ay = e.acceleration.y ?? 0;
      // Waving phone gives dynamic impulse for playful wobble
      targetTiltX -= ax * 0.05;
      targetTiltY -= ay * 0.05;
      start();
    }

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });
      window.addEventListener("devicemotion", onDeviceMotion, { passive: true });
    }

    function resize() {
      if (!stage) return;
      view.width = Math.max(1, stage.clientWidth);
      view.height = Math.max(1, stage.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(view.width, view.height, false);
      apply();
      render();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    requestAnimationFrame(() => {
      canvas.classList.add("is-ready");
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", onDeviceOrientation);
        window.removeEventListener("devicemotion", onDeviceMotion);
      }
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);



  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
      } flex items-center justify-center`}
    >
      {/* Background radial gradient glow (vtBackdrop) */}
      <div
        id="vtBackdrop"
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(1100px 650px at 18% 12%, rgba(255, 45, 61, 0.08), transparent 60%),
            radial-gradient(900px 600px at 85% 85%, rgba(255, 45, 61, 0.05), transparent 65%),
            linear-gradient(135deg, rgba(7, 7, 10, 0.22) 0%, rgba(18, 16, 20, 0.25) 55%, rgba(26, 10, 12, 0.26) 100%)
          `,
        }}
      />

      {/* Static blur scrim: fixed blur radius eliminates CPU/GPU stall on card reveal */}
      <div
        id="vtScrim"
        className={`fixed inset-0 z-1 pointer-events-auto transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backdropFilter: "blur(2.5px) saturate(110%)",
          WebkitBackdropFilter: "blur(2.5px) saturate(110%)",
          backgroundColor: "rgba(6, 3, 4, 0.15)",
        }}
        onClick={handleClose}
      />

      {/* Mobile-Only Wobble/Tilt Hint: Displays only on touch devices for 3.5s, completely hidden on laptops/mouse */}
      {isMobileTouch && showMobileHint && isOpen && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none px-3.5 py-1.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md shadow-2xl flex items-center gap-2 animate-in fade-in duration-300">
          <span className="size-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
          <ScrambledText
            scrambleChars=".:/[]"
            scrambleColor="#ff3b4b"
            speed={0.4}
            duration={1}
            effect="scramble"
            className="!m-0 !max-w-none text-[10px] font-mono tracking-widest text-neutral-300 uppercase whitespace-nowrap"
          >
            TILT OR WAVE DEVICE TO SWAY CARD
          </ScrambledText>
        </div>
      )}

      {/* Dismiss / Close Button in top right */}
      <button
        onClick={handleClose}
        className="fixed top-5 right-5 sm:top-7 sm:right-7 z-40 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white backdrop-blur-xl transition-all shadow-lg shadow-black/50 cursor-pointer"
        aria-label="Close card"
      >
        <X className="h-5 w-5" />
      </button>

      {/* If PIN verified, reveal the Motivational Vault Screen! */}
      {isUnlocked ? (
        <div className="relative z-30 w-full h-full flex items-center justify-center p-4 overflow-y-auto">
          <MotivationalVaultView onClose={handleClose} />
        </div>
      ) : (
        /* The 3D Lanyard Card & Animated Micro PIN Pill (code: 09) */
        <div className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none">
          <div
            id="lanyardContainer"
            ref={containerRef}
            className="w-full h-full pointer-events-auto relative overflow-hidden"
          >
            {/* Seamlessly attached right below the card bottom edge */}
            <div id="vtCardAttachedOverlay" className="vt-attached-overlay">
              <div id="vtCardAnchor" ref={anchorRef} className="vt-attached-anchor">
                <div
                  className={`vt-pin-pill ${pinStatus === "success" ? "is-success" : ""} ${
                    pinStatus === "error" ? "is-error" : ""
                  }`}
                  onClick={() => inputRef.current?.focus({ preventScroll: true })}
                >
                  {pinStatus === "success" ? (
                    <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  )}

                  <div className="vt-led-cluster">
                    {[0, 1].map((i) => (
                      <span
                        key={i}
                        className={`vt-led-dot ${i < pin.length ? "is-active" : ""}`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono tracking-wider text-neutral-400 select-none uppercase">
                    {pinStatus === "success" ? "ACCESS GRANTED" : pin.length > 0 ? "CONFIRM" : "ENTER PIN"}
                  </span>

                  {/* Hidden input for mobile keyboard / direct focus */}
                  <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    autoComplete="off"
                    aria-label="Passcode (PIN: 09)"
                    className="vt-hidden-pin-input"
                    value={pin}
                    onChange={handlePinChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .lanyard-canvas {
          display: block;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: auto !important;
          touch-action: none !important;
          cursor: grab;
          transition: opacity 400ms ease-out;
        }
        .lanyard-canvas:active {
          cursor: grabbing;
        }
        .lanyard-canvas.is-ready {
          opacity: 1;
        }
        .vt-attached-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 25;
        }
        .vt-attached-anchor {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          will-change: transform;
          pointer-events: none !important;
        }
        .vt-pin-pill {
          position: absolute;
          left: 0;
          top: 0;
          transform: translate(-50%, 8px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          height: 28px;
          padding: 0 13px;
          border-radius: 9999px;
          background: rgba(14, 8, 10, 0.85);
          border: 1px solid rgba(255, 65, 75, 0.35);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(255, 30, 45, 0.2);
          pointer-events: auto !important;
          cursor: pointer;
          transition: all 250ms ease;
        }
        .vt-pin-pill:hover {
          border-color: rgba(255, 90, 100, 0.65);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(255, 30, 45, 0.35);
        }
        .vt-pin-pill.is-success {
          border-color: rgba(52, 211, 153, 0.9);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 20px rgba(52, 211, 153, 0.5);
        }
        .vt-pin-pill.is-error {
          animation: vtPinShake 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
          border-color: rgba(255, 30, 45, 1);
        }
        @keyframes vtPinShake {
          10%, 90% { transform: translate(calc(-50% - 3px), 8px); }
          20%, 80% { transform: translate(calc(-50% + 4px), 8px); }
          30%, 50%, 70% { transform: translate(calc(-50% - 5px), 8px); }
          40%, 60% { transform: translate(calc(-50% + 5px), 8px); }
        }
        .vt-led-cluster {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .vt-led-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 120, 130, 0.4);
          transition: all 200ms ease;
        }
        .vt-led-dot.is-active {
          background: #ff2d3d;
          border-color: #ff808b;
          box-shadow: 0 0 8px #ff2234, 0 0 14px rgba(255, 34, 52, 0.6);
          transform: scale(1.2);
        }
        .vt-pin-pill.is-success .vt-led-dot {
          background: #34d399;
          border-color: #a7f3d0;
          box-shadow: 0 0 8px #34d399, 0 0 14px rgba(52, 211, 153, 0.6);
        }
        .vt-hidden-pin-input {
          position: absolute;
          inset: 0;
          opacity: 0.001;
          border: 0;
          outline: none;
          color: transparent;
          background: transparent;
          caret-color: transparent;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
