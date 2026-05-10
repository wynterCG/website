import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import {
  Mail, Sparkles, Menu as MenuIcon,
  Play as PlayIcon, X as XIcon, ChevronLeft, ChevronRight as CaretRight,
  Image as ImageIcon, Video as VideoIcon, Youtube as YoutubeIcon
} from "lucide-react";

/* ---------- helpers ---------- */
const safeURL = (s) => { try { return new URL(s); } catch { return null; } };
const extractYouTubeId = (u) => {
  const x = safeURL(u); if (!x) return null;
  if (x.hostname === "youtu.be") return x.pathname.slice(1);
  const v = x.searchParams.get("v"); if (v) return v;
  const parts = x.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
  return idx !== -1 ? parts[idx + 1] : parts.pop();
};
const ytThumb = (u, { prefer = "hq" } = {}) => {
  const id = extractYouTubeId(u); if (!id) return null;
  return `https://i.ytimg.com/vi/${id}/${prefer === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;
};
const ytEmbedMuted = (u, origin) => {
  const id = extractYouTubeId(u); if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`;
};
const ytEmbedModal = (u, origin) => {
  const id = extractYouTubeId(u); if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1&rel=0${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`;
};

const colors = {
  primary: "from-gray-200 to-gray-400",
  background: "bg-gradient-to-b from-black via-gray-900 to-gray-800",
  text: "text-gray-100",
};
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/* ---------- sample projects ---------- */
const projectsData = [
  {
    title: "YSL MYSLF Le Parfum",
    tags: ["Materials","Product Visualization","Rendering"],
    blurb: "Photorealistic render based on a real perfume sample.",
    link: "#",
    media: [
      { type: "image", src: "/ysl/render03_final.png" },
      { type: "image", src: "/ysl/render00.png" },
      { type: "image", src: "/ysl/00.png" },
      { type: "image", src: "/ysl/01.png" },
      { type: "image", src: "/ysl/02.png" },
      { type: "image", src: "/ysl/03.png" },
      { type: "image", src: "/ysl/04.png" },
    ],
  },
  {
    title: "Modern House — Archviz",
    tags: ["Archviz", "UE5", "Environment"],
    blurb: "Archviz study based on a real ArchDaily project.",
    link: "#",
    poster: "posters/Archviz.png",
    media: [{ type: "youtube", src: "https://www.youtube.com/watch?v=B7W1erPk05c", ratio: "16 / 9" }],
  },
  {
    title: "STARVIZ",
    tags: ["Materials","Product Visualization","Rendering"],
    blurb: "Photorealistic bathroom interior visualization.",
    link: "#",
    media: [
      { type: "image", src: "/posters/STARVIZ01.jpg" },
      { type: "image", src: "/posters/STARVIZ00.jpg" },
    ],
  },
  {
    title: "Phyllotaxis Generator",
    tags: ["Procedural", "Substance Designer", "Technical Art"],
    blurb: "Procedural spiral generator built in Substance Designer with FX-Maps.",
    link: "#",
    poster: "/posters/Phyllotaxis.png",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/506/0811.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/475/0530.mp4" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/777/768/large/dan-inverno-screenshot-2025-04-30-120915.jpg?1754893504" },
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/090/777/771/large/dan-inverno-screenshot-2025-04-30-120358.jpg?1754893531" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/777/774/large/dan-inverno-screenshot-2025-04-30-120559.jpg?1754893533" },
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/090/777/775/large/dan-inverno-screenshot-2025-04-30-130149.jpg?1754893536" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/777/770/large/dan-inverno-screenshot-2025-04-29-230623.jpg?1754893529" },
    ],
  },
  {
    title: "Lapis Lazuli",
    tags: ["Materials","Product Visualization","Rendering"],
    blurb: "Procedural lapis lazuli material in Substance Designer.",
    link: "#",
    media: [
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/090/780/581/large/dan-inverno-render00-final.jpg?1754901377" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/780/444/large/dan-inverno-screenshot-2025-08-11-102910.jpg?1754901019" },
    ],
  },
  {
    title: "Snake Fountain",
    tags: ["Game Art","Hand painted","Stylized","Environment"],
    blurb: "Hand-painted stylized prop, WoW-inspired.",
    link: "#",
    media: [{ type: "image", src: "/posters/Snake.png" }],
  },
  {
    title: "Stylized hand-painted environment",
    tags: ["Game Art","Hand painted","UE5","Environment"],
    blurb: "Hand-painted environment in Unreal — Overwatch & WoW art style.",
    link: "#",
    media: [
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/030/977/060/large/dan-wynter-highresscreenshot00002.jpg?1602204167" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/030/977/130/large/dan-wynter-highresscreenshot00003.jpg?1602204731" },
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/030/977/373/large/dan-wynter-highresscreenshot00005.jpg?1602205532" },
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/030/977/233/large/dan-wynter-highresscreenshot00004.jpg?1602205044" },
    ],
  },
  {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Virtual pet concept device — nine material variants on one model.",
    link: "#",
    poster: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/661/water.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/679/0811-1.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/658/ghfjgfj.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/671/ergershf.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/669/0000-0119-1.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/659/0000-0119-3.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/667/gummy-2.mp4" },
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/670/0000-0119.mp4" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
  {
    title: "Can Game",
    tags: ["Indie Dev", "UE5", "Game Art"],
    blurb: "Early process and blockouts of an indie game prototype.",
    link: "#",
    media: [
      { type: "youtube", src: "https://youtu.be/ZfSN77J8tL4", ratio: "16 / 9" },
      { type: "image", src: "https://i.ytimg.com/vi/ZfSN77J8tL4/maxresdefault.jpg" },
    ],
  },
];

/* ---------- ratio utils ---------- */
const normRatio = (r) => {
  if (!r) return null;
  if (typeof r === "number") return r;
  const parts = String(r).split("/").map(s => Number(s.trim()));
  if (parts.length === 2 && parts.every(n => Number.isFinite(n) && n > 0)) {
    return parts[0] / parts[1];
  }
  return null;
};
const ratioString = (r) => {
  if (!r || !Number.isFinite(r)) return "16 / 9";
  const w = Math.round(r * 1000);
  const h = 1000;
  return `${w} / ${h}`;
};
const loadImageRatio = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 16/9);
    img.onerror = () => resolve(16/9);
    img.src = src;
  });

// Mirror of loadImageRatio for video sources — pulls the file's metadata so
// the card sizes to the video's actual aspect instead of the project's
// declared ratio (which was often a guess).
const loadVideoRatio = (src) =>
  new Promise((resolve) => {
    if (typeof document === "undefined") { resolve(16/9); return; }
    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.playsInline = true;
    let done = false;
    const finish = (r) => { if (done) return; done = true; resolve(r); };
    v.onloadedmetadata = () => {
      const r = v.videoWidth && v.videoHeight ? v.videoWidth / v.videoHeight : 16/9;
      finish(r);
    };
    v.onerror = () => finish(16/9);
    // Safety timeout so a stuck request doesn't keep the grid in the loading
    // state forever.
    setTimeout(() => finish(16/9), 4000);
    v.src = src;
  });

/* ---------- media badges & helpers ---------- */
const mediaCounts = (media = []) =>
  media.reduce((a, m) => {
    const t = m?.type || "other";
    a[t] = (a[t] || 0) + 1;
    a.total = (a.total || 0) + 1;
    return a;
  }, { total: 0 });

const iconForType = (t) => (
  t === "video"   ? <VideoIcon className="w-3.5 h-3.5" /> :
  t === "youtube" ? <YoutubeIcon className="w-3.5 h-3.5" /> :
  t === "image"   ? <ImageIcon className="w-3.5 h-3.5" /> : null
);

/* ---------- SpotlightMarquee ----------
 * News-ticker style horizontal scroll where every word is dimmed except
 * the one currently closest to the viewport centre. A requestAnimationFrame
 * loop measures each visible word's bounding rect on every frame and sets
 * the active index — guaranteeing whole-word highlighting (the previous
 * gradient-mask approach split words in the middle of a character).
 */
function SpotlightMarquee({ items, direction = "left", duration = 60, rowClassName = "", itemClassName = "", gapPx = 48, activeClassName = "text-white", dimClassName = "text-white/[0.07]" }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let raf;
    const detect = () => {
      const container = containerRef.current;
      if (container) {
        const cRect = container.getBoundingClientRect();
        const centerX = (cRect.left + cRect.right) / 2;
        const els = container.querySelectorAll("[data-mq-index]");
        let bestIdx = 0;
        let bestDist = Infinity;
        els.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right < cRect.left || r.left > cRect.right) return;
          const itemCenter = (r.left + r.right) / 2;
          const dist = Math.abs(itemCenter - centerX);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = Number(el.getAttribute("data-mq-index"));
          }
        });
        setActiveIndex((prev) => (prev === bestIdx ? prev : bestIdx));
      }
      raf = requestAnimationFrame(detect);
    };
    raf = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Three copies of the content so the viewport stays full even when one
  // cycle is narrower than the screen. Animating exactly -33.333% (= one
  // cycle width) keeps the loop seamless.
  const animate = direction === "right" ? { x: ["-33.333%", "0%"] } : { x: ["0%", "-33.333%"] };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${rowClassName}`}>
      <motion.div
        className="absolute inset-0 flex w-max items-center"
        animate={animate}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
      >
        {Array.from({ length: 3 }).map((_, j) => (
          <div
            key={j}
            aria-hidden={j !== 0}
            className="flex items-center whitespace-nowrap"
            style={{ gap: `${gapPx}px`, paddingRight: `${gapPx}px` }}
          >
            {items.map((item, i) => (
              <span
                key={`${j}-${i}`}
                data-mq-index={i}
                className={[
                  itemClassName,
                  "transition-colors duration-200",
                  activeIndex === i ? activeClassName : dimClassName,
                ].join(" ")}
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function MediaBadge({ media, hidden = false }) {
  const c = mediaCounts(media);
  return (
    <div
      className={[
        "absolute top-3 right-3 z-30 rounded-full border border-white/20 bg-black/60 backdrop-blur px-3 py-1 text-[11px] text-white/95 flex items-center gap-2 transition-opacity duration-300",
        hidden ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <span className="font-semibold">{c.total}</span>
      <span className="opacity-80">items</span>
      <span className="h-3.5 w-px bg-white/25 mx-1" />
      {c.video ?   <span className="flex items-center gap-1 opacity-95">{iconForType("video")}{c.video}</span> : null}
      {c.youtube ? <span className="flex items-center gap-1 opacity-95">{iconForType("youtube")}{c.youtube}</span> : null}
      {c.image ?   <span className="flex items-center gap-1 opacity-95">{iconForType("image")}{c.image}</span> : null}
    </div>
  );
}

/* ---------- Lightbox (centered, no-crop; swipe) ---------- */
function Lightbox({ open, onClose, project, startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex);
  const [vidError, setVidError] = useState({});
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const lbTouch = useRef(null);

  const media = project?.media || [];
  const current = media[index] || null;

  useEffect(() => { if (open) setIndex(startIndex); }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % media.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + media.length) % media.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocusedRef.current?.focus?.();
    };
  }, [open, media.length, onClose]);

  const onLBTouchStart = (e) => {
    const t = e.changedTouches[0];
    lbTouch.current = { x: t.clientX, y: t.clientY };
  };
  const onLBTouchEnd = (e) => {
    const st = lbTouch.current; if (!st) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - st.x, dy = t.clientY - st.y;
    lbTouch.current = null;
    const TH = 40;
    if (Math.abs(dx) > TH && Math.abs(dx) > Math.abs(dy)) {
      setIndex((i) => (i + (dx < 0 ? +1 : -1) + media.length) % media.length);
    }
  };

  const Wrap = ({ children }) => (
    <div className="h-full w-full">
      <div className="relative h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );

  const renderMedia = (m) => {
    if (!m) return null;

    if (m.type === "image") {
      return (
        <Wrap>
          <img
            key={index}
            src={m.src}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
            decoding="async"
          />
        </Wrap>
      );
    }

    if (m.type === "video") {
      if (vidError[index]) {
        return (
          <div className="h-full w-full grid place-items-center p-6 text-center text-gray-200">
            <p>Can’t play this video in your browser.</p>
            <p className="mt-2">
              <a href={m.src} target="_blank" rel="noopener noreferrer" className="underline">
                Open in a new tab
              </a>
            </p>
          </div>
        );
      }

      return (
        <Wrap>
          <video
            key={index}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            onError={() => setVidError((e) => ({ ...e, [index]: true }))}
          >
            <source src={m.src} type="video/mp4" />
          </video>
        </Wrap>
      );
    }

    if (m.type === "youtube") {
      const src = ytEmbedModal(m.src, origin);
      return (
        <Wrap>
          <iframe
            key={index}
            src={src}
            title={project.title}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="eager"
          />
        </Wrap>
      );
    }
    return null;
  };

  if (!open || !project) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label={`${project.title} gallery`}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="
          relative w-full max-w-6xl
          grid grid-rows-[auto,1fr,auto]
          max-h-[90dvh] rounded-2xl overflow-hidden shadow-2xl bg-black
          group
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="p-3 sm:p-4 flex items-center justify-between gap-3 text-gray-200">
          <div className="display-serif text-base sm:text-lg truncate">{project.title}</div>
          <button
            ref={closeBtnRef} type="button" onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white border border-white/30 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* media area: explicit height on the player + thumb strip flowing
            naturally below it (no longer overlaying the video controls).
            The player is shorter on md+ to reserve room for the strip. */}
        <div className="relative min-h-0">
          {/* player */}
          <div
            className={[
              "relative",
              media.length > 1
                ? "h-[60dvh] md:h-[60dvh] lg:h-[62dvh]"
                : "h-[70dvh] md:h-[70dvh] lg:h-[72dvh]",
            ].join(" ")}
            style={{ touchAction: "pan-y" }}
            onTouchStart={onLBTouchStart}
            onTouchEnd={onLBTouchEnd}
          >
            {renderMedia(current)}

            {/* nav arrows (desktop) */}
            {media.length > 1 && (
              <>
                <button
                  type="button" aria-label="Previous"
                  onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 hidden sm:flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button" aria-label="Next"
                  onClick={() => setIndex((i) => (i + 1) % media.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 hidden sm:flex items-center justify-center"
                >
                  <CaretRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail filmstrip — actual mini-previews of each item, in its
              own row beneath the player so it never collides with native
              video controls. Always visible (it's the navigation rail). */}
          {media.length > 1 && (
              <div
                role="tablist"
                aria-label="Media items"
                className="
                  shrink-0 hidden md:flex
                  items-center justify-center gap-3 px-4 py-3
                  bg-black overflow-x-auto
                "
              >
                {media.map((m, idx) => {
                  const active = idx === index;
                  const label =
                    m.type === "video"   ? `Video ${idx+1}` :
                    m.type === "youtube" ? `YouTube ${idx+1}` :
                    m.type === "image"   ? `Image ${idx+1}` : `Item ${idx+1}`;
                  const thumbSrc =
                    m.type === "image"   ? m.src :
                    m.type === "youtube" ? ytThumb(m.src, { prefer: "hq" }) :
                    null; // video uses <video> below
                  return (
                    <button
                      key={idx}
                      role="tab"
                      aria-selected={active}
                      aria-current={active ? "true" : undefined}
                      aria-label={label}
                      title={label}
                      onClick={() => setIndex(idx)}
                      className={[
                        "shrink-0 relative overflow-hidden rounded-md transition-opacity",
                        // Square box + object-contain below: every item shows
                        // its full shape (portraits stay portrait, landscapes
                        // stay landscape) instead of being cropped to a fixed
                        // landscape box. Use a 2px border (not ring) so the
                        // frame is part of the box, never overflowing into the
                        // gap between thumbs.
                        "w-16 h-16 bg-black/60 border-2",
                        active
                          ? "border-white opacity-100"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      ].join(" ")}
                    >
                      {m.type === "video" ? (
                        <video
                          src={m.src}
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                          preload="metadata"
                          muted
                          playsInline
                        />
                      ) : thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        />
                      ) : null}
                      {/* type badge in the corner */}
                      <span className="absolute bottom-1 right-1 z-10 inline-flex items-center justify-center rounded bg-black/70 p-0.5 text-white">
                        {m.type === "video"   && <VideoIcon className="w-3 h-3" />}
                        {m.type === "youtube" && <YoutubeIcon className="w-3 h-3" />}
                        {m.type === "image"   && <ImageIcon className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
        </div>

        {/* footer spacer */}
        <div className="h-3 sm:h-4" />
      </div>
    </div>
  );
}

/* ---------- Contact Form (isolated; focus-safe) ---------- */
const ContactFormCard = memo(function ContactFormCard() {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/movlrwyk";
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle");
  const honeypotRef = useRef(null);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => (p[name] === value ? p : { ...p, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (honeypotRef.current && honeypotRef.current.value) { setFormStatus("success"); return; }
    setFormStatus("sending");
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      if (formData.company) fd.append("company", formData.company);
      fd.append("message", formData.message);
      fd.append("_subject", `Portfolio inquiry from ${formData.name}`);

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        try {
          const data = await res.json();
          if (data?.errors?.length) console.error("Formspree errors:", data.errors.map((er) => er.message).join(", "));
        } catch {}
        setFormStatus("error");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setFormStatus("error");
    }
  }, [formData]);

  const stopAll = useCallback((e) => e.stopPropagation(), []);

  return (
    <Card
      className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]"
      onClickCapture={stopAll}
      onMouseDownCapture={stopAll}
      onFocusCapture={stopAll}
      onKeyDownCapture={stopAll}
    >
      <CardContent className="p-6 sm:p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6" noValidate>
          <input ref={honeypotRef} name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="group rounded-2xl border border-white/10 bg-white/5/50 hover:border-white/20 focus-within:border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-colors">
              <label htmlFor="cf-name" className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-white px-4 pt-3">
                Your name
              </label>
              <div className="px-4 pb-4 pt-1">
                <input
                  id="cf-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-0 px-3"
                />
              </div>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5/50 hover:border-white/20 focus-within:border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-colors">
              <label htmlFor="cf-email" className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-white px-4 pt-3">
                Email
              </label>
              <div className="px-4 pb-4 pt-1">
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-0 px-3"
                />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/5/50 hover:border-white/20 focus-within:border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-colors">
            <label htmlFor="cf-company" className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-white px-4 pt-3">
              Company (optional)
            </label>
            <div className="px-4 pb-4 pt-1">
              <input
                id="cf-company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="h-11 w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-0 px-3"
              />
            </div>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/5/50 hover:border-white/20 focus-within:border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-colors">
            <label htmlFor="cf-message" className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-white px-4 pt-3">
              Project brief
            </label>
            <div className="px-4 pb-4 pt-1">
              <textarea
                id="cf-message"
                name="message"
                rows={8}
                required
                value={formData.message}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-0 px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-white" aria-live="polite">
              {formStatus === "success" && "Thanks! I’ll get back to you soon."}
              {formStatus === "error" && "Something went wrong. Please try again."}
              {formStatus === "idle" && "By sending, you agree to be contacted back."}
              {formStatus === "sending" && "Sending…"}
            </p>
            <Button
              type="submit"
              disabled={formStatus === "sending"}
              className="rounded-full bg-white text-black hover:bg-gray-100 px-6 py-2 h-11 shadow-[0_6px_20px_-6px_rgba(255,255,255,0.35)]"
            >
              {formStatus === "sending" ? "Sending…" : "Send"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

/* ---------- helpers ---------- */
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }) : "";

/* ---------- Page ---------- */
export default function App() {
  const [projects] = useState(projectsData);
  const [lightbox, setLightbox] = useState({ open: false, project: null, index: 0 });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const marquee = useMemo(() => ["3ds Max","Maya","Blender","Substance","Unreal Engine","Unity","ZBrush","Clo3D"], []);

  // Blog (latest 3)
  const [blog, setBlog] = useState({ items: [], status: "idle" });

  const [hovered, setHovered] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRefs = useRef({});
  // A card "plays" when hovered (desktop), when it's the initial first card
  // (so something is moving on first paint), or when it's the spotlit card
  // in the centre of the viewport.
  const isPlaying = (i) => (hovered === i) || (!hasInteracted && i === 0) || (spotlitIndex === i);

  // Spotlight whichever work-card is most centered in the viewport. While a
  // card is "spotlit" its veil + overlay text + media badge fade out so the
  // raw image/video reads as the focal element. Other cards stay normal.
  // (Effect itself lives further down so it can depend on `gridReady`.)
  const [spotlitIndex, setSpotlitIndex] = useState(null);
  const cardRefs = useRef({});

  // NEW: mobile/coarse-pointer detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mqWidth  = window.matchMedia("(max-width: 767px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const apply = () => setIsMobile(mqWidth.matches || mqCoarse.matches);
    apply();
    mqWidth.addEventListener?.("change", apply);
    mqCoarse.addEventListener?.("change", apply);
    mqWidth.addListener?.(apply);
    mqCoarse.addListener?.(apply);
    return () => {
      mqWidth.removeEventListener?.("change", apply);
      mqCoarse.removeEventListener?.("change", apply);
      mqWidth.removeListener?.(apply);
      mqCoarse.removeListener?.(apply);
    };
  }, []);

  // Spotlight state (mobile)
  const [activeCard, setActiveCard] = useState(null);       // which card is spotlighted
  const [cardMediaIdx, setCardMediaIdx] = useState({});     // per-card media index while spotlighted
  const touchRef = useRef({});                               // per-card touch state

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, el]) => {
      if (!el) return;
      const i = Number(idx);
      if (isPlaying(i)) {
        // Force muted at the DOM level — React's declarative `muted` prop
        // doesn't always sync, and unmuted autoplay is blocked.
        el.muted = true;
        el.playsInline = true;
        el.play?.().catch(() => {});
      } else {
        el.pause?.();
      }
    });
  }, [hovered, hasInteracted, spotlitIndex]);

  // Vertical stack: every project is its own full-width hero at its native
  // aspect ratio. No horizontal neighbours to fight with, so the eye reads
  // one piece at a time and the spotlight effect lands cleanly.
  const spanFor = () => "";

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // aspect ratios so cards are stable
  const [ratios, setRatios] = useState([]);
  const [gridReady, setGridReady] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const tasks = projects.map(async (p) => {
        const m = p.media?.[0];
        if (!m) return 16/9;
        const direct = normRatio(m.ratio);
        if (direct) return direct;
        if (m.type === "youtube") return 16/9;
        if (m.type === "video" && m.src) return await loadVideoRatio(m.src);
        if (m.type === "image" && m.src) return await loadImageRatio(m.src);
        return 16/9;
      });
      const arr = await Promise.all(tasks);
      if (!live) return;
      setRatios(arr);
      setGridReady(true);
    })();
    return () => { live = false; };
  }, [projects]);

  // Spotlight observer — set up once the cards are rendered (gridReady).
  useEffect(() => {
    if (!gridReady) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = null;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            const idx = entry.target.getAttribute("data-card-index");
            bestIndex = idx === null ? null : Number(idx);
          }
        });
        setSpotlitIndex((prev) => (bestIndex === null ? prev : bestIndex));
      },
      {
        // Centre band = middle 20% of the viewport.
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    const els = Object.values(cardRefs.current).filter(Boolean);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [gridReady, projects.length]);

  // -------- BLOG FEED (robust path + URL fixing) --------
  useEffect(() => {
    let alive = true;
    const join = (a, b) => (a.endsWith("/") ? a : a + "/") + b.replace(/^\/+/, "");
    const BASE = (import.meta.env?.BASE_URL ?? "/");
    const FEED_URL = join(BASE, "blog/feed.json");

    const resolveFromBlog = (p) => {
      if (!p) return "";
      if (/^https?:\/\//i.test(p)) return p;
      if (p.startsWith("/")) return join(BASE, p.slice(1));
      return join(BASE, "blog/" + p);
    };

    (async () => {
      try {
        setBlog((b) => ({ ...b, status: "loading" }));
        const res = await fetch(FEED_URL, {
          headers: { Accept: "application/feed+json, application/json" },
          cache: "no-cache",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const feed = await res.json();

        const itemsRaw = Array.isArray(feed?.items) ? feed.items : [];
        const items = itemsRaw
          .slice()
          .sort((a, b) => new Date(b.date_published || b.date_modified || 0) - new Date(a.date_published || a.date_modified || 0))
          .map((it, idx) => ({
            id: it.id || it.url || `post-${idx}`,
            title: it.title || "Untitled",
            summary: it.summary || it.content_text || "",
            date_published: it.date_published || it.date_modified || "",
            tags: it.tags || [],
            url: resolveFromBlog(it.url || it.external_url || "#"),
            image: resolveFromBlog(it.image || it.banner_image || ""),
          }))
          .slice(0, 3);

        if (alive) setBlog({ items, status: "ready" });
      } catch (e) {
        console.error("Blog feed load failed:", e);
        if (alive) setBlog({ status: "ready", items: [] });
      }
    })();

    return () => { alive = false; };
  }, []);

  // ----- swipe helpers (grid) -----
  const nextProject = (current, dir, len) => {
    const ni = (current + dir + len) % len;
    setActiveCard(ni);
    setHovered(ni);
    setHasInteracted(true);
  };
  const nextMedia = (cardIdx, dir, mediaLen) => {
    setCardMediaIdx((prev) => {
      const cur = prev[cardIdx] ?? 0;
      const ni = (cur + dir + mediaLen) % mediaLen;
      return { ...prev, [cardIdx]: ni };
    });
  };

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700/60 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className={`${container} h-16 flex items-center justify-between gap-3`}>
          <a href="#top" className="display-serif font-medium tracking-tight text-xl md:text-2xl lowercase">daninverno</a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#work" className="hover:opacity-80">Work</a>
            <a href="#blog" className="hover:opacity-80">Blog</a>
            <a href="#about" className="hover:opacity-80">About</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="rounded-full bg-[var(--accent)] text-black hover:bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium">
              <a href="#contact" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Hire me</a>
            </Button>
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              {mobileNavOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur"
          >
            <div className={`${container} py-3 flex flex-col`}>
              {[
                ["Work", "#work"],
                ["Blog", "#blog"],
                ["About", "#about"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileNavOpen(false)}
                  className="py-3 text-base text-gray-100 hover:text-white border-b border-white/5 last:border-b-0"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        {/* h-[100svh] (small viewport height) instead of dvh — Samsung Internet
            recomputes dvh when its toolbar shows/hides, which reflows the page
            and causes a visible scroll jump after refresh. svh is the fixed
            "minimum visible viewport" so the layout is stable. */}
        <div className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/og-cover.png"
              className="absolute inset-0 h-full w-full object-cover"
              src="/archviz.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />
          </div>

          <div className="relative z-10 h-full">
            <div className={`${container} h-full flex items-center pt-16`}>
              <div className="max-w-3xl text-white">
                <span className="eyebrow">00 — Daniel Inverno</span>
                <h1 className="display-serif mt-3 text-5xl sm:text-7xl md:text-[5.5rem] font-medium leading-[0.96] tracking-tight">
                  3D Artist &amp; Indie Game Dev
                </h1>
                <p className="mt-6 inline-flex items-center gap-2 text-sm text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  Available for new projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills marquee */}
      <section className="border-y border-white/5">
        <SpotlightMarquee
          items={[
            "Blender", "Maya", "3ds Max", "ZBrush",
            "Substance Designer", "Substance Painter",
            "Unreal Engine", "Blueprints", "Python",
            "Photoshop", "Illustrator", "DaVinci Resolve",
            "Inventor", "Corona Renderer",
            "Texturing", "Retopology", "UV Mapping", "PBR", "Rendering",
          ]}
          direction="left"
          duration={60}
          rowClassName="h-14 border-b border-white/5"
          itemClassName="text-base font-medium tracking-wide"
          gapPx={56}
        />
        <SpotlightMarquee
          items={[
            "Communication", "Creativity", "Curiosity", "Adaptability",
            "Efficiency Seeking", "Attention to Detail",
            "Mentorship", "Problem Solving", "Leadership",
          ]}
          direction="right"
          duration={50}
          rowClassName="h-12"
          itemClassName="display-serif text-sm italic"
          gapPx={64}
          activeClassName="text-[var(--accent)]"
        />
      </section>

      {/* Work */}
      <section id="work" className="theme-work section-surface py-24 md:py-32 text-gray-100">
        <div className={container}>
          <div className="text-center">
            <span className="eyebrow">01 — Work</span>
            <h2 className="section-title mt-3 text-3xl sm:text-5xl tracking-tight">
              Portfolio Projects
            </h2>
          </div>

          {!gridReady ? (
            <p className="mt-14 text-center text-gray-200/80">Loading projects…</p>
          ) : (
            <div className="mt-14 md:mt-16 lg:mt-20 mx-auto max-w-5xl grid grid-cols-1 gap-10 md:gap-14">
              {projects.map((p, i) => {
                const k = `${p.title}-${i}`;
                const mediaIdx = (isMobile && activeCard === i && p.media.length > 0) ? (cardMediaIdx[i] ?? 0) : 0;
                const first = p.media[mediaIdx];
                const isYT  = first?.type === "youtube";
                const isMP4 = first?.type === "video";
                const isIMG = first?.type === "image";
                const playing = (hovered === i) || (!hasInteracted && i === 0) || (spotlitIndex === i);

                const ratioNum = ratios[i] ?? (16/9);
                const ratioStr = ratioString(ratioNum);
                const ytPrefer = Math.abs(ratioNum - 16/9) < 0.05 ? "maxres" : "hq";

                // touch handlers per card
                const onTouchStart = (e) => {
                  if (!isMobile) return;
                  const t = e.changedTouches[0];
                  touchRef.current[i] = { x: t.clientX, y: t.clientY, moved: false, when: Date.now() };
                };
                const onTouchMove = (e) => {
                  if (!isMobile) return;
                  const st = touchRef.current[i];
                  if (!st) return;
                  const t = e.changedTouches[0];
                  const dx = t.clientX - st.x;
                  const dy = t.clientY - st.y;
                  if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
                    st.moved = true;
                    e.preventDefault?.();
                  }
                };
                const onTouchEnd = (e) => {
                  if (!isMobile) return;
                  const st = touchRef.current[i];
                  delete touchRef.current[i];
                  if (!st) return;
                  const t = e.changedTouches[0];
                  const dx = t.clientX - st.x;
                  const dy = t.clientY - st.y;
                  const dt = Date.now() - st.when;
                  const SWIPE_TH = 40;
                  const TAP_TH   = 8;

                  if (Math.abs(dx) > SWIPE_TH && Math.abs(dx) > Math.abs(dy)) {
                    if (activeCard === i) {
                      if (p.media.length > 1) {
                        nextMedia(i, dx < 0 ? +1 : -1, p.media.length);
                      }
                    } else {
                      nextProject(i, dx < 0 ? +1 : -1, projects.length);
                    }
                    return;
                  }

                  // tap
                  if (Math.abs(dx) < TAP_TH && Math.abs(dy) < TAP_TH && dt < 400) {
                    if (activeCard !== i) {
                      setActiveCard(i);
                      setHovered(i);
                      setHasInteracted(true);
                    } else {
                      const idx = cardMediaIdx[i] ?? 0;
                      setLightbox({ open: true, project: p, index: idx });
                    }
                  }
                };

                const isSpotlit = spotlitIndex === i;

                return (
                  <motion.div
                    key={k}
                    ref={(el) => { if (el) cardRefs.current[i] = el; else delete cardRefs.current[i]; }}
                    data-card-index={i}
                    className={`${spanFor(i)}`}
                    onMouseEnter={() => { setHovered(i); setHasInteracted(true); }}
                    onMouseLeave={() => setHovered(null)}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-12% 0px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${p.title} gallery`}
                      className={[
                        // No overflow-hidden on the Card — that would clip the
                        // spotlight ring/glow that lives on the inner media
                        // box. The media box clips its own content.
                        "group relative cursor-pointer transition-all duration-300",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                        isMobile && activeCard === i ? "scale-[0.98]" : ""
                      ].join(" ")}
                      onClick={() => {
                        if (!isMobile) {
                          setLightbox({ open: true, project: p, index: mediaIdx });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setLightbox({ open: true, project: p, index: mediaIdx });
                        }
                      }}
                    >
                      <CardContent className="p-0 relative">
                        {/* Media box: keep the source's native aspect, but
                            cap the height at 85vh so a portrait piece can't
                            blow taller than the viewport on 1080p. The
                            matching max-width = 85vh × ratio keeps the box
                            proportional even when the height cap kicks in.
                            Spotlight (brass ring + glow) lives here so it
                            hugs the image, not the caption below. */}
                        <div
                          className={[
                            "relative w-full mx-auto overflow-hidden transition-all duration-300",
                            isSpotlit
                              ? "ring-2 ring-[var(--accent)] shadow-[0_0_80px_-10px_var(--accent)]"
                              : "",
                            isMobile && activeCard === i ? "ring-2 ring-white/50" : "",
                          ].join(" ")}
                          style={{
                            aspectRatio: ratioStr,
                            maxHeight: "85vh",
                            maxWidth: `calc(85vh * ${ratioNum})`,
                            touchAction: "pan-y",
                          }}
                          onTouchStart={onTouchStart}
                          onTouchMove={onTouchMove}
                          onTouchEnd={onTouchEnd}
                        >
                          {/* MP4 */}
                          {isMP4 && (
                            <video
                              ref={(el) => (videoRefs.current[i] = el)}
                              src={first.src}
                              poster={first.poster || undefined}
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                              preload="metadata"
                              muted
                              playsInline
                              loop={first.loop !== false}
                            />
                          )}

                          {/* YouTube */}
                          {isYT && (
                            playing ? (
                              <iframe
                                src={ytEmbedMuted(first.src, origin)}
                                title={p.title}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                              />
                            ) : (
                              <img
                                src={ytThumb(first.src, { prefer: ytPrefer }) || ""}
                                alt={p.title}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                draggable={false}
                              />
                            )
                          )}

                          {/* Still image */}
                          {isIMG && (
                            <img
                              src={first.src}
                              alt={p.title}
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                          )}

                          {/* Multiple-items marker */}
                          {p.media?.length > 1 && <MediaBadge media={p.media} hidden={isSpotlit} />}


                          {/* center play cue — desktop only; on mobile the
                              cards are too narrow and the cue overlapped tags
                              and titles. Mobile users tap to spotlight. */}
                          {!playing && !isMobile && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center text-white">
                                <PlayIcon className="w-9 h-9" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Title / tags / blurb — flat caption beneath the
                            image. No panel chrome — just a thin top rule
                            separating image from text, matching the image's
                            sharp/flat aesthetic. */}
                        <div
                          className="mx-auto mt-4 md:mt-5 pt-4 md:pt-5 border-t border-white/15 text-white"
                          style={{ maxWidth: `calc(85vh * ${ratioNum})` }}
                        >
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {p.tags?.map((t) => (
                              <span key={t} className="px-2 py-1 rounded-full text-xs border border-white/30 bg-white/10">{t}</span>
                            ))}
                          </div>
                          <h3 className="display-serif text-xl md:text-3xl font-medium tracking-tight">{p.title}</h3>
                          <p className="mt-2 text-sm md:text-base text-gray-300 max-w-xl">{p.blurb}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="theme-blog section-surface py-24 md:py-32 border-t border-white/5 text-gray-100">
        <div className={container}>
          <div className="text-center">
            <span className="eyebrow">02 — Journal</span>
            <h2 className="section-title mt-3 text-3xl sm:text-5xl tracking-tight">
              Latest from the Dev Blog
            </h2>
          </div>

          {blog.status === "loading" && (
            <p className="mt-8 text-center text-gray-200/80">Loading…</p>
          )}

          {blog.status === "ready" && (
            <div className="mt-14 md:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blog.items.map((post) => (
                <Card key={post.id} className="rounded-3xl border-white/15 bg-black/20 overflow-hidden">
                  <CardContent className="p-0">
                    {post.image ? (
                      <img src={post.image} alt="" className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-black/30 to-black/10" />
                    )}
                    <div className="p-6 flex flex-col gap-3">
                      <div className="text-xs text-gray-200/80">{fmtDate(post.date_published || post.date_modified)}</div>
                      <h3 className="text-xl font-semibold leading-tight">{post.title}</h3>
                      {post.summary && <p className="text-sm text-gray-100/90 line-clamp-3">{post.summary}</p>}
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {post.tags.slice(0, 4).map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-full text-[11px] border border-white/20 text-gray-100/90">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3">
                        <Button asChild variant="ghost" className="px-0 h-auto text-gray-100 hover:text-white">
                          <a href={post.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1">
                            Read article
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full bg-white text-black hover:bg-gray-100 px-6 py-2 h-11">
              <a href="/blog/">View all posts</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="theme-about section-surface py-24 md:py-32 border-t border-white/5 text-gray-100">
        <div className={container}>
          <div className="text-center">
            <span className="eyebrow">03 — About</span>
            <h2 className="section-title mt-3 text-3xl sm:text-5xl tracking-tight">
              About
            </h2>
          </div>

          <div className="mt-14 md:mt-16 lg:mt-20 grid">
            <div className="mx-auto max-w-3xl text-gray-100/90 leading-relaxed space-y-6 text-center">
              <p>I’m Daniel Inverno, a 3D artist, game tinkerer, and pipeline nerd. Born in Portugal and now based in the Netherlands, I have contributed to luxury brand projects with Platforme. Today I focus on indie game art direction, creating efficient pipelines and playful interactive design. I keep things fast, clean, and always fun to explore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="theme-contact section-surface py-24 md:py-32 text-gray-100 border-t border-white/5">
        <div className={container}>
          <div className="text-center">
            <span className="eyebrow">04 — Contact</span>
            <h2 className="section-title mt-3 text-3xl sm:text-5xl tracking-tight">
              Contact
            </h2>
          </div>


          <div className="mt-10 md:mt-12 lg:mt-14 grid">
            <div className="mx-auto w-full max-w-3xl">
              <ContactFormCard />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className={`${container} flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400`}>
          <div className="flex items-center gap-3">
            <span className="display-serif text-base lowercase text-white/90">daninverno</span>
            <span className="h-px w-8 bg-[var(--accent)]" />
            <span>© {new Date().getFullYear()}</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        open={lightbox.open}
        project={lightbox.project}
        startIndex={lightbox.index}
        onClose={() => setLightbox({ open: false, project: null, index: 0 })}
      />
    </div>
  );
}

