import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { Textarea } from "@/components/ui/Textarea.jsx";
import {
  ArrowRight, Mail, Sparkles, Linkedin, Instagram, Twitter, ChevronRight,
  Play as PlayIcon, X as XIcon, ChevronLeft, ChevronRight as CaretRight
} from "lucide-react";

/* ---------- helpers ---------- */
const safeURL = (s) => { try { return new URL(s); } catch { return null; } };
const extractYouTubeId = (u) => {
  const x = safeURL(u); if (!x) return null;
  if (x.hostname === "youtu.be") return x.pathname.slice(1);
  const v = x.searchParams.get("v");
  if (v) return v;
  const parts = x.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
  return idx !== -1 ? parts[idx + 1] : parts.pop();
};
const ytThumb = (u, { prefer = "hq" } = {}) => {
  const id = extractYouTubeId(u);
  if (!id) return null;
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

/* ---------- theme ---------- */
const colors = {
  primary: "from-gray-200 to-gray-400",
  background: "bg-gradient-to-b from-black via-gray-900 to-gray-800",
  text: "text-gray-100",
};

/* ---------- YOUR PROJECTS (edit me) ---------- */
const projectsData = [
  {
    title: "Hard-Surface Breakdown",
    tags: ["ArtStation", "YouTube"],
    blurb: "Process, blockout → polish.",
    link: "https://www.artstation.com/artwork/XXXXX",
    media: [
      { type: "youtube", src: "https://youtu.be/ZfSN77J8tL4", ratio: "16 / 9" },
      { type: "image", src: "https://i.ytimg.com/vi/ZfSN77J8tL4/maxresdefault.jpg" },
      { type: "image", src: "https://picsum.photos/seed/hs-1/1600/900" },
    ],
  },
  {
    title: "Realtime Turntable",
    tags: ["MP4", "Realtime"],
    blurb: "Direct .mp4 capture.",
    link: "#",
    media: [
      {
        type: "video",
        src: "https://cdn.artstation.com/p/video_sources/002/776/666/0000-0119-2.mp4",
        poster: "https://picsum.photos/seed/manualvideo/2000/1200",
        loop: true,
      },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/584/large/dan-inverno-unknown.jpg?1754904217" },
    ],
  },
  {
    title: "Image Study",
    tags: ["Still"],
    blurb: "Lighting & materials study.",
    link: "#",
    media: [
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/090/780/581/large/dan-inverno-render00-final.jpg?1754901377" },
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/780/444/large/dan-inverno-screenshot-2025-08-11-102910.jpg?1754901019" },
    ],
  },
];

/* ---------- Lightbox (gallery: never full-screen; bottom bar visible) ---------- */
function Lightbox({ open, onClose, project, startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, t: 0 });

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

  const renderMedia = (m) => {
    if (!m) return null;
    if (m.type === "image") {
      return (
        <div className="h-full w-full grid place-items-center">
          <img src={m.src} alt={project.title} className="max-h-full max-w-full object-contain" draggable={false} />
        </div>
      );
    }
    if (m.type === "video") {
      return (
        <div className="h-full w-full grid place-items-center">
          <video src={m.src} poster={m.poster || undefined} className="max-h-full max-w-full object-contain" controls autoPlay playsInline />
        </div>
      );
    }
    if (m.type === "youtube") {
      const src = ytEmbedModal(m.src, origin);
      return (
        <div className="h-full w-full grid place-items-center">
          <div className="max-h-full max-w-full" style={{ aspectRatio: m.ratio || "16 / 9", height: "100%" }}>
            <iframe
              src={src}
              title={project.title}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const Thumb = ({ m, idx }) => {
    const isActive = idx === index;
    const base = "relative shrink-0 rounded-lg overflow-hidden border";
    const active = isActive ? "border-white" : "border-white/20 hover:border-white/40";
    const size = "h-16 w-24";
    if (m.type === "image") {
      return (
        <button onClick={() => setIndex(idx)} className={`${base} ${active} ${size}`} aria-label={`Go to image ${idx + 1}`}>
          <img src={m.src} alt="" className="h-full w-full object-cover" />
        </button>
      );
    }
    if (m.type === "video") {
      const thumb = m.poster || project.media.find(x => x.type === "image")?.src;
      return (
        <button onClick={() => setIndex(idx)} className={`${base} ${active} ${size}`} aria-label={`Go to video ${idx + 1}`}>
          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-800" />}
          <span className="absolute inset-0 grid place-items-center bg-black/30 text-white text-xs">▶︎</span>
        </button>
      );
    }
    if (m.type === "youtube") {
      const thumb = ytThumb(m.src, { prefer: "hq" }) || ytThumb(m.src, { prefer: "maxres" });
      return (
        <button onClick={() => setIndex(idx)} className={`${base} ${active} ${size}`} aria-label={`Go to YouTube ${idx + 1}`}>
          {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-800 grid place-items-center text-white text-xs">YT</div>}
          <span className="absolute inset-0 grid place-items-center bg-black/30 text-white text-xs">▶︎</span>
        </button>
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

        {/* media */}
        <div className="relative min-h-0">
          <div className="h-[60dvh] sm:h-[64dvh] md:h-[66dvh] lg:h-[68dvh] xl:h-[70dvh]">
            {renderMedia(current)}
            {media.length > 1 && (
              <>
                <button
                  type="button" aria-label="Previous"
                  onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button" aria-label="Next"
                  onClick={() => setIndex((i) => (i + 1) % media.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                  <CaretRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* thumbnails */}
        {media.length > 1 && (
          <div className="px-3 sm:px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {media.map((m, idx) => <Thumb key={idx} m={m} idx={idx} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function PortfolioSlideshowBlackGreyFull() {
  const [projects] = useState(projectsData);
  const [lightbox, setLightbox] = useState({ open: false, project: null, index: 0 });
  const marquee = useMemo(() => ["3ds Max","Maya","Blender","Substance","Unreal Engine","Unity","ZBrush","Clo3D"], []);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // HOVER PLAY LOGIC
  // Only first plays on load; after first user hover, nothing autoplays unless hovered.
  const [hovered, setHovered] = useState(null);        // number | null
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRefs = useRef({});                         // { [index:number]: HTMLVideoElement | null }

  const isPlaying = (i) => (hovered === i) || (!hasInteracted && i === 0);

  // Drive native video play/pause whenever state changes
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, el]) => {
      if (!el) return;
      const i = Number(idx);
      if (isPlaying(i)) {
        el.play?.().catch(() => {});
      } else {
        el.pause?.();
      }
    });
  }, [hovered, hasInteracted]);

  const spanFor = (i) =>
    i % 4 === 0 ? "lg:col-span-7" :
    i % 4 === 1 ? "lg:col-span-5" :
    i % 4 === 2 ? "lg:col-span-5" : "lg:col-span-7";

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700/60 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight text-lg md:text-xl">Daniel Inverno</a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#work" className="hover:opacity-80">Work</a>
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
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" src="/your-video-filename.mp4" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Available for freelance in 2025
              </div>
              <h1 className="mt-4 text-4xl sm:text-6xl md:text-7xl font-semibold leading-[0.98] tracking-tight">
                3D Artist & Hard-Surface <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>Designer</span>
              </h1>
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
              marquee.map((m, i) => (
                <span key={`${j}-${i}`} className="tracking-wide">{m}</span>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Work Grid */}
      <section id="work" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-10">Selected Work</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            {projects.map((p, i) => {
              const k = `${p.title}-${i}`;
              const first = p.media[0];
              const isYT  = first?.type === "youtube";
              const isMP4 = first?.type === "video";
              const isIMG = first?.type === "image";
              const playing = isPlaying(i);

              return (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={spanFor(i)}
                >
                  <Card
                    className="overflow-hidden rounded-3xl border-gray-700 group bg-gray-900 relative"
                    onMouseEnter={() => { setHovered(i); setHasInteracted(true); }}
                    onMouseLeave={() => setHovered(null)}
                    onTouchStart={() => { setHovered(i); setHasInteracted(true); }}
                  >
                    <CardContent className="p-0 relative">
                      <div className="relative w-full" style={isYT ? { aspectRatio: first.ratio || "16 / 9" } : undefined}>
                        {/* MP4 */}
                        {isMP4 && (
                          <video
                            ref={(el) => (videoRefs.current[i] = el)}
                            src={first.src}
                            poster={first.poster || undefined}
                            className="block w-full h-auto object-cover"
                            preload="none"
                            muted
                            playsInline
                            loop={first.loop !== false}
                            onClick={() => setLightbox({ open: true, project: p, index: 0 })}
                          />
                        )}

                        {/* YouTube: mount iframe only when playing; else show thumbnail */}
                        {isYT && (
                          playing ? (
                            <iframe
                              src={ytEmbedMuted(first.src, origin)}
                              title={p.title}
                              className="absolute inset-0 w-full h-full"
                              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                              loading="lazy"
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          ) : (
                            <img
                              src={ytThumb(first.src) || ""}
                              alt={p.title}
                              className="block w-full h-auto object-cover"
                              draggable={false}
                              onClick={() => setLightbox({ open: true, project: p, index: 0 })}
                            />
                          )
                        )}

                        {/* Image */}
                        {isIMG && (
                          <img
                            src={first.src}
                            alt={p.title}
                            className="block w-full h-auto object-cover"
                            onClick={() => setLightbox({ open: true, project: p, index: 0 })}
                          />
                        )}

                        {/* GREY VEIL: visible when not playing */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-70"} bg-black`}
                          aria-hidden="true"
                        />

                        {/* Hover cue when inactive */}
                        {!playing && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center text-white">
                              <PlayIcon className="w-8 h-8" />
                            </div>
                          </div>
                        )}

                        {/* Text overlay */}
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {p.tags?.map((t) => (
                              <span key={t} className="px-2 py-1 rounded-full text-xs border border-white/30 bg-black/40 backdrop-blur">{t}</span>
                            ))}
                          </div>
                          <h3 className="text-xl md:text-2xl font-semibold">{p.title}</h3>
                          <p className="mt-2 text-sm md:text-base text-gray-300 max-w-xl">{p.blurb}</p>
                          {p.link && (
                            <a
                              href={p.link} target="_blank" rel="noopener noreferrer"
                              className="inline-block mt-3 text-sm underline decoration-gray-500 hover:decoration-gray-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Open project ↗
                            </a>
                          )}
                        </div>

                        {/* Click anywhere opens lightbox */}
                        <button
                          type="button"
                          onClick={() => setLightbox({ open: true, project: p, index: 0 })}
                          className="absolute inset-0 z-10"
                          aria-label={`Open ${p.title} gallery`}
                          style={{ cursor: "zoom-in", background: "transparent" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 md:py-28 border-t border-gray-700">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">About</h2>
            </div>
            <div className="md:col-span-7 text-gray-300 leading-relaxed space-y-6">
              <p>I’m Daniel, a 3D artist focused on hard-surface and real-time assets. I’ve shipped content for games, ads, fashion, and interactive media. My approach is simple: clean topology, strong silhouettes, and materials that read instantly.</p>
              <p>Recent explorations include translating Akari-style logic into volumetric 3D puzzles, and building modular kits that scale from prototypes to production.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Contact</h2>
              <div className="mt-6 flex gap-4 text-sm text-gray-400">
                <a href="#" className="inline-flex items-center gap-2 hover:opacity-75"><Linkedin className="h-4 w-4" />LinkedIn</a>
                <a href="#" className="inline-flex items-center gap-2 hover:opacity-75"><Instagram className="h-4 w-4" />Instagram</a>
                <a href="#" className="inline-flex items-center gap-2 hover:opacity-75"><Twitter className="h-4 w-4" />X/Twitter</a>
              </div>
            </div>
            <div className="md:col-span-7">
              <Card className="rounded-3xl border-gray-700 bg-gray-900">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input placeholder="Your name" required className="h-11 rounded-xl bg-gray-800 border-gray-600 text-gray-200" />
                      <Input type="email" placeholder="Email" required className="h-11 rounded-xl bg-gray-800 border-gray-600 text-gray-200" />
                    </div>
                    <Input placeholder="Company (optional)" className="h-11 rounded-xl bg-gray-800 border-gray-600 text-gray-200" />
                    <Textarea placeholder="Project brief" rows={6} className="rounded-xl bg-gray-800 border-gray-600 text-gray-200" />
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-gray-500">By sending, you agree to be contacted back.</p>
                      <Button type="submit" className="rounded-full bg-gray-200 text-black hover:bg-white px-4 py-2">Send</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Daniel Inverno. All rights reserved.</p>
          <nav className="flex items-center gap-6">
            <a href="#work" className="hover:opacity-80">Work</a>
            <a href="#about" className="hover:opacity-80">About</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
          </nav>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <Lightbox
        open={lightbox.open}
        project={lightbox.project}
        startIndex={lightbox.index}
        onClose={() => setLightbox({ open: false, project: null, index: 0 })}
      />
    </div>
  );
}
