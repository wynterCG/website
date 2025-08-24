import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import {
  Mail, Sparkles,
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
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1&rel=0${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`;
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
    title: "Can Game - Prototype",
    tags: ["Indie Dev", "UE5", "Game Art"],
    blurb: "Process, blockout.",
    link: "https://www.artstation.com/artwork/XXXXX",
    media: [
      { type: "youtube", src: "https://youtu.be/ZfSN77J8tL4", ratio: "16 / 9" },
      { type: "image", src: "https://i.ytimg.com/vi/ZfSN77J8tL4/maxresdefault.jpg" },
    ],
  },
  {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Materials, lighting & rendering.",
    link: "#",
    poster: "/posters/Mochis.png",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/679/0811-1.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/658/ghfjgfj.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/661/water.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/671/ergershf.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/669/0000-0119-1.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/659/0000-0119-3.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/667/gummy-2.mp4", ratio: "16 / 9"},
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/670/0000-0119.mp4", ratio: "16 / 9"},
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
  {
    title: "Lapis Lazuli - Substance Designer Material",
    tags: ["Materials","Product Visualization","Rendering"],
    blurb: "Materials, lighting & rendering.",
    link: "#",
    media: [
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/090/780/581/large/dan-inverno-render00-final.jpg?1754901377" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/780/444/large/dan-inverno-screenshot-2025-08-11-102910.jpg?1754901019" },
    ],
  },
  {
    title: "Phyllotaxis and Archimedean Spiral Generator - Substance Designer",
    tags: ["Procedural", "Substance Designer", "Technical Art"],
    blurb: "Spiral generator in Substance Designer with fxmaps.",
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
    title: "Mix of overwatch/world of warcraft environment unreal engine",
    tags: ["Game Art","Hand painted","UE5","Environment"],
    blurb: "Game art environment with ue5.",
    link: "#",
    media: [
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/030/977/060/large/dan-wynter-highresscreenshot00002.jpg?1602204167" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/030/977/130/large/dan-wynter-highresscreenshot00003.jpg?1602204731" },
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/030/977/373/large/dan-wynter-highresscreenshot00005.jpg?1602205532" },
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/030/977/233/large/dan-wynter-highresscreenshot00004.jpg?1602205044" },
    ],
  },
  {
    title: "Yves Saint Laurent MYSLF Le Parfum",
    tags: ["Materials","Product Visualization","Rendering"],
    blurb: "Materials, lighting & rendering.",
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
    title: "Modern House 4k - Archviz ue5",
    tags: ["Archviz", "UE5", "Environment"],
    blurb: "3D Modern house based on archdaily project.",
    link: "#",
    poster: "posters/Archviz.png",
    media: [{ type: "youtube", src: "https://www.youtube.com/watch?v=B7W1erPk05c", ratio: "16 / 9" }],
  },
  {
    title: "Snake Fountain Stylized",
    tags: ["Game Art","Hand painted","Stylized","Environment"],
    blurb: "Hand painted Textures.",
    link: "#",
    media: [{ type: "image", src: "/posters/Snake.png" }],
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

function MediaBadge({ media }) {
  const c = mediaCounts(media);
  return (
    <div className="absolute top-3 right-3 z-30 rounded-full border border-white/20 bg-black/60 backdrop-blur px-3 py-1 text-[11px] text-white/95 flex items-center gap-2">
      <span className="font-semibold">{c.total}</span>
      <span className="opacity-80">items</span>
      <span className="h-3.5 w-px bg-white/25 mx-1" />
      {c.video ?   <span className="flex items-center gap-1 opacity-95">{iconForType("video")}{c.video}</span> : null}
      {c.youtube ? <span className="flex items-center gap-1 opacity-95">{iconForType("youtube")}{c.youtube}</span> : null}
      {c.image ?   <span className="flex items-center gap-1 opacity-95">{iconForType("image")}{c.image}</span> : null}
    </div>
  );
}

/* ---------- Lightbox (centered, no-crop; chips on hover desktop / toggle mobile) ---------- */
function Lightbox({ open, onClose, project, startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex);
  const [vidError, setVidError] = useState({});
  const [showChips, setShowChips] = useState(false); // mobile toggle
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

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
            src={m.src}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
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
      const poster =
        m.poster || project.media.find((x) => x.type === "image")?.src || project.poster || undefined;

      return (
        <Wrap>
          <video
            className="absolute inset-0 w-full h-full object-contain bg-black"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={poster}
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
          <div className="text-sm sm:text-base truncate">{project.title}</div>
          <button
            ref={closeBtnRef} type="button" onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white border border-white/30 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* media area */}
        <div className="relative min-h-0">
          <div className="h-[70dvh] sm:h-[70dvh] md:h-[72dvh] lg:h-[72dvh]">
            {renderMedia(current)}

            {/* desktop chips: show on hover/focus */}
            {media.length > 1 && (
              <div
                role="tablist"
                aria-label="Media items"
                className="
                  pointer-events-auto
                  absolute inset-x-0 bottom-0 hidden md:flex
                  items-center justify-center gap-6 px-4 py-3
                  bg-gradient-to-t from-black/70 to-transparent
                  opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity
                "
              >
                {media.map((m, idx) => {
                  const active = idx === index;
                  const label =
                    m.type === "video"   ? `Video ${idx+1}` :
                    m.type === "youtube" ? `YouTube ${idx+1}` :
                    m.type === "image"   ? `Image ${idx+1}` : `Item ${idx+1}`;
                  return (
                    <button
                      key={idx}
                      role="tab"
                      aria-selected={active}
                      aria-current={active ? "true" : undefined}
                      aria-label={label}
                      onClick={() => setIndex(idx)}
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
                        active
                          ? "bg-white text-black border-white"
                          : "bg-black/50 text-white border-white/30 hover:bg-black/70"
                      ].join(" ")}
                    >
                      {m.type === "video" && <VideoIcon className="w-3.5 h-3.5" />}
                      {m.type === "youtube" && <YoutubeIcon className="w-3.5 h-3.5" />}
                      {m.type === "image" && <ImageIcon className="w-3.5 h-3.5" />}
                      <span className="text-xs opacity-90">{label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* mobile: FAB toggle for chips */}
            {media.length > 1 && (
              <>
                <button
                  type="button"
                  className="md:hidden absolute bottom-4 right-4 z-40 rounded-full px-4 py-2 text-xs font-medium bg-white text-black shadow"
                  aria-expanded={showChips}
                  aria-controls="lb-chipbar"
                  onClick={() => setShowChips((s) => !s)}
                >
                  Media ({media.length})
                </button>

                <div
                  id="lb-chipbar"
                  className={`md:hidden absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/85 to-black/30 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform ${showChips ? "translate-y-0" : "translate-y-full"}`}
                >
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                    {media.map((m, idx) => {
                      const active = idx === index;
                      const label =
                        m.type === "video"   ? `Video ${idx+1}` :
                        m.type === "youtube" ? `YouTube ${idx+1}` :
                        m.type === "image"   ? `Image ${idx+1}` : `Item ${idx+1}`;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setIndex(idx); setShowChips(false); }}
                          className={[
                            "whitespace-nowrap inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
                            active
                              ? "bg-white text-black border-white"
                              : "bg-black/50 text-white border-white/30"
                          ].join(" ")}
                        >
                          {m.type === "video" && <VideoIcon className="w-3.5 h-3.5" />}
                          {m.type === "youtube" && <YoutubeIcon className="w-3.5 h-3.5" />}
                          {m.type === "image" && <ImageIcon className="w-3.5 h-3.5" />}
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

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
                  className="h-11 w-full rounded-xl bg-gray-200 border border-gray-700/60 text-gray-600 placeholder:text-gray-500 focus:border-gray-500 focus:ring-0 px-3"
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
                  className="h-11 w-full rounded-xl bg-gray-200 border border-gray-700/60 text-gray-600 placeholder:text-gray-500 focus:border-gray-500 focus:ring-0 px-3"
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
                className="h-11 w-full rounded-xl bg-gray-200 border border-gray-700/60 text-gray-600 placeholder:text-gray-500 focus:border-gray-500 focus:ring-0 px-3"
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
                className="w-full rounded-xl bg-gray-200 border border-gray-700/60 text-gray-600 placeholder:text-white focus:border-gray-500 focus:ring-0 px-3 py-2"
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
  const marquee = useMemo(() => ["3ds Max","Maya","Blender","Substance","Unreal Engine","Unity","ZBrush","Clo3D"], []);

  // Blog (latest 3)
  const [blog, setBlog] = useState({ items: [], status: "idle" });

  const [hovered, setHovered] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRefs = useRef({});
  const isPlaying = (i) => (hovered === i) || (!hasInteracted && i === 0);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, el]) => {
      if (!el) return;
      const i = Number(idx);
      if (isPlaying(i)) { el.play?.().catch(() => {}); } else { el.pause?.(); }
    });
  }, [hovered, hasInteracted]);

  const spanFor = (i) =>
    i % 4 === 0 ? "lg:col-span-7" :
    i % 4 === 1 ? "lg:col-span-5" :
    i % 4 === 2 ? "lg:col-span-5" : "lg:col-span-7";

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
        if (m.type === "video")   return 16/9;
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

  // -------- BLOG FEED (robust path + URL fixing) --------
  useEffect(() => {
    let alive = true;

    // join helper
    const join = (a, b) => (a.endsWith("/") ? a : a + "/") + b.replace(/^\/+/, "");
    const BASE = (import.meta.env?.BASE_URL ?? "/"); // works in Vite dev & build
    const FEED_URL = join(BASE, "blog/feed.json");

    const resolveFromBlog = (p) => {
      if (!p) return "";
      if (/^https?:\/\//i.test(p)) return p;              // absolute http(s)
      if (p.startsWith("/")) return join(BASE, p.slice(1)); // absolute-from-root inside this site
      return join(BASE, "blog/" + p);                     // relative to /blog/
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
            // resolve urls so they work from the landing page
            url: resolveFromBlog(it.url || it.external_url || "#"),
            image: resolveFromBlog(it.image || it.banner_image || ""),
          }))
          .slice(0, 3);

        if (alive) setBlog({ items, status: "ready" });
      } catch (e) {
        console.error("Blog feed load failed:", e);
        if (alive) {
          // graceful fallback (same shape as mapped items)
          setBlog({
            status: "ready",
            items: [
              {
                id: "sample-1",
                url: join(BASE, "blog/"),
                title: "Volumetric logic dev diary",
                summary: "Translating Akari-style constraints into a readable 3D grid with light paths.",
                date_published: "2025-07-22T10:00:00Z",
                tags: ["Unreal", "Design"],
                image: "",
              },
              {
                id: "sample-2",
                url: join(BASE, "blog/"),
                title: "Hard-surface toolkit notes",
                summary: "Bevel strategies, trim sheets, and boolean hygiene for clean silhouettes.",
                date_published: "2025-08-05T10:00:00Z",
                tags: ["Blender", "Workflow"],
                image: "",
              },
              {
                id: "sample-3",
                url: join(BASE, "blog/"),
                title: "Clo3D → Unreal lookdev",
                summary: "Quick pipeline tests moving garments into a real-time lighting setup.",
                date_published: "2025-07-01T10:00:00Z",
                tags: ["Clo3D", "Unreal"],
                image: "",
              },
            ],
          });
        }
      }
    })();

    return () => { alive = false; };
  }, []);

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700/60 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className={`${container} h-16 flex items-center justify-between`}>
          <a href="#top" className="font-semibold tracking-tight text-lg md:text-xl">Daniel Inverno</a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#work" className="hover:opacity-80">Work</a>
            <a href="#blog" className="hover:opacity-80">Blog</a>
            <a href="#about" className="hover:opacity-80">About</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
          </nav>
          <Button asChild className="rounded-full bg-gray-200 text-black hover:bg-white px-4 py-2 text-sm">
            <a href="#contact" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Hire me</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative pt-24 md:pt-28">
        <div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src="/your-video-filename.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 h-full">
            <div className={`${container} h-full flex items-center`}>
              <div className="max-w-3xl text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> Looking for New Projects
                </div>
                <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-semibold leading-[0.98] tracking-tight">
                  3D Artist & Indie Game Dev
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills marquee */}
      <section className="py-6 border-y border-gray-700">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap text-sm text-gray-400 px-4"
            animate={{ x: [0, -600] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {Array.from({ length: 2 }).flatMap((_, j) =>
              ["3ds Max","Maya","Blender","Substance","Unreal Engine","Unity","ZBrush","Clo3D"].map((m, i) => (
                <span key={`${j}-${i}`} className="tracking-wide">{m}</span>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="theme-work section-surface py-24 md:py-32 text-gray-100">
        <div className={container}>
          <h2 className="section-title text-center text-3xl sm:text-5xl font-semibold tracking-tight">
            Portfolio Projects
          </h2>

          {!gridReady ? (
            <p className="mt-14 text-center text-gray-2 00/80">Loading projects…</p>
          ) : (
            <div className="mt-14 md:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
              {projects.map((p, i) => {
                const k = `${p.title}-${i}`;
                const first = p.media[0];
                const isYT  = first?.type === "youtube";
                const isMP4 = first?.type === "video";
                const isIMG = first?.type === "image";
                const playing = (hovered === i) || (!hasInteracted && i === 0);

                const ratioNum = ratios[i] ?? (16/9);
                const ratioStr = ratioString(ratioNum);
                const ytPrefer = Math.abs(ratioNum - 16/9) < 0.05 ? "maxres" : "hq";

                return (
                  <div
                    key={k}
                    className={`${spanFor(i)}`}
                    onMouseEnter={() => { setHovered(i); setHasInteracted(true); }}
                    onMouseLeave={() => setHovered(null)}
                    onTouchStart={() => { setHovered(i); setHasInteracted(true); }}
                  >
                    <Card
                      className="overflow-hidden rounded-3xl border-white/10 group bg-black/20 relative cursor-pointer"
                      onClick={() => setLightbox({ open: true, project: p, index: 0 })}
                    >
                      <CardContent className="p-0 relative">
                        {/* Fixed-size media box */}
                        <div className="relative w-full" style={{ aspectRatio: ratioStr }}>
                          {/* MP4 */}
                          {isMP4 && (
                            <video
                              ref={(el) => (videoRefs.current[i] = el)}
                              src={first.src}
                              poster={first.poster || p.poster || (p.media.find(x => x.type === "image")?.src) || undefined}
                              className="absolute inset-0 w-full h-full object-cover"
                              preload="none"
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
                                className="absolute inset-0 w-full h-full"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                              />
                            ) : (
                              <img
                                src={ytThumb(first.src, { prefer: ytPrefer }) || ""}
                                alt={p.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                draggable={false}
                              />
                            )
                          )}

                          {/* Still image */}
                          {isIMG && (
                            <img
                              src={first.src}
                              alt={p.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}

                          {/* Multiple-items marker */}
                          {p.media?.length > 1 && <MediaBadge media={p.media} />}
                          {p.media?.length > 1 && !playing && (
                            <div className="absolute bottom-3 right-3 z-30 flex gap-1.5">
                              {p.media.slice(0,3).map((_,idx)=>(
                                <span key={idx} className="h-1.5 w-1.5 rounded-full bg-white/70"></span>
                              ))}
                            </div>
                          )}

                          {/* veil (slightly lighter) */}
                          <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-30"} bg-black`} />

                          {/* overlay text */}
                          <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 text-white bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                            <div className="flex gap-2 mb-3 flex-wrap">
                              {p.tags?.map((t) => (
                                <span key={t} className="px-2 py-1 rounded-full text-xs border border-white/30 bg-black/40 backdrop-blur">{t}</span>
                              ))}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-semibold">{p.title}</h3>
                            <p className="mt-2 text-sm md:text-base text-gray-300 max-w-xl">{p.blurb}</p>
                          </div>

                          {/* center play cue */}
                          {!playing && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center text-white">
                                <PlayIcon className="w-9 h-9" />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="theme-blog section-surface py-24 md:py-32 border-t border-white/10 text-gray-100">
        <div className={container}>
          <h2 className="section-title text-center text-3xl sm:text-5xl font-semibold tracking-tight">
            Latest from the Dev Blog
          </h2>

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
      <section id="about" className="theme-about section-surface py-24 md:py-32 border-t border-white/10 text-gray-100">
        <div className={container}>
          <h2 className="section-title text-center text-3xl sm:text-5xl font-semibold tracking-tight">
            About
          </h2>

          <div className="mt-14 md:mt-16 lg:mt-20 grid">
            <div className="mx-auto max-w-3xl text-gray-100/90 leading-relaxed space-y-6 text-center">
              <p>I’m Daniel, a 3D artist focused on hard-surface and real-time assets. I’ve shipped content for games, ads, fashion, and interactive media. My approach is simple: clean topology, strong silhouettes, and materials that read instantly.</p>
              <p>Recent explorations include translating Akari-style logic into volumetric 3D puzzles, and building modular kits that scale from prototypes to production.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="theme-contact section-surface py-24 md:py-32 text-gray-100">
        <div className={container}>
          <h2 className="section-title text-center text-3xl sm:text-5xl font-semibold tracking-tight">
            Contact
          </h2>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-100/90">
            <a href="#" className="hover:opacity-80">LinkedIn</a>
            <a href="#" className="hover:opacity-80">Instagram</a>
            <a href="#" className="hover:opacity-80">X/Twitter</a>
          </div>

          <div className="mt-10 md:mt-12 lg:mt-14 grid">
            <div className="mx-auto w-full max-w-3xl">
              <ContactFormCard />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-700">
        <div className={`${container} flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400`}>
          <p>© {new Date().getFullYear()} Daniel Inverno. All rights reserved.</p>
          <nav className="flex items-center gap-6">
            <a href="#work" className="hover:opacity-80">Work</a>
            <a href="#blog" className="hover:opacity-80">Blog</a>
            <a href="#about" className="hover:opacity-80">About</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
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

