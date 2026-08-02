import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import './LiquidGlassButton.css';

export type LiquidGlassShape = 'blob' | 'pill';

export interface LiquidGlassButtonProps {
  /** Button text / content (preferred). */
  children?: ReactNode;
  /** Alternative to children if you'd rather pass a string prop. */
  label?: ReactNode;
  onClick?: () => void;
  /** Outline: an organic squircle "blob" or a long rounded "pill". */
  shape?: LiquidGlassShape;
  /** For `blob`: the diameter. For `pill`: the height. Fonts/strokes scale from this. */
  size?: number;
  /** `pill` only: the width. Accepts px or CSS widths like `100%`. Ignored for `blob`. */
  width?: CSSProperties['width'];
  /** Slowly rotate the blob so its edges "wobble" like liquid. (Blob only.) */
  rotate?: boolean;
  /** Blob rotation speed in degrees per second. */
  rotateSpeed?: number;
  /** `pill` only: undulate the outline like water (never touches the label). */
  wobble?: boolean;
  /** Wobble amplitude as a fraction of the height. */
  wobbleAmount?: number;
  /** Wobble speed. */
  wobbleSpeed?: number;
  /** Backdrop blur behind the glass, in px. */
  blur?: number;
  /** Refraction strength — displacement scale as a multiple of the short side. */
  refraction?: number;
  /** White frosting opacity, 0–1. */
  tint?: number;
  /** Solid tint colour. When set, the button becomes a coloured glossy pill
   *  (with a drop shadow) instead of clear glass. Any CSS colour works. */
  color?: string;
  /** Show the glossy top sheen (defaults on when `color` is set). */
  gloss?: boolean;
  /** Cast a soft drop shadow (defaults on when `color` is set). */
  shadow?: boolean;
  /** Show the specular rim highlight. */
  specular?: boolean;
  /** Emit a water-ripple on click. */
  ripple?: boolean;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  'aria-label'?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Normalised "squircle" (superellipse) outline in a 0..1 box. The control
 * points slightly overshoot the box, which gives the soft organic bulge.
 */
const SQUIRCLE =
  'M 0.2662 0.1259 C 0.4341 -0.0420 0.7062 -0.0420 0.8741 0.1259 ' +
  'C 1.0420 0.2938 1.0420 0.5660 0.8741 0.7338 L 0.7338 0.8741 ' +
  'C 0.5660 1.0420 0.2938 1.0420 0.1259 0.8741 ' +
  'C -0.0420 0.7062 -0.0420 0.4341 0.1259 0.2662 L 0.2662 0.1259 Z';

/** Multiply every number in a path string by `s`. */
const scalePath = (path: string, s: number) =>
  path.replace(/-?\d*\.?\d+/g, (n) => (parseFloat(n) * s).toFixed(4));

/** Static outline in pixel/user-space coords (0..w, 0..h). */
function outlinePath(w: number, h: number, shape: LiquidGlassShape): string {
  if (shape === 'pill') {
    const r = h / 2;
    return (
      `M ${r} 0 L ${w - r} 0 A ${r} ${r} 0 0 1 ${w - r} ${h} ` +
      `L ${r} ${h} A ${r} ${r} 0 0 1 ${r} 0 Z`
    );
  }
  return scalePath(SQUIRCLE, w);
}

/** A point on the capsule perimeter and its outward normal, at arc-length `s`. */
function capsuleAt(s: number, w: number, h: number) {
  const r = h / 2;
  const straight = Math.max(0, w - h);
  const cap = Math.PI * r;
  if (s < straight) {
    return { x: r + s, y: 0, nx: 0, ny: -1 }; // top edge
  }
  s -= straight;
  if (s < cap) {
    const a = -Math.PI / 2 + (s / cap) * Math.PI; // right cap: top → bottom
    return { x: w - r + r * Math.cos(a), y: r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
  }
  s -= cap;
  if (s < straight) {
    return { x: w - r - s, y: h, nx: 0, ny: 1 }; // bottom edge
  }
  s -= straight;
  const a = Math.PI / 2 + (s / cap) * Math.PI; // left cap: bottom → top
  return { x: r + r * Math.cos(a), y: r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
}

/** A capsule whose edge undulates like water — sampled points → smooth loop. */
function wobblePath(w: number, h: number, t: number, amp: number, speed: number): string {
  const r = h / 2;
  const straight = Math.max(0, w - h);
  const perim = 2 * straight + 2 * Math.PI * r;
  const N = 72;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const s = (perim * i) / N;
    const p = capsuleAt(s, w, h);
    const u = (s / perim) * Math.PI * 2;
    // two travelling waves for an organic, non-repeating look
    const off = amp * (Math.sin(u * 3 + t * speed) + 0.5 * Math.sin(u * 5 - t * speed * 0.73));
    pts.push({ x: p.x + p.nx * off, y: p.y + p.ny * off });
  }
  // Catmull-Rom → cubic bézier, closed loop
  const n = pts.length;
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }
  return d + 'Z';
}

/** Fixed internal height for the depth/inner-shadow SVG (keeps blur radii constant). */
const DECO_RES = 380;

/**
 * The displacement map: a red horizontal gradient (X-refraction) + a green
 * vertical gradient (Y-refraction), with a neutral-grey blurred copy of the
 * outline on top so displacement only happens at the soft rim — the way light
 * bends at the curved edge of a glass lens.
 */
function buildDisplacementDataUri(
  w: number,
  h: number,
  pad: number,
  shape: LiquidGlassShape,
): string {
  const fw = w + pad * 2;
  const fh = h + pad * 2;
  const edge = (Math.min(w, h) * 0.03).toFixed(2);
  const path = outlinePath(w, h, shape);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${fw}" height="${fh}" ` +
    `viewBox="${-pad} ${-pad} ${fw} ${fh}" preserveAspectRatio="none">` +
    `<defs>` +
    `<linearGradient id="gx" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w}" y2="0">` +
    `<stop offset="0%" stop-color="#F00"/><stop offset="100%" stop-color="#000"/></linearGradient>` +
    `<linearGradient id="gy" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${h}">` +
    `<stop offset="0%" stop-color="#0F0"/><stop offset="100%" stop-color="#000"/></linearGradient>` +
    `<filter id="eb"><feGaussianBlur stdDeviation="${edge}"/></filter>` +
    `</defs>` +
    `<rect x="${-pad}" y="${-pad}" width="${fw}" height="${fh}" fill="url(#gx)"/>` +
    `<rect x="${-pad}" y="${-pad}" width="${fw}" height="${fh}" fill="url(#gy)" style="mix-blend-mode:screen"/>` +
    `<path d="${path}" fill="rgb(50%,50%,50%)" filter="url(#eb)"/>` +
    `</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export function LiquidGlassButton({
  children,
  label,
  onClick,
  shape = 'blob',
  size = 180,
  width,
  rotate = true,
  rotateSpeed = 12,
  wobble = true,
  wobbleAmount = 0.045,
  wobbleSpeed = 1.1,
  blur = 12,
  refraction = 2.5,
  tint = 0.12,
  color,
  gloss,
  shadow,
  specular = true,
  ripple = true,
  className,
  style,
  disabled = false,
  ...rest
}: LiquidGlassButtonProps) {
  // Unique, collision-free ids so multiple buttons can coexist on one page.
  const uid = useId().replace(/:/g, '');
  const filterId = `lgb-filter-${uid}`;
  const clipId = `lgb-clip-${uid}`;
  const innerId = `lgb-inner-${uid}`;
  const fillId = `lgb-fill-${uid}`;
  const specId = `lgb-spec-${uid}`;

  const hasColor = !!color;
  const showGloss = gloss ?? hasColor;
  const showShadow = shadow ?? hasColor;

  const h = size;
  const styleWidth = style?.width;
  const requestedWidth = styleWidth ?? width;
  const initialPillWidth =
    typeof requestedWidth === 'number' ? Math.max(requestedWidth, h) : Math.max(340, h);
  const [measuredPillWidth, setMeasuredPillWidth] = useState(initialPillWidth);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (shape !== 'pill') return;

    if (typeof requestedWidth === 'number') {
      setMeasuredPillWidth(Math.max(requestedWidth, h));
      return;
    }

    const button = buttonRef.current;
    if (!button) return;

    const updateWidth = () => {
      const nextWidth = Math.max(button.getBoundingClientRect().width, h);
      setMeasuredPillWidth((current) => (current === nextWidth ? current : nextWidth));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(button);
    return () => observer.disconnect();
  }, [h, requestedWidth, shape]);

  const w = shape === 'pill' ? measuredPillWidth : size;
  const buttonWidth = shape === 'pill' ? (requestedWidth ?? '100%') : size;

  const pad = Math.round(Math.min(w, h) * 0.08);
  const filterW = w + pad * 2;
  const filterH = h + pad * 2;
  const dispScale = Math.min(w, h) * refraction;

  const outlinePx = useMemo(() => outlinePath(w, h, shape), [w, h, shape]);
  const dispUri = useMemo(() => buildDisplacementDataUri(w, h, pad, shape), [w, h, pad, shape]);
  const decoW = shape === 'pill' ? Math.round((DECO_RES * w) / h) : DECO_RES;
  const decoPath = useMemo(() => outlinePath(decoW, DECO_RES, shape), [decoW, shape]);

  const rotorRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const specRef = useRef<SVGPathElement>(null);
  const decoFillRef = useRef<SVGPathElement>(null);
  const decoInnerRef = useRef<SVGPathElement>(null);

  const doRotate = rotate && shape === 'blob';
  const doWobble = wobble && shape === 'pill';

  // Bring the button to life:
  //  • blob → slowly spin the whole squircle (its soft bulges drift around).
  //  • pill → undulate the OUTLINE like water. The label lives in a separate
  //    layer, so the text never moves or distorts.
  useEffect(() => {
    const rotor = rotorRef.current;
    if (rotor) rotor.style.transform = 'rotate(0deg)';
    // reset every outline to the static base
    clipRef.current?.setAttribute('d', outlinePx);
    specRef.current?.setAttribute('d', outlinePx);
    decoFillRef.current?.setAttribute('d', decoPath);
    decoInnerRef.current?.setAttribute('d', decoPath);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    let last = performance.now();

    if (doRotate) {
      let angle = 0;
      const tick = (now: number) => {
        const dt = (now - last) / 1000;
        last = now;
        angle = (angle + dt * rotateSpeed) % 360;
        if (rotor) rotor.style.transform = `rotate(${angle}deg)`;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    if (doWobble) {
      const ampPx = h * wobbleAmount;
      const ampDeco = DECO_RES * wobbleAmount;
      let t = 0;
      const tick = (now: number) => {
        t += (now - last) / 1000;
        last = now;
        const dPx = wobblePath(w, h, t, ampPx, wobbleSpeed);
        const dDeco = wobblePath(decoW, DECO_RES, t, ampDeco, wobbleSpeed);
        clipRef.current?.setAttribute('d', dPx);
        specRef.current?.setAttribute('d', dPx);
        decoFillRef.current?.setAttribute('d', dDeco);
        decoInnerRef.current?.setAttribute('d', dDeco);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
  }, [
    doRotate,
    doWobble,
    rotateSpeed,
    wobbleAmount,
    wobbleSpeed,
    w,
    h,
    decoW,
    outlinePx,
    decoPath,
  ]);

  // Water ripple on click.
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [hasClicked, setHasClicked] = useState(false);
  const isDisabled = disabled || hasClicked;
  const rippleId = useRef(0);
  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (!ripple) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const far = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y),
    );
    const id = rippleId.current++;
    setRipples((rs) => [...rs, { id, x, y, size: far * 2 }]);
    window.setTimeout(() => setRipples((rs) => rs.filter((r) => r.id !== id)), 900);
  };

  const handleClick = () => {
    if (isDisabled) return;
    setHasClicked(true);
    onClick?.();
  };

  const backdrop = `blur(${blur}px) url(#${filterId})`;
  const dropShadow = showShadow ? `drop-shadow(2px 2px 1px rgba(0,0,0,0.28))` : undefined;

  return (
    <button
      ref={buttonRef}
      type='button'
      className={['lgb-pill', className].filter(Boolean).join(' ')}
      style={{ width: buttonWidth, minWidth: h, height: h, ...style }}
      disabled={isDisabled}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      {/* Off-screen filter + clip definitions */}
      <svg aria-hidden className='lgb-defs' width='0' height='0'>
        <filter
          id={filterId}
          filterUnits='userSpaceOnUse'
          x={-pad}
          y={-pad}
          width={filterW}
          height={filterH}
          colorInterpolationFilters='sRGB'
        >
          <feImage
            href={dispUri}
            x={-pad}
            y={-pad}
            width={filterW}
            height={filterH}
            preserveAspectRatio='none'
            result='dispMap'
          />
          <feDisplacementMap
            in='SourceGraphic'
            in2='dispMap'
            scale={dispScale}
            xChannelSelector='R'
            yChannelSelector='G'
          />
        </filter>
        <clipPath id={clipId} clipPathUnits='userSpaceOnUse'>
          <path ref={clipRef} d={outlinePx} />
        </clipPath>
      </svg>

      {/* Rotating glass stack (rotor spins for the blob only) */}
      <div className='lgb-rotor' ref={rotorRef}>
        {/* Solid tint colour (coloured-pill mode) */}
        {hasColor && (
          <div
            className='lgb-color-fill'
            style={{ background: color, clipPath: `url(#${clipId})` }}
          />
        )}

        {/* The refraction: blurs + bends whatever is behind the button */}
        <div
          className='lgb-refract'
          style={{
            backdropFilter: backdrop,
            WebkitBackdropFilter: backdrop,
            clipPath: `url(#${clipId})`,
          }}
        />

        {/* Frosted white tint */}
        <div
          className='lgb-tint'
          style={{ background: `rgba(255,255,255,${tint})`, clipPath: `url(#${clipId})` }}
        />

        {/* Glossy top sheen (coloured-pill mode) */}
        {showGloss && <div className='lgb-gloss' style={{ clipPath: `url(#${clipId})` }} />}

        {/* Glass depth: fill gradient + layered inner shadows/highlights */}
        <svg
          className='lgb-deco'
          viewBox={`0 0 ${decoW} ${DECO_RES}`}
          preserveAspectRatio='none'
          aria-hidden
          style={{ opacity: 0.5, filter: dropShadow }}
        >
          <defs>
            <linearGradient id={fillId} x1='1' y1='0.5' x2='0' y2='0.5'>
              <stop stopColor='white' stopOpacity='0.5' />
              <stop offset='1' stopColor='white' />
            </linearGradient>
            <filter id={innerId} x='-10%' y='-10%' width='120%' height='120%'>
              <feGaussianBlur in='SourceAlpha' stdDeviation='16' result='b1' />
              <feOffset in='b1' dy='-27' result='o1' />
              <feComposite
                in='o1'
                in2='SourceAlpha'
                operator='arithmetic'
                k2='-1'
                k3='1'
                result='m1'
              />
              <feColorMatrix
                in='m1'
                values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.74 0'
                result='i1'
              />
              <feGaussianBlur in='SourceAlpha' stdDeviation='8' result='b2' />
              <feOffset in='b2' dx='1.7' dy='4.6' result='o2' />
              <feComposite
                in='o2'
                in2='SourceAlpha'
                operator='arithmetic'
                k2='-1'
                k3='1'
                result='m2'
              />
              <feColorMatrix
                in='m2'
                values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.45 0'
                result='i2'
              />
              <feGaussianBlur in='SourceAlpha' stdDeviation='16' result='b3' />
              <feComposite
                in='b3'
                in2='SourceAlpha'
                operator='arithmetic'
                k2='-1'
                k3='1'
                result='m3'
              />
              <feColorMatrix
                in='m3'
                values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.23 0'
                result='i3'
              />
              <feMerge>
                <feMergeNode in='i3' />
                <feMergeNode in='i2' />
                <feMergeNode in='i1' />
              </feMerge>
            </filter>
          </defs>
          <path ref={decoFillRef} d={decoPath} fill={`url(#${fillId})`} fillOpacity='0.23' />
          <path ref={decoInnerRef} d={decoPath} fill='white' filter={`url(#${innerId})`} />
        </svg>

        {/* Specular rim highlight */}
        {specular && (
          <svg
            className='lgb-spec'
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio='none'
            aria-hidden
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient
                id={specId}
                gradientUnits='objectBoundingBox'
                x1='0.8536'
                y1='0.8536'
                x2='0.1464'
                y2='0.1464'
              >
                <stop offset='0%' stopColor='rgba(255,255,255,.8)' />
                <stop offset='40%' stopColor='rgba(255,255,255,0)' />
                <stop offset='60%' stopColor='rgba(255,255,255,0)' />
                <stop offset='100%' stopColor='rgba(255,255,255,.8)' />
              </linearGradient>
            </defs>
            <path
              ref={specRef}
              d={outlinePx}
              fill='none'
              stroke={`url(#${specId})`}
              strokeWidth={Math.max(1, size * 0.018)}
              vectorEffect='non-scaling-stroke'
            />
          </svg>
        )}
      </div>

      {/* Water ripples (clipped to the shape, sit on the glass surface) */}
      <span className='lgb-ripple-layer' style={{ clipPath: `url(#${clipId})` }}>
        {ripples.map((r) => (
          <span
            key={r.id}
            className='lgb-ripple'
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              marginLeft: -r.size / 2,
              marginTop: -r.size / 2,
            }}
          />
        ))}
      </span>

      {/* Label — upright, in its own layer, never affected by the wobble */}
      <span className='lgb-content'>
        <span className='lgb-label' style={{ fontSize: Math.round(size * 0.35) }}>
          {children ?? label ?? 'Get started'}
        </span>
      </span>
    </button>
  );
}

export default LiquidGlassButton;
