"use client";

import React, {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ExternalLink, Info } from "lucide-react";
import "./card-swap.css";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const THEMES = {
  dark: {
    "--swap-tile": "linear-gradient(180deg, rgba(28, 26, 36, 0.85) 0%, rgba(13, 12, 17, 0.95) 100%)",
    "--swap-tile-edge": "rgba(255, 31, 61, 0.22)",
    "--swap-tile-highlight": "rgba(255, 255, 255, 0.14)",
    "--swap-shadow":
      "0 30px 60px -24px rgba(0, 0, 0, 0.95), 0 10px 24px -12px rgba(255, 31, 61, 0.2)",
    "--swap-media-edge": "rgba(255, 255, 255, 0.08)",
    "--swap-ink": "#f4f4f5",
    "--swap-badge": "rgba(255, 255, 255, 0.08)",
    "--swap-shade": "#09080c",
  },
  light: {
    "--swap-tile": "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
    "--swap-tile-edge": "rgba(24, 24, 27, 0.08)",
    "--swap-tile-highlight": "rgba(255, 255, 255, 1)",
    "--swap-shadow":
      "0 30px 60px -28px rgba(24, 24, 27, 0.35), 0 10px 24px -14px rgba(24, 24, 27, 0.2)",
    "--swap-media-edge": "rgba(24, 24, 27, 0.06)",
    "--swap-ink": "#27272a",
    "--swap-badge": "rgba(24, 24, 27, 0.05)",
    "--swap-shade": "#ffffff",
  },
};

export interface CardSwapItem {
  id?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  price?: string;
  priceNote?: string;
  video?: string;
  image?: string;
  alt?: string;
  url?: string;
  description?: string;
  features?: string[];
}

const PERSPECTIVE = 900;
const TAU = Math.PI * 2;
const STEP = 1 / 240;
const PAD = 32;
const AXES = ["x", "y", "z", "r", "p"] as const;
const DOWN = { x: 0, y: 1 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface StackBoundsParams {
  width: number;
  height: number;
  cardDistance: number;
  verticalDistance: number;
  depth: number;
  skewAmount: number;
  visible: number;
  hoverSpread: number;
}

interface StackBoundsResult {
  width: number;
  height: number;
  originX: number;
  originY: number;
}

const stackBounds = ({
  width,
  height,
  cardDistance,
  verticalDistance,
  depth,
  skewAmount,
  visible,
  hoverSpread,
}: StackBoundsParams): StackBoundsResult => {
  const slope = Math.tan((skewAmount * Math.PI) / 180);
  const spread = 1 + Math.max(0, hoverSpread);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < visible; i++) {
    const scale = PERSPECTIVE / (PERSPECTIVE + i * depth);
    for (const u of [-width / 2, width / 2]) {
      for (const v of [-height / 2, height / 2]) {
        const x = (i * cardDistance * spread + u) * scale;
        const y = (-i * verticalDistance * spread + v + u * slope) * scale;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return {
    width: Math.ceil(maxX - minX + PAD * 2),
    height: Math.ceil(maxY - minY + PAD * 2),
    originX: PAD - minX,
    originY: PAD - minY,
  };
};

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { customClass?: string }
>(({ customClass, className, children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={["card-swap-card", customClass, className]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
    <span className="card-swap-card-rim" aria-hidden="true" />
  </div>
));
Card.displayName = "Card";

export const ItemCard = ({
  item,
  isActive = false,
  onOpenDetails,
}: {
  item: CardSwapItem;
  isActive?: boolean;
  onOpenDetails?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Strictly enforce muted and playsInline
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.playsInline = true;
    }
  }, []);

  // Performance Optimization: Only play video when this card is in the front/active slot!
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled if browser blocks autoplay until user interacts
        });
      }
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <Card>
      <div className="card-swap-item">
        {/* Card Header Bar */}
        <div className="card-swap-head">
          <div className="card-swap-title-wrap">
            <span className="card-swap-title">{item.title}</span>
            {item.subtitle && (
              <span className="card-swap-subtitle">{item.subtitle}</span>
            )}
          </div>

          {/* Pricing Highlight Block */}
          {item.price && (
            <div className="card-swap-price-block">
              <span className="card-swap-price">{item.price}</span>
              <span className="card-swap-price-tag">
                {item.priceNote || "ONE-TIME ASKING PRICE"}
              </span>
            </div>
          )}
        </div>

        {/* Card Visual Media Frame */}
        <div className="card-swap-media" onClick={onOpenDetails}>
          {item.video ? (
            <video
              ref={videoRef}
              src={item.video}
              autoPlay={isActive}
              loop
              muted
              playsInline
              preload="metadata"
              controls={false}
              className="w-full h-full object-cover"
              aria-label={item.title}
            />
          ) : item.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.image}
              alt={item.alt ?? item.title ?? ""}
              draggable={false}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        {/* Card Footer Bar with Interactive Action Buttons */}
        <div className="card-swap-foot">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="card-swap-btn"
            title="Inspect specs and purchase details"
          >
            <Info className="size-3 text-primary shrink-0" />
            <span>Details</span>
          </button>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="card-swap-btn card-swap-btn-primary"
              title={`Launch ${item.title} live app`}
            >
              <span>Live Preview</span>
              <ExternalLink className="size-3 text-primary shrink-0" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export interface CardSwapProps {
  items?: CardSwapItem[];
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  depth?: number;
  skewAmount?: number;
  visibleCards?: number;
  delay?: number;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  speed?: number;
  bounce?: number;
  parallax?: number;
  hoverSpread?: number;
  dim?: number;
  cardRadius?: number;
  intro?: boolean;
  theme?: "dark" | "light";
  onCardClick?: (index: number) => void;
  onChange?: (index: number) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
  getActiveIndex: () => number;
}

interface Settings {
  width: number;
  height: number;
  dx: number;
  dy: number;
  dz: number;
  skew: number;
  visible: number;
  delay: number;
  autoplay: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  speed: number;
  bounce: number;
  parallax: number;
  hoverSpread: number;
  dim: number;
  bounds: StackBoundsResult;
  onCardClick?: (index: number) => void;
  onChange?: (index: number) => void;
}

interface CardDeckItem {
  el: HTMLElement | null;
  shade: HTMLElement | null;
  index: number;
  pos: number;
  from: number;
  hold: number;
  nudge: number;
  phase: string;
  dir: { x: number; y: number };
  tilt: number;
  top: number;
  under: boolean;
  x: number;
  y: number;
  z: number;
  r: number;
  p: number;
  v: { x: number; y: number; z: number; r: number; p: number };
}

interface DragState {
  id: number;
  index: number;
  startX: number;
  startY: number;
  active: boolean;
  samples: { x: number; y: number; t: number }[];
}

interface ShiftOptions {
  dir?: { x: number; y: number };
  tilt?: number;
  velocity?: { x: number; y: number };
}

interface TargetAxes {
  x: number;
  y: number;
  z: number;
  r: number;
  p: number;
}

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(
  (
    {
      items = [],
      width = 400,
      height = 510,
      cardDistance = 55,
      verticalDistance = 65,
      depth = 85,
      skewAmount = 5,
      visibleCards = 4,
      delay = 4500,
      autoplay = false, // Manual movement by default as explicitly requested!
      pauseOnHover = true,
      draggable = true,
      speed = 1,
      bounce = 0.35,
      parallax = 0.45,
      hoverSpread = 0.12,
      dim = 0.55,
      cardRadius = 20,
      intro = true,
      theme = "dark",
      onCardClick,
      onChange,
      className = "",
      children,
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [frontIndex, setFrontIndex] = useState<number>(0);
    const apiRef = useRef<{
      next: () => void;
      prev: () => void;
      refresh: () => void;
      getActiveIndex: () => number;
    } | null>(null);
    const settingsRef = useRef<Settings | null>(null);

    const cards = useMemo(() => {
      const custom = Children.toArray(children).filter(isValidElement);
      if (custom.length) return custom;
      return items.map((item, index) => (
        <ItemCard
          key={`${item.title ?? "card"}-${index}`}
          item={item}
          isActive={index === frontIndex}
          onOpenDetails={() => onCardClick?.(index)}
        />
      ));
    }, [children, items, frontIndex, onCardClick]);

    const count = cards.length;
    const cardWidth = Math.max(40, Number(width) || 400);
    const cardHeight = Math.max(40, Number(height) || 510);
    const visible = clamp(Math.round(visibleCards), 1, Math.max(1, count));

    const bounds = useMemo(
      () =>
        stackBounds({
          width: cardWidth,
          height: cardHeight,
          cardDistance,
          verticalDistance,
          depth: Math.max(0, depth),
          skewAmount,
          visible,
          hoverSpread,
        }),
      [
        cardWidth,
        cardHeight,
        cardDistance,
        verticalDistance,
        depth,
        skewAmount,
        visible,
        hoverSpread,
      ]
    );

    settingsRef.current = {
      width: cardWidth,
      height: cardHeight,
      dx: cardDistance,
      dy: verticalDistance,
      dz: Math.max(0, depth),
      skew: skewAmount,
      visible,
      delay,
      autoplay,
      pauseOnHover,
      draggable,
      speed: clamp(speed, 0.1, 4),
      bounce: clamp(bounce, 0, 1),
      parallax: clamp(parallax, 0, 1),
      hoverSpread: Math.max(0, hoverSpread),
      dim: clamp(dim, 0, 1),
      bounds,
      onCardClick,
      onChange,
    };

    useImperativeHandle(
      ref,
      () => ({
        next: () => apiRef.current?.next(),
        prev: () => apiRef.current?.prev(),
        getActiveIndex: () => apiRef.current?.getActiveIndex() ?? frontIndex,
      }),
      [frontIndex]
    );

    useIsomorphicLayoutEffect(() => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage || !count) return undefined;
      const reduce =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
      const now = performance.now();
      const s0 = settingsRef.current;
      if (!s0) return undefined;

      const deck: CardDeckItem[] = Array.from({ length: count }, (_, index) => ({
        el: slotRefs.current[index] || null,
        shade: shadeRefs.current[index] || null,
        index,
        pos: index,
        from: index,
        hold: 0,
        nudge: 0,
        phase: "rest",
        dir: { x: 0, y: 1 },
        tilt: 0,
        top: 0,
        under: false,
        x: 0,
        y: 0,
        z: 0,
        r: 0,
        p: 0,
        v: { x: 0, y: 0, z: 0, r: 0, p: 0 },
      }));

      interface InnerState {
        order: number[];
        raf: number;
        last: number;
        timer: number;
        queue: number[];
        layers: number;
        scale: number;
        hovered: boolean;
        overCard: boolean;
        inView: boolean;
        drag: DragState | null;
        spread: number;
        spreadV: number;
        px: number;
        py: number;
        pvx: number;
        pvy: number;
        tx: number;
        ty: number;
        dragged: boolean;
        autoplay: boolean;
        delay: number;
      }

      const state: InnerState = {
        order: deck.map((card) => card.index),
        raf: 0,
        last: 0,
        timer: 0,
        queue: [],
        layers: 0,
        scale: 1,
        hovered: false,
        overCard: false,
        inView: true,
        drag: null,
        spread: 0,
        spreadV: 0,
        px: 0,
        py: 0,
        pvx: 0,
        pvy: 0,
        tx: 0,
        ty: 0,
        dragged: false,
        autoplay: s0.autoplay,
        delay: s0.delay,
      };

      const slot = (position: number, s: Settings): TargetAxes => {
        const q = Math.min(position, s.visible);
        const spread = 1 + state.spread;
        return {
          x: q * s.dx * spread,
          y: -q * s.dy * spread,
          z: -q * s.dz,
          r: 0,
          p: q,
        };
      };

      const clearance = (s: Settings, dir: { x: number; y: number }) =>
        Math.abs(dir.x) * s.width + Math.abs(dir.y) * s.height + 12;

      const targetOf = (card: CardDeckItem, s: Settings, time: number): TargetAxes => {
        if (card.phase === "exit") {
          const base = slot(0, s);
          const reach = clearance(s, card.dir) * 1.3;
          return {
            x: base.x + card.dir.x * reach,
            y: base.y + card.dir.y * reach,
            z: base.z,
            r: card.tilt,
            p: 0,
          };
        }
        if (card.phase === "enter") {
          const base = slot(0, s);
          return {
            x: base.x,
            y: base.y + clearance(s, DOWN) * 1.3,
            z: base.z,
            r: 0,
            p: card.p,
          };
        }
        const position = (time < card.hold ? card.from : card.pos) + card.nudge;
        return slot(Math.max(0, position), s);
      };

      const layerOf = (card: CardDeckItem) => {
        if (card.top) return 1000 + card.top;
        if (card.under) return 1;
        return 10 + (count - card.pos) * 2;
      };

      const write = (card: CardDeckItem, s: Settings) => {
        const { el, shade } = card;
        if (!el) return;
        el.style.transform = `translate3d(${card.x.toFixed(2)}px, ${card.y.toFixed(2)}px, ${card.z.toFixed(2)}px) rotate(${card.r.toFixed(3)}deg) skewY(${s.skew}deg)`;
        el.style.zIndex = String(layerOf(card));
        const fade = clamp(s.visible - card.p, 0, 1);
        el.style.opacity = fade < 1 ? fade.toFixed(3) : "";
        el.style.visibility = fade <= 0.001 ? "hidden" : "";
        if (shade) {
          const depthT = clamp(card.p / Math.max(1, s.visible - 1), 0, 1);
          shade.style.opacity = (s.dim * 0.62 * depthT).toFixed(3);
        }
        el.style.cursor =
          card.phase === "drag"
            ? "grabbing"
            : card.pos > 0
              ? "pointer"
              : s.draggable
                ? "grab"
                : "";
        if (card.pos === 0) el.setAttribute("data-front", "");
        else el.removeAttribute("data-front");
      };

      const writeStage = (s: Settings) => {
        const ox = s.bounds.originX + state.px;
        const oy = s.bounds.originY + state.py;
        stage.style.perspectiveOrigin = `${ox.toFixed(2)}px ${oy.toFixed(2)}px`;
      };

      const integrate = (
        card: CardDeckItem,
        target: TargetAxes,
        omega: number,
        zeta: number,
        dt: number
      ) => {
        const k = omega * omega;
        const d = 2 * zeta * omega;
        const steps = Math.max(1, Math.ceil(dt / STEP));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          for (const axis of AXES) {
            const velocity =
              card.v[axis] + (k * (target[axis] - card[axis]) - d * card.v[axis]) * h;
            card.v[axis] = velocity;
            card[axis] += velocity * h;
          }
        }
      };

      const scalar = (
        value: number,
        velocity: number,
        target: number,
        omega: number,
        zeta: number,
        dt: number
      ): [number, number] => {
        const k = omega * omega;
        const d = 2 * zeta * omega;
        const steps = Math.max(1, Math.ceil(dt / STEP));
        const h = dt / steps;
        let x = value;
        let v = velocity;
        for (let i = 0; i < steps; i++) {
          v += (k * (target - x) - d * v) * h;
          x += v * h;
        }
        return [x, v];
      };

      const frame = (time: number) => {
        state.raf = 0;
        const s = settingsRef.current;
        if (!s) return;
        const dt = state.last ? Math.min(0.05, (time - state.last) / 1000) : 1 / 60;
        state.last = time;
        const speed = s.speed;
        const restOmega = TAU * 1.7 * speed;
        const restZeta = reduce ? 1 : 1 - 0.72 * s.bounce;
        const exitOmega = TAU * 1.9 * speed;
        let busy = false;

        const spreadTarget = state.hovered && !reduce ? s.hoverSpread : 0;
        [state.spread, state.spreadV] = scalar(
          state.spread,
          state.spreadV,
          spreadTarget,
          TAU * 1.4,
          0.9,
          dt
        );
        [state.px, state.pvx] = scalar(
          state.px,
          state.pvx,
          reduce ? 0 : state.tx,
          TAU * 1.1,
          1,
          dt
        );
        [state.py, state.pvy] = scalar(
          state.py,
          state.pvy,
          reduce ? 0 : state.ty,
          TAU * 1.1,
          1,
          dt
        );
        if (
          Math.abs(state.spread - spreadTarget) > 0.0005 ||
          Math.abs(state.spreadV) > 0.0005 ||
          Math.abs(state.px - state.tx) > 0.05 ||
          Math.abs(state.py - state.ty) > 0.05 ||
          Math.abs(state.pvx) + Math.abs(state.pvy) > 0.05
        ) {
          busy = true;
        }
        writeStage(s);

        for (const card of deck) {
          if (card.phase === "drag") {
            busy = true;
            write(card, s);
            continue;
          }
          const target = targetOf(card, s, time);
          const moving = card.phase === "exit" || card.phase === "enter";
          integrate(
            card,
            target,
            moving ? exitOmega : restOmega,
            moving ? 1 : restZeta,
            dt
          );
          if (card.phase === "exit") {
            const base = slot(0, s);
            const travelled =
              (card.x - base.x) * card.dir.x + (card.y - base.y) * card.dir.y;
            if (travelled >= clearance(s, card.dir)) {
              card.phase = "rest";
              card.top = 0;
              card.hold = 0;
            }
          } else if (card.phase === "enter") {
            const base = slot(0, s);
            if (card.y - base.y >= clearance(s, DOWN)) {
              card.phase = "rest";
              card.under = false;
              card.hold = 0;
            }
          }
          if (card.hold > time || card.phase !== "rest") busy = true;
          for (const axis of AXES) {
            const limit = axis === "p" ? 0.001 : 0.02;
            if (
              Math.abs(target[axis] - card[axis]) > limit ||
              Math.abs(card.v[axis]) > limit
            )
              busy = true;
          }
          write(card, s);
        }

        if (busy) {
          state.raf = requestAnimationFrame(frame);
        } else {
          state.last = 0;
          for (const card of deck) {
            if (card.top && card.phase === "rest") card.top = 0;
          }
        }
      };

      const wake = () => {
        if (!state.raf) state.raf = requestAnimationFrame(frame);
      };

      const paused = () => {
        const s = settingsRef.current;
        if (!s) return true;
        return (
          !s.autoplay ||
          count < 2 ||
          (s.pauseOnHover && state.overCard) ||
          state.drag ||
          !state.inView ||
          document.visibilityState === "hidden"
        );
      };

      const schedule = () => {
        clearTimeout(state.timer);
        state.timer = 0;
        if (paused()) return;
        state.timer = window.setTimeout(
          () => {
            state.timer = 0;
            shift(1);
          },
          Math.max(400, settingsRef.current?.delay || 4000)
        );
      };

      const settleOrder = (time: number, stagger: number) => {
        state.order.forEach((index: number, position: number) => {
          const card = deck[index];
          if (card.pos === position) return;
          card.from = card.pos;
          card.pos = position;
          card.hold = time + Math.max(0, position) * stagger;
        });
      };

      const shift = (direction: number, options: ShiftOptions = {}) => {
        if (count < 2) return;
        const s = settingsRef.current;
        if (!s) return;
        const time = performance.now();
        const stagger = 0.05 / s.speed;
        if (direction > 0) {
          const front = deck[state.order[0]];
          state.order = [...state.order.slice(1), front.index];
          settleOrder(time, stagger * 1000);
          front.phase = "exit";
          front.dir = options.dir ?? DOWN;
          front.tilt = options.tilt ?? 0;
          front.top = ++state.layers;
          front.under = false;
          front.nudge = 0;
          front.hold = 0;
          if (options.velocity) {
            front.v.x = options.velocity.x;
            front.v.y = options.velocity.y;
          }
        } else {
          const back = deck[state.order[count - 1]];
          state.order = [back.index, ...state.order.slice(0, count - 1)];
          settleOrder(time, stagger * 1000);
          back.phase = "enter";
          back.top = 0;
          back.under = true;
          back.nudge = 0;
          back.hold = 0;
        }
        deck.forEach((card) => {
          if (card.phase === "rest") card.nudge = 0;
        });
        const newFront = state.order[0];
        setFrontIndex(newFront);
        s.onChange?.(newFront);
        wake();
        schedule();
      };

      const goTo = (position: number) => {
        state.queue.forEach(clearTimeout);
        state.queue = [];
        const gap = 110 / (settingsRef.current?.speed || 1);
        for (let i = 0; i < position; i++) {
          state.queue.push(window.setTimeout(() => shift(1), i * gap));
        }
      };

      const fit = () => {
        const s = settingsRef.current;
        if (!s) return;
        const w = root.clientWidth;
        const h = root.clientHeight;
        const scale = Math.min(
          1,
          w / s.bounds.width,
          h > 0 ? h / s.bounds.height : 1
        );
        state.scale = scale > 0 ? scale : 1;
        stage.style.transform = `translate(-50%, -50%) scale(${state.scale.toFixed(4)})`;
      };

      const local = (event: PointerEvent) => {
        const box = root.getBoundingClientRect();
        return {
          x: event.clientX - box.left,
          y: event.clientY - box.top,
          w: box.width,
          h: box.height,
        };
      };

      const onMove = (event: PointerEvent) => {
        const s = settingsRef.current;
        if (!s) return;
        if (event.pointerType !== "touch") {
          const point = local(event);
          const nx = clamp((point.x / Math.max(1, point.w)) * 2 - 1, -1, 1);
          const ny = clamp((point.y / Math.max(1, point.h)) * 2 - 1, -1, 1);
          state.tx = nx * s.parallax * 0.35 * s.bounds.width;
          state.ty = ny * s.parallax * 0.35 * s.bounds.height;
          state.hovered = true;
          const overCard = Boolean(
            (event.target as HTMLElement | null)?.closest?.("[data-swap-index]")
          );
          if (overCard !== state.overCard) {
            state.overCard = overCard;
            schedule();
          }
          wake();
        }
        const drag = state.drag;
        if (!drag || drag.id !== event.pointerId) return;
        const dx = (event.clientX - drag.startX) / state.scale;
        const dy = (event.clientY - drag.startY) / state.scale;
        if (!drag.active) {
          if (Math.hypot(dx, dy) < 5) return;
          drag.active = true;
          state.dragged = true;
          const card = deck[drag.index];
          card.phase = "drag";
          card.v = { x: 0, y: 0, z: 0, r: 0, p: 0 };
          root.setPointerCapture?.(event.pointerId);
          root.style.cursor = "grabbing";
        }
        const card = deck[drag.index];
        const base = slot(0, s);
        card.x = base.x + dx;
        card.y = base.y + dy;
        card.z = base.z;
        card.r = clamp(dx * 0.035, -9, 9);
        card.p = 0;
        const time = performance.now();
        drag.samples.push({ x: card.x, y: card.y, t: time });
        while (drag.samples.length > 2 && time - drag.samples[0].t > 90)
          drag.samples.shift();
        const progress = clamp(
          Math.hypot(dx, dy) / (Math.min(s.width, s.height) * 0.3),
          0,
          1
        );
        const next = deck[state.order[1]];
        if (next && next.phase === "rest") next.nudge = -0.22 * progress;
        wake();
      };

      const onLeave = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        if (state.drag?.active) return;
        state.hovered = false;
        state.overCard = false;
        state.tx = 0;
        state.ty = 0;
        schedule();
        wake();
      };

      const onDown = (event: PointerEvent) => {
        const s = settingsRef.current;
        if (!s) return;
        state.dragged = false;
        if (!s.draggable || event.button > 0 || count < 2) return;
        const target = (event.target as HTMLElement | null)?.closest?.("[data-swap-index]");
        if (!target || !root.contains(target)) return;
        const index = Number(target.getAttribute("data-swap-index"));
        if (index !== state.order[0] || deck[index].phase !== "rest") return;
        state.drag = {
          id: event.pointerId,
          index,
          startX: event.clientX,
          startY: event.clientY,
          active: false,
          samples: [],
        };
        schedule();
      };

      const onUp = (event: PointerEvent) => {
        const drag = state.drag;
        if (!drag || drag.id !== event.pointerId) return;
        state.drag = null;
        root.style.cursor = "";
        if (!drag.active) {
          schedule();
          return;
        }
        root.releasePointerCapture?.(event.pointerId);
        const s = settingsRef.current;
        if (!s) return;
        const card = deck[drag.index];
        const base = slot(0, s);
        const first = drag.samples[0];
        const lastSample = drag.samples[drag.samples.length - 1];
        const span =
          first && lastSample ? Math.max(0.016, (lastSample.t - first.t) / 1000) : 1;
        const velocity =
          first && lastSample && lastSample !== first
            ? {
                x: (lastSample.x - first.x) / span,
                y: (lastSample.y - first.y) / span,
              }
            : { x: 0, y: 0 };
        const offset = { x: card.x - base.x, y: card.y - base.y };
        const distance = Math.hypot(offset.x, offset.y);
        const fling = Math.hypot(velocity.x, velocity.y);
        const next = deck[state.order[1]];
        if (next) next.nudge = 0;
        if (
          event.type !== "pointercancel" &&
          (distance > Math.min(s.width, s.height) * 0.3 || fling > 700)
        ) {
          const aim = {
            x: offset.x + velocity.x * 0.12,
            y: offset.y + velocity.y * 0.12,
          };
          const length = Math.hypot(aim.x, aim.y) || 1;
          card.phase = "rest";
          shift(1, {
            dir: { x: aim.x / length, y: aim.y / length },
            tilt: card.r,
            velocity,
          });
        } else {
          card.phase = "rest";
          card.v.x = velocity.x;
          card.v.y = velocity.y;
          wake();
          schedule();
        }
      };

      const onClick = (event: MouseEvent) => {
        if (state.dragged) {
          state.dragged = false;
          return;
        }
        const target = (event.target as HTMLElement | null)?.closest?.("[data-swap-index]");
        if (!target || !root.contains(target)) return;
        const index = Number(target.getAttribute("data-swap-index"));
        settingsRef.current?.onCardClick?.(index);
        const position = state.order.indexOf(index);
        if (position > 0) goTo(position);
      };

      const onVisibility = () => schedule();

      apiRef.current = {
        next: () => shift(1),
        prev: () => shift(-1),
        getActiveIndex: () => state.order[0] ?? 0,
        refresh: () => {
          const s = settingsRef.current;
          if (!s) return;
          deck.forEach((card) => {
            const el = slotRefs.current[card.index];
            const shade = shadeRefs.current[card.index];
            if (el === card.el && shade === card.shade) return;
            card.el = el;
            card.shade = shade;
            write(card, s);
          });
          if (s.autoplay !== state.autoplay || s.delay !== state.delay) {
            state.autoplay = s.autoplay;
            state.delay = s.delay;
            schedule();
          }
          fit();
          wake();
        },
      };

      if (intro && !reduce) {
        deck.forEach((card) => {
          card.from = 0;
          card.hold = now + (card.pos * 70) / s0.speed;
        });
        stage.animate?.([{ opacity: 0 }, { opacity: 1 }], {
          duration: 420,
          easing: "ease-out",
        });
      } else {
        deck.forEach((card) => {
          Object.assign(card, slot(card.pos, s0));
        });
      }
      fit();
      writeStage(s0);
      deck.forEach((card) => write(card, s0));
      wake();

      const resizeObserver = new ResizeObserver(fit);
      resizeObserver.observe(root);
      const intersectionObserver = new IntersectionObserver((entries) => {
        state.inView = entries[entries.length - 1]?.isIntersecting ?? true;
        schedule();
      });
      intersectionObserver.observe(root);

      const handlePointerMove = (e: Event) => onMove(e as PointerEvent);
      const handlePointerLeave = (e: Event) => onLeave(e as PointerEvent);
      const handlePointerDown = (e: Event) => onDown(e as PointerEvent);
      const handlePointerUp = (e: Event) => onUp(e as PointerEvent);

      root.addEventListener("pointermove", handlePointerMove);
      root.addEventListener("pointerleave", handlePointerLeave);
      root.addEventListener("pointerdown", handlePointerDown);
      root.addEventListener("pointerup", handlePointerUp);
      root.addEventListener("pointercancel", handlePointerUp);
      root.addEventListener("click", onClick);
      document.addEventListener("visibilitychange", onVisibility);
      schedule();

      return () => {
        cancelAnimationFrame(state.raf);
        clearTimeout(state.timer);
        state.queue.forEach(clearTimeout);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        root.removeEventListener("pointermove", handlePointerMove);
        root.removeEventListener("pointerleave", handlePointerLeave);
        root.removeEventListener("pointerdown", handlePointerDown);
        root.removeEventListener("pointerup", handlePointerUp);
        root.removeEventListener("pointercancel", handlePointerUp);
        root.removeEventListener("click", onClick);
        document.removeEventListener("visibilitychange", onVisibility);
        apiRef.current = null;
      };
    }, [count]);

    useIsomorphicLayoutEffect(() => {
      apiRef.current?.refresh();
    });

    const onKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        apiRef.current?.next();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        apiRef.current?.prev();
      }
    };

    const rootStyle: React.CSSProperties = {
      ...((THEMES[theme] ?? THEMES.dark) as React.CSSProperties),
      ["--swap-w" as string]: `${cardWidth}px`,
      ["--swap-h" as string]: `${cardHeight}px`,
      ["--swap-ox" as string]: `${bounds.originX}px`,
      ["--swap-oy" as string]: `${bounds.originY}px`,
      ["--swap-stage-w" as string]: `${bounds.width}px`,
      ["--swap-stage-h" as string]: `${bounds.height}px`,
      ["--swap-ratio" as string]: `${bounds.width} / ${bounds.height}`,
      ["--swap-radius" as string]: `${Math.max(0, cardRadius)}px`,
    };

    return (
      <div
        ref={rootRef}
        className={`card-swap${className ? ` ${className}` : ""}`}
        style={rootStyle}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Card stack"
        onKeyDown={onKeyDown}
      >
        <div className="card-swap-sizer" aria-hidden="true">
          <span />
        </div>
        <div ref={stageRef} className="card-swap-stage">
          {cards.map((card, index) => (
            <div
              key={index}
              ref={(node) => {
                slotRefs.current[index] = node;
              }}
              className="card-swap-slot"
              data-swap-index={index}
            >
              {card}
              <span
                ref={(node) => {
                  shadeRefs.current[index] = node;
                }}
                className="card-swap-shade"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);
CardSwap.displayName = "CardSwap";

export default CardSwap;
