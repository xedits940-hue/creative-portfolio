"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const IDEAL_TEXTURE_SIZE = 2048;
const POINTER_FOLLOW = 5;
const TRAIL_TINT = 0.066;

const DEFAULTS = {
  text: "MOTION TEXT",
  color: "#FFFFFF",
  trailColor: "#ff1f3d",
  trail: 15,
  drift: 20,
  warp: 6,
  speed: 20,
  push: 6,
};

type FontValue = {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontStyle?: string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
};

type Config = {
  text: string;
  font: FontValue;
  color: string;
  trailColor: string;
  trail: number;
  drift: number;
  warp: number;
  speed: number;
  push: number;
};

function clamp(v: number, lo: number, hi: number, fallback: number): number {
  const n = typeof v === "number" && isFinite(v) ? v : fallback;
  return Math.max(lo, Math.min(hi, n));
}

function toPx(v: unknown, fallback: number, emBasis: number): number {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    if (!isFinite(n)) return fallback;
    if (v.indexOf("em") >= 0) return n * emBasis;
    if (v.indexOf("%") >= 0) return (n / 100) * emBasis;
    return n;
  }
  return fallback;
}

function toRatio(v: unknown, size: number, fallback: number): number {
  if (typeof v === "number" && isFinite(v)) return v > 4 ? v / size : v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    if (!isFinite(n)) return fallback;
    if (v.indexOf("%") >= 0) return n / 100;
    if (v.indexOf("px") >= 0) return n / Math.max(1, size);
    return n > 4 ? n / Math.max(1, size) : n;
  }
  return fallback;
}

function settingsFor(cfg: Config) {
  const persist = 0.86 + clamp(cfg.trail, 1, 20, DEFAULTS.trail) * 0.0065;
  const drift = clamp(cfg.drift, 1, 20, DEFAULTS.drift);

  return {
    persist,
    tint: TRAIL_TINT,
    noiseFactor: 0.2 + drift * drift * 0.12,
    noiseScale: clamp(cfg.warp, 1, 20, DEFAULTS.warp) * 0.0006,
    noiseSpeed: clamp(cfg.speed, 0, 20, DEFAULTS.speed) * 0.02,
    push: clamp(cfg.push, 0, 20, DEFAULTS.push) * 0.0012,
  };
}

const BASE_VERTEX = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const SIMPLEX_3D = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 xp = floor(j * ns.z);
        vec4 yp = floor(j - 7.0 * xp);

        vec4 x = xp * ns.x + ns.yyyy;
        vec4 y = yp * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
`;

const PERSISTENCE_FRAGMENT = `
    uniform sampler2D uSampler;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uNoiseFactor;
    uniform float uNoiseScale;
    uniform float uPersist;
    uniform float uPush;
    uniform vec3 uTrailColor;
    uniform float uTint;

    varying vec2 vUv;

    ${SIMPLEX_3D}

    void main() {
        float a = snoise(vec3(vUv * uNoiseFactor, uTime)) * uNoiseScale;
        float b = snoise(vec3(vUv * uNoiseFactor, uTime + 100.0)) * uNoiseScale;
        vec4 t0 = texture2D(uSampler, vUv + vec2(a, b) + uPointer * uPush);

        vec3 aged = mix(t0.rgb, uTrailColor * t0.a, uTint);

        gl_FragColor = vec4(aged, t0.a) * uPersist;
    }
`;

const TEXT_FRAGMENT = `
    uniform sampler2D uSampler;
    uniform vec3 uColor;

    varying vec2 vUv;

    void main() {
        vec4 texColor = texture2D(uSampler, vUv);
        if (texColor.a < 0.9) discard;
        gl_FragColor = vec4(uColor, 1.0);
    }
`;

const DISPLAY_FRAGMENT = `
    uniform sampler2D uSampler;
    varying vec2 vUv;
    void main() {
        gl_FragColor = texture2D(uSampler, vUv);
    }
`;

class TextTrailScene {
  private container: HTMLElement;
  private cfg: Config;
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

  private fadeScene = new THREE.Scene();
  private textScene = new THREE.Scene();
  private outScene = new THREE.Scene();

  private fadeMaterial: THREE.ShaderMaterial;
  private textMaterial: THREE.ShaderMaterial;
  private outMaterial: THREE.ShaderMaterial;
  private quadGeometry = new THREE.PlaneGeometry(2, 2);

  private targetA: THREE.WebGLRenderTarget;
  private targetB: THREE.WebGLRenderTarget;

  private maskCanvas = document.createElement("canvas");
  private maskTexture: THREE.CanvasTexture | null = null;

  private width = 1;
  private height = 1;
  private frameId = 0;
  private lastT = 0;
  private time = 0;
  private disposed = false;

  private pointer = new THREE.Vector2(0, 0);
  private targetPointer = new THREE.Vector2(0, 0);

  constructor(container: HTMLElement, cfg: Config) {
    this.container = container;
    this.cfg = cfg;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const canvas = this.renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);

    const targetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    };
    this.targetA = new THREE.WebGLRenderTarget(1, 1, targetOptions);
    this.targetB = new THREE.WebGLRenderTarget(1, 1, targetOptions);

    const S = settingsFor(cfg);

    this.fadeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSampler: { value: null },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uNoiseFactor: { value: S.noiseFactor },
        uNoiseScale: { value: S.noiseScale },
        uPersist: { value: S.persist },
        uPush: { value: S.push },
        uTrailColor: {
          value: new THREE.Color(cfg.trailColor || DEFAULTS.trailColor),
        },
        uTint: { value: S.tint },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: PERSISTENCE_FRAGMENT,
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
    });
    const fadeQuad = new THREE.Mesh(this.quadGeometry, this.fadeMaterial);
    fadeQuad.frustumCulled = false;
    this.fadeScene.add(fadeQuad);

    this.textMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSampler: { value: null },
        uColor: { value: new THREE.Vector3(1, 1, 1) },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: TEXT_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const labelMesh = new THREE.Mesh(this.quadGeometry, this.textMaterial);
    labelMesh.frustumCulled = false;
    this.textScene.add(labelMesh);

    this.outMaterial = new THREE.ShaderMaterial({
      uniforms: { uSampler: { value: null } },
      vertexShader: BASE_VERTEX,
      fragmentShader: DISPLAY_FRAGMENT,
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      depthWrite: false,
    });
    const outQuad = new THREE.Mesh(this.quadGeometry, this.outMaterial);
    outQuad.frustumCulled = false;
    this.outScene.add(outQuad);

    this.setInkColor(cfg);

    window.addEventListener("pointermove", this.onGlobalPointerMove, { passive: true });

    if (typeof document !== "undefined" && (document as unknown as { fonts?: { ready: Promise<void> } }).fonts) {
      (document as unknown as { fonts: { ready: Promise<void> } }).fonts.ready.then(() => {
        if (!this.disposed) this.drawText();
      });
    }
  }

  private setInkColor(cfg: Config) {
    const ink = new THREE.Color(cfg.color || DEFAULTS.color);
    this.textMaterial.uniforms.uColor.value.set(ink.r, ink.g, ink.b);
  }

  private onGlobalPointerMove = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.targetPointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (1 - (e.clientY - rect.top) / rect.height) * 2 - 1
    );
  };

  private drawText() {
    if (this.disposed) return;
    const ctx = this.maskCanvas.getContext("2d");
    if (!ctx) return;

    const maxSide = Math.min(
      this.renderer.capabilities.maxTextureSize,
      IDEAL_TEXTURE_SIZE
    );
    const aspect = Math.max(1, this.width) / Math.max(1, this.height);
    const texW = Math.max(
      1,
      aspect >= 1 ? maxSide : Math.round(maxSide * aspect)
    );
    const texH = Math.max(
      1,
      aspect >= 1 ? Math.round(maxSide / aspect) : maxSide
    );
    this.maskCanvas.width = texW;
    this.maskCanvas.height = texH;

    const font = this.cfg.font || {};
    const basePx = toPx(font.fontSize, 36, 36);
    const scale = texH / Math.max(1, this.height);

    const family = font.fontFamily ? font.fontFamily : "sans-serif";
    const weight = font.fontWeight ?? 600;
    const style = font.fontStyle || "normal";
    const lineRatio = toRatio(font.lineHeight, basePx, 1.25);

    const lines = String(this.cfg.text ?? "").split("\n");
    const fontPx = basePx * scale;

    const applyFont = () => {
      ctx.font = `${style} ${weight} ${fontPx}px ${family}`;
      try {
        const tracking = toPx(font.letterSpacing, 0, basePx) * scale;
        (ctx as unknown as { letterSpacing: string }).letterSpacing = `${tracking}px`;
      } catch {
        // ignore
      }
    };

    ctx.clearRect(0, 0, texW, texH);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    applyFont();

    const step = fontPx * lineRatio;
    const top = texH / 2 - ((lines.length - 1) * step) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, texW / 2, top + i * step);
    });

    this.maskTexture?.dispose();
    this.maskTexture = new THREE.CanvasTexture(this.maskCanvas);
    this.maskTexture.colorSpace = THREE.SRGBColorSpace;
    this.textMaterial.uniforms.uSampler.value = this.maskTexture;
  }

  setSize(width: number, height: number) {
    if (this.disposed) return;
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    this.width = w;
    this.height = h;

    this.renderer.setSize(w, h, false);
    const dpr = this.renderer.getPixelRatio();
    this.targetA.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
    this.targetB.setSize(Math.floor(w * dpr), Math.floor(h * dpr));

    this.drawText();
  }

  updateConfig(cfg: Config) {
    if (this.disposed) return;
    const prev = this.cfg;
    this.cfg = cfg;
    const S = settingsFor(cfg);

    const u = this.fadeMaterial.uniforms;
    u.uNoiseFactor.value = S.noiseFactor;
    u.uNoiseScale.value = S.noiseScale;
    u.uPersist.value = S.persist;
    u.uPush.value = S.push;
    u.uTint.value = S.tint;
    u.uTrailColor.value.set(cfg.trailColor || DEFAULTS.trailColor);
    this.setInkColor(cfg);

    if (
      cfg.text !== prev.text ||
      cfg.font?.fontFamily !== prev.font?.fontFamily ||
      cfg.font?.fontSize !== prev.font?.fontSize ||
      cfg.font?.fontWeight !== prev.font?.fontWeight ||
      cfg.font?.fontStyle !== prev.font?.fontStyle ||
      cfg.font?.letterSpacing !== prev.font?.letterSpacing ||
      cfg.font?.lineHeight !== prev.font?.lineHeight
    ) {
      this.drawText();
    }
  }

  start() {
    this.lastT = performance.now();
    const loop = () => {
      if (this.disposed) return;
      this.frameId = requestAnimationFrame(loop);
      this.step();
    };
    this.frameId = requestAnimationFrame(loop);
  }

  private step() {
    if (this.disposed) return;
    const now = performance.now();
    let dt = (now - this.lastT) / 1000;
    this.lastT = now;
    if (!isFinite(dt) || dt < 0) dt = 0;
    if (dt > 0.05) dt = 0.05;

    const S = settingsFor(this.cfg);
    this.time += dt * S.noiseSpeed;

    this.pointer.lerp(this.targetPointer, 1 - Math.exp(-dt * POINTER_FOLLOW));

    const u = this.fadeMaterial.uniforms;
    u.uTime.value = this.time;
    u.uPointer.value.copy(this.pointer);
    u.uSampler.value = this.targetB.texture;

    this.renderer.autoClear = false;

    this.renderer.setRenderTarget(this.targetA);
    this.renderer.clear();
    this.renderer.render(this.fadeScene, this.camera);
    this.renderer.render(this.textScene, this.camera);

    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.outMaterial.uniforms.uSampler.value = this.targetA.texture;
    this.renderer.render(this.outScene, this.camera);

    const swap = this.targetA;
    this.targetA = this.targetB;
    this.targetB = swap;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener("pointermove", this.onGlobalPointerMove);
    this.quadGeometry.dispose();
    this.fadeMaterial.dispose();
    this.textMaterial.dispose();
    this.outMaterial.dispose();
    this.maskTexture?.dispose();
    this.targetA.dispose();
    this.targetB.dispose();
    this.renderer.dispose();
    const canvas = this.renderer.domElement;
    if (canvas.parentNode === this.container) {
      this.container.removeChild(canvas);
    }
  }
}

export interface TextTrailProps {
  text?: string;
  font?: FontValue;
  color?: string;
  trailColor?: string;
  trail?: number;
  drift?: number;
  warp?: number;
  speed?: number;
  push?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TextTrail(props: TextTrailProps) {
  const {
    text = DEFAULTS.text,
    font,
    color = DEFAULTS.color,
    trailColor = DEFAULTS.trailColor,
    trail = DEFAULTS.trail,
    drift = DEFAULTS.drift,
    warp = DEFAULTS.warp,
    speed = DEFAULTS.speed,
    push = DEFAULTS.push,
    className,
    style,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<TextTrailScene | null>(null);
  const cfgRef = useRef<Config>({
    text,
    font: font || {},
    color,
    trailColor,
    trail,
    drift,
    warp,
    speed,
    push,
  });

  cfgRef.current = {
    text,
    font: font || {},
    color,
    trailColor,
    trail,
    drift,
    warp,
    speed,
    push,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scene: TextTrailScene;
    try {
      scene = new TextTrailScene(container, cfgRef.current);
    } catch {
      return;
    }
    sceneRef.current = scene;
    scene.setSize(container.clientWidth, container.clientHeight);
    scene.start();

    const ro = new ResizeObserver(() => {
      scene.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.updateConfig(cfgRef.current);
  }, [
    text,
    font?.fontFamily,
    font?.fontSize,
    font?.fontWeight,
    font?.fontStyle,
    font?.letterSpacing,
    font?.lineHeight,
    color,
    trailColor,
    trail,
    drift,
    warp,
    speed,
    push,
  ]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`The word ${text} drawn as a motion trail`}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    />
  );
}

export default TextTrail;
