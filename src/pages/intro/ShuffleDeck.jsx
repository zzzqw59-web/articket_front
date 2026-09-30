"use client";

/**
 * ShuffleDeck — framer-motion 없이 동작하는 버전
 *
 * 필요한 것: react 18+, Tailwind CSS v3.x 이상 (그 외 의존성 없음)
 *
 * 애니메이션은 CSS transition, 드래그는 Pointer Events 로 직접 구현했습니다.
 *
 * props
 * - projects: { image: string | { src, alt?, srcSet? }, title, category?, year?, link?, newTab?, color? }[]
 * - startSlide (1)          시작 슬라이드 (1부터)
 * - cardWidth (0.64)        데스크톱 카드 너비 비율
 * - maxCardWidth (880)      카드 최대 너비(px)
 * - cardHeight (530)        카드 높이(px, 프레임이 작으면 자동 축소)
 * - mobileCardWidth (0.84)  모바일 카드 너비 비율
 * - radius (22) spread (42) rotation (7) imagePadding (8) shadow (0.34) duration (0.65)
 * - gradientBackground (true), background, backgroundEnd, glowColorA, glowColorB
 * - cardBackground, textColor, mutedColor, accent (포커스 링 색)
 * - titleFont, bodyFont     CSS style 객체 (예: { fontFamily: "Georgia, serif" })
 * - showThumbnails (true)
 * - className, style        루트에 전달 (기본 크기: w-full h-[760px])
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const DEFAULT_PROJECTS = [
  {
    image: {
      src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
      alt: "Selected visual design project",
    },
    title: "Another Perspective",
    category: "Art Direction",
    year: "2026",
    link: "",
    newTab: false,
    color: "#DDD7FA",
  },
  {
    image: {
      src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
      alt: "Brand identity project",
    },
    title: "Outside the Ordinary",
    category: "Brand Identity",
    year: "2026",
    link: "",
    newTab: false,
    color: "#DFE8BC",
  },
  {
    image: {
      src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
      alt: "Digital experience project",
    },
    title: "A Different Feeling",
    category: "Digital Experience",
    year: "2025",
    link: "",
    newTab: false,
    color: "#F3D3BE",
  },
  {
    image: {
      src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
      alt: "Photography and editorial project",
    },
    title: "Between Places",
    category: "Photography",
    year: "2025",
    link: "",
    newTab: false,
    color: "#CADFE9",
  },
];

const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const cn = (...classes) => classes.filter(Boolean).join(" ");

// 키보드 포커스 링 (accent 색은 루트의 --accent CSS 변수로 전달)
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-[-5px]";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const wrap = (value, length) => ((value % length) + length) % length;
const frameNumber = (value, fallback) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, value)
    : fallback;

// image 는 문자열 또는 { src, alt, srcSet } 모두 허용
const imageObj = (project) =>
  project?.image && typeof project.image === "object" ? project.image : {};
const imageSrc = (project) =>
  (typeof project?.image === "string"
    ? project.image
    : imageObj(project).src) || DEFAULT_PROJECTS[0].image.src;

// "동작 줄이기" 설정이면 모든 전환을 끕니다
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function Arrow({ left = false }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("block", left && "rotate-180")}
    >
      <path
        d="M4 12h15M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeckCard({
  project,
  rank,
  exiting,
  animateIn,
  width,
  height,
  mobile,
  radius,
  spread,
  rotation,
  imagePadding,
  shadow,
  duration,
  cardBackground,
  textColor,
  mutedColor,
  titleFont,
  bodyFont,
  instant,
  canDrag,
  onNext,
  onPrevious,
  onSelect,
  onDragState,
}) {
  const active = rank === 0;
  const outerRef = useRef(null);
  const dragRef = useRef(null);
  const dragStateCb = useRef(onDragState);
  const [ready, setReady] = useState(!animateIn || instant);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dragStateCb.current = onDragState;
  });

  // 새로 들어오는 카드: 시작 자세를 한 번 그린 뒤 목표 자세로 전환
  useSafeLayoutEffect(() => {
    if (ready) return;
    void outerRef.current?.getBoundingClientRect(); // 시작 스타일을 강제로 계산시킴
    setReady(true);
  }, [ready]);

  // 활성 카드가 아니게 되면 드래그 상태 초기화
  useEffect(() => {
    if (active) return;
    if (dragRef.current?.started) dragStateCb.current(false);
    dragRef.current = null;
    setIsDragging(false);
    setDragX(0);
  }, [active]);

  // 드래그 도중 언마운트되어도 클릭 차단 상태가 남지 않게 정리
  useEffect(() => {
    return () => {
      if (dragRef.current?.started) dragStateCb.current(false);
    };
  }, []);

  const side = rank === 1 ? -1 : 1;
  const offsetX = active ? 0 : side * spread;
  const offsetY = active ? 10 : rank === 1 ? -9 : -23;
  const cardRotation = active ? 0 : side * rotation;
  const scale = active ? 1 : rank === 1 ? 0.955 : 0.91;
  const footerHeight = mobile ? 88 : 104;
  const innerRadius = Math.max(0, radius - imagePadding);
  const hasLink = !!project.link?.trim();
  const image = imageObj(project);

  const pose = ready
    ? { y: offsetY, scale, opacity: 1 }
    : { y: offsetY + 8, scale: scale * 0.98, opacity: 0 };
  const exitDuration = Math.min(0.18, duration * 0.3);
  const transition = instant
    ? "none"
    : exiting
      ? `opacity ${exitDuration}s ease-out`
      : `transform ${duration}s ${EASE}, opacity ${duration}s ${EASE}`;

  const canDragNow = active && canDrag && !exiting;
  const dragRotation = instant ? 0 : clamp(dragX / width, -1, 1) * 14;

  /* ---------- 드래그 (Pointer Events) ---------- */
  const handlePointerDown = (event) => {
    if (!canDragNow) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      started: false,
      samples: [{ x: event.clientX, t: performance.now() }],
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (!drag.started) {
      if (Math.abs(dx) < 3) return; // 살짝 움직인 건 클릭으로 취급
      drag.started = true;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* 일부 환경에서는 캡처 불가 — 무시 */
      }
      setIsDragging(true);
      dragStateCb.current(true);
    }
    drag.samples.push({ x: event.clientX, t: performance.now() });
    if (drag.samples.length > 8) drag.samples.shift();
    setDragX(dx * 0.85); // 원본의 dragElastic 0.85
  };

  const finishDrag = (event, cancelled) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.started) return;

    setIsDragging(false);
    dragStateCb.current(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* 무시 */
    }
    setDragX(0); // 제자리로 복귀 (CSS transition)
    if (cancelled) return;

    const now = performance.now();
    const recent = drag.samples.filter((s) => now - s.t <= 100);
    const first = recent[0];
    const dt = first ? now - first.t : 0;
    const velocity = dt > 0 ? ((event.clientX - first.x) / dt) * 1000 : 0;
    const dx = event.clientX - drag.startX;

    const threshold = Math.min(100, width * 0.22);
    const shouldChange =
      Math.abs(dx) > threshold ||
      (Math.abs(dx) > 20 && Math.abs(velocity) > 650);
    if (!shouldChange) return;
    if (dx < 0) onNext();
    else onPrevious();
  };

  return (
    <div
      ref={outerRef}
      className={cn(
        "absolute left-1/2 top-1/2",
        exiting && "pointer-events-none",
      )}
      style={{
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        zIndex: 30 - rank,
        transformOrigin: "50% 80%",
        transform: `translate(${offsetX}px, ${pose.y}px) rotate(${cardRotation}deg) scale(${pose.scale})`,
        opacity: exiting ? 0 : pose.opacity,
        transition,
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishDrag(event, false)}
        onPointerCancel={(event) => finishDrag(event, true)}
        className={cn(
          "relative h-full w-full touch-pan-y select-none overflow-hidden",
          active
            ? canDrag
              ? "cursor-grab"
              : "cursor-default"
            : "cursor-pointer",
        )}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragRotation}deg)`,
          transition:
            isDragging || instant ? "none" : `transform 0.45s ${EASE}`,
          borderRadius: radius,
          background: cardBackground,
          boxShadow: `0 24px 65px -30px rgba(0,0,0,${shadow}), 0 3px 12px rgba(0,0,0,${
            shadow * 0.12
          })`,
        }}
      >
        {/* 이미지 영역 */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: imagePadding,
            right: imagePadding,
            top: imagePadding,
            bottom: footerHeight,
            borderRadius: innerRadius,
            background: project.color || "#DCDDD6",
          }}
        >
          <img
            src={imageSrc(project)}
            srcSet={image.srcSet}
            sizes={`${Math.round(width)}px`}
            alt={active ? image.alt || project.title : ""}
            draggable={false}
            loading="eager"
            className="pointer-events-none block h-full w-full select-none object-cover"
          />

          {project.category && (
            <span
              className={cn(
                "pointer-events-none absolute box-border max-w-[calc(100%-40px)] overflow-hidden text-ellipsis whitespace-nowrap rounded-full px-3 py-2 text-[#20221F]",
                mobile ? "left-3.5 top-3.5" : "left-5 top-5",
              )}
              style={{
                background: project.color || "#E5E8DF",
                ...bodyFont,
                fontSize: 11,
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              {project.category}
            </span>
          )}

          {!active && (
            <div
              className={cn(
                "pointer-events-none absolute inset-0",
                rank === 1 ? "opacity-10" : "opacity-20",
              )}
              style={{ background: cardBackground }}
            />
          )}
        </div>

        {/* 하단 정보 */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 box-border flex items-center justify-between gap-4",
            mobile ? "px-5 py-4" : "px-7 py-5",
          )}
          style={{ height: footerHeight, color: textColor }}
        >
          <div className="min-w-0">
            {project.year && (
              <div
                className="mb-[7px]"
                style={{
                  ...bodyFont,
                  fontSize: 10,
                  lineHeight: 1.2,
                  letterSpacing: "0.08em",
                  color: mutedColor,
                }}
              >
                {project.year}
              </div>
            )}
            <h3
              className="m-0 truncate"
              style={{
                fontSize: mobile ? 20 : 27,
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: "-0.045em",
                ...titleFont,
                ...(mobile ? { fontSize: 20 } : {}),
              }}
            >
              {project.title}
            </h3>
          </div>

          {hasLink && (
            <span
              className={cn(
                "grid shrink-0 place-items-center rounded-full text-[#20221F]",
                mobile ? "h-9 w-9" : "h-[42px] w-[42px]",
              )}
              style={{ background: project.color || "#E5E8DF" }}
            >
              <Arrow />
            </span>
          )}
        </div>

        {/* 활성 카드 링크 */}
        {active && hasLink && (
          <a
            href={project.link}
            target={project.newTab ? "_blank" : undefined}
            rel={project.newTab ? "noopener noreferrer" : undefined}
            aria-label={`View ${project.title}`}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className={cn(
              "absolute inset-0 z-[3]",
              canDrag ? "cursor-grab" : "cursor-pointer",
              FOCUS_RING,
            )}
            style={{ borderRadius: radius }}
          />
        )}

        {/* 뒤쪽 카드 클릭 → 해당 카드로 이동 */}
        {!active && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Show ${project.title}`}
            onClick={onSelect}
            className="absolute inset-0 z-[3] h-full w-full cursor-pointer border-0 bg-transparent p-0"
            style={{ borderRadius: radius }}
          />
        )}
      </div>
    </div>
  );
}

export function ShuffleDeck({
  projects = DEFAULT_PROJECTS,
  startSlide = 1,
  cardWidth = 0.64,
  maxCardWidth = 880,
  cardHeight = 530,
  mobileCardWidth = 0.84,
  radius = 22,
  spread = 42,
  rotation = 7,
  imagePadding = 8,
  shadow = 0.34,
  duration = 0.65,
  gradientBackground = true,
  background = "#EDEEE8",
  backgroundEnd = "#E7EDE5",
  glowColorA = "rgba(186, 164, 242, 0.6)",
  glowColorB = "rgba(247, 194, 166, 0.55)",
  cardBackground = "#FFFFFF",
  textColor = "#242620",
  mutedColor = "#82857B",
  accent = "#313B26",
  titleFont,
  bodyFont,
  showThumbnails = true,
  className,
  style,
}) {
  const instant = usePrefersReducedMotion();
  const items = projects?.length ? projects : DEFAULT_PROJECTS;
  const count = items.length;
  const visibleCount = Math.min(3, count);

  const rootRef = useRef(null);
  const railRef = useRef(null);
  const dragging = useRef(false);
  const blockClickUntil = useRef(0);

  const [size, setSize] = useState({
    width: frameNumber(style?.width, 1100),
    height: frameNumber(style?.height, 760),
  });
  const [cursor, setCursor] = useState(() =>
    clamp(Math.round(startSlide) - 1, 0, count - 1),
  );
  // 첫 렌더의 카드는 등장 애니메이션 없이, 이후 새로 생기는 카드만 애니메이션
  const [mounted, setMounted] = useState(false);
  // 화면에서 빠지는 카드: 잠시 남겨 두고 페이드아웃
  const [prevCursor, setPrevCursor] = useState(cursor);
  const [exiting, setExiting] = useState([]);

  if (prevCursor !== cursor) {
    setPrevCursor(cursor);
    if (!instant) {
      const nowVisible = new Set(
        Array.from({ length: visibleCount }, (_, r) => cursor + r),
      );
      const gone = Array.from({ length: visibleCount }, (_, r) => ({
        position: prevCursor + r,
        rank: r,
      })).filter((entry) => !nowVisible.has(entry.position));
      if (gone.length) {
        setExiting((current) => [
          ...current.filter(
            (entry) =>
              !nowVisible.has(entry.position) &&
              !gone.some((g) => g.position === entry.position),
          ),
          ...gone,
        ]);
      }
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!exiting.length) return;
    const id = window.setTimeout(
      () => setExiting([]),
      Math.min(0.18, duration * 0.3) * 1000 + 80,
    );
    return () => window.clearTimeout(id);
  }, [exiting, duration]);

  useEffect(() => {
    setCursor(clamp(Math.round(startSlide) - 1, 0, count - 1));
  }, [startSlide, count]);

  // 컨테이너 크기 측정
  useSafeLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const measure = () => {
      const nextWidth = element.clientWidth || 1100;
      const nextHeight = element.clientHeight || 760;
      setSize((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const activeIndex = wrap(cursor, count);
  const activeProject = items[activeIndex];
  const mobile = size.width < 640;

  const footerHeight = showThumbnails ? 104 : 76;
  const stageHeight = Math.max(1, size.height - footerHeight);
  const availableWidth = Math.max(1, size.width - (mobile ? 36 : 80));
  const width = Math.max(
    1,
    Math.min(
      maxCardWidth,
      availableWidth,
      size.width *
        (mobile
          ? clamp(mobileCardWidth, 0.55, 0.92)
          : clamp(cardWidth, 0.35, 0.88)),
    ),
  );
  const availableHeight = Math.max(1, stageHeight - (mobile ? 92 : 116));
  const height = Math.max(1, Math.min(cardHeight, availableHeight));
  const actualSpread = mobile ? Math.min(spread, 17) : spread;
  const actualRotation = mobile ? Math.min(rotation, 6) : rotation;

  const go = (direction) => {
    if (count <= 1) return;
    setCursor((current) => current + direction);
  };

  const goTo = (target) => {
    setCursor((current) => {
      const currentIndex = wrap(current, count);
      let difference = target - currentIndex;
      if (difference > count / 2) difference -= count;
      if (difference < -count / 2) difference += count;
      return current + difference;
    });
  };

  const handleDragState = (value) => {
    dragging.current = value;
    if (!value) {
      blockClickUntil.current = Date.now() + 350;
    }
  };

  // 활성 썸네일을 레일 중앙으로 스크롤
  useEffect(() => {
    const rail = railRef.current;
    const selected = rail?.children[activeIndex];
    if (!rail || !selected) return;
    rail.scrollLeft =
      selected.offsetLeft - rail.clientWidth / 2 + selected.offsetWidth / 2;
  }, [activeIndex, size.width, showThumbnails]);

  const handleKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest("input, textarea, select, [contenteditable='true']")
    ) {
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1);
    }
  };

  const backgroundStyle = gradientBackground
    ? `radial-gradient(ellipse at 12% 18%, ${glowColorA} 0%, transparent 62%),
       radial-gradient(ellipse at 90% 82%, ${glowColorB} 0%, transparent 60%),
       linear-gradient(135deg, ${background} 0%, ${backgroundEnd} 100%)`
    : background;

  const pad = (n) => String(n).padStart(2, "0");

  // 렌더할 카드 = 현재 보이는 카드 + 페이드아웃 중인 카드 (position 오름차순 → DOM 이동 없음)
  const visibleCards = Array.from({ length: visibleCount }, (_, rank) => ({
    position: cursor + rank,
    rank,
    exiting: false,
  }));
  const visibleSet = new Set(visibleCards.map((card) => card.position));
  const leavingCards = exiting
    .filter((entry) => !visibleSet.has(entry.position))
    .map((entry) => ({ ...entry, exiting: true }));
  const cards = [...visibleCards, ...leavingCards].sort(
    (a, b) => a.position - b.position,
  );

  const navButtonClass = cn(
    "grid shrink-0 appearance-none place-items-center rounded-full border-0 p-0 [-webkit-tap-highlight-color:transparent]",
    "transition-transform duration-150 ease-out motion-safe:enabled:hover:scale-[1.08] motion-safe:enabled:active:scale-[0.94]",
    mobile ? "h-[42px] w-[42px]" : "h-12 w-12",
    count > 1 ? "cursor-pointer" : "cursor-default opacity-[0.35]",
    FOCUS_RING,
  );

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative isolate box-border flex h-[760px] min-h-0 w-full min-w-0 flex-col overflow-hidden font-[family-name:Inter,sans-serif]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-[-3px]",
        className,
      )}
      style={{
        ...style,
        "--accent": accent,
        background: backgroundStyle,
        color: textColor,
      }}
    >
      {/* 카드 스택 */}
      <div
        className="relative min-h-0 flex-[1_1_0]"
        onClickCapture={(event) => {
          if (dragging.current || Date.now() < blockClickUntil.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        {cards.map(({ position, rank, exiting: isExiting }) => (
          <DeckCard
            key={position}
            project={items[wrap(position, count)]}
            rank={rank}
            exiting={isExiting}
            animateIn={mounted}
            width={width}
            height={height}
            mobile={mobile}
            radius={radius}
            spread={actualSpread}
            rotation={actualRotation}
            imagePadding={imagePadding}
            shadow={shadow}
            duration={duration}
            cardBackground={cardBackground}
            textColor={textColor}
            mutedColor={mutedColor}
            titleFont={titleFont}
            bodyFont={bodyFont}
            instant={instant}
            canDrag={count > 1}
            onNext={() => go(1)}
            onPrevious={() => go(-1)}
            onSelect={() => goTo(wrap(position, count))}
            onDragState={handleDragState}
          />
        ))}
      </div>

      {/* 컨트롤 */}
      <div
        className="relative z-50 box-border flex shrink-0 grow-0 flex-col items-center justify-start gap-[13px] px-5 pb-4 pt-1"
        style={{ flexBasis: footerHeight }}
      >
        <div
          className={cn(
            "flex w-full items-center justify-center",
            mobile ? "gap-4" : "gap-6",
          )}
        >
          <button
            type="button"
            aria-label="Previous project"
            disabled={count <= 1}
            onClick={() => go(-1)}
            className={navButtonClass}
            style={{ background: cardBackground, color: textColor }}
          >
            <Arrow left />
          </button>

          {showThumbnails ? (
            <div
              ref={railRef}
              role="group"
              aria-label="Choose project"
              className={cn(
                "relative flex min-w-0 items-center overflow-x-auto px-[5px] py-[7px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                mobile ? "gap-[7px]" : "gap-[9px]",
              )}
              style={{
                maxWidth: mobile ? Math.max(60, size.width - 180) : 340,
              }}
            >
              {items.map((project, projectIndex) => {
                const selected = projectIndex === activeIndex;
                const y = selected ? -3 : 0;
                const rot = selected ? -5 : projectIndex % 2 ? 4 : -3;
                return (
                  <button
                    key={projectIndex}
                    type="button"
                    aria-label={`Show ${project.title}`}
                    aria-pressed={selected}
                    onClick={() => goTo(projectIndex)}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-[5px] border-0 p-[3px] transition-[transform,opacity] duration-[250ms] motion-reduce:transition-none",
                      mobile ? "h-[38px] w-8" : "h-[46px] w-10",
                      FOCUS_RING,
                    )}
                    style={{
                      background: cardBackground,
                      transform: `translateY(${y}px) rotate(${rot}deg)`,
                      opacity: selected ? 1 : 0.5,
                      outline: selected ? `2px solid ${accent}` : undefined,
                      outlineOffset: selected ? 2 : undefined,
                    }}
                  >
                    <img
                      src={imageSrc(project)}
                      srcSet={imageObj(project).srcSet}
                      sizes="40px"
                      alt=""
                      draggable={false}
                      className="block h-full w-full rounded-[3px] object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <span
              className="min-w-[74px] text-center tabular-nums"
              style={{ ...bodyFont, fontSize: 12 }}
            >
              {pad(activeIndex + 1)} / {pad(count)}
            </span>
          )}

          <button
            type="button"
            aria-label="Next project"
            disabled={count <= 1}
            onClick={() => go(1)}
            className={navButtonClass}
            style={{ background: cardBackground, color: textColor }}
          >
            <Arrow />
          </button>
        </div>

        {showThumbnails && (
          <div
            className="tabular-nums"
            style={{
              ...bodyFont,
              fontSize: 10,
              lineHeight: 1.2,
              letterSpacing: "0.1em",
              color: mutedColor,
            }}
          >
            {pad(activeIndex + 1)}
            <span className="opacity-50"> / </span>
            {pad(count)}
          </div>
        )}
      </div>

      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {activeProject.title}. Project {activeIndex + 1} of {count}.
      </span>
    </div>
  );
}

export default ShuffleDeck;
