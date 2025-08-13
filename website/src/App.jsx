import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import {
  Mail, Sparkles,
  Play as PlayIcon, X as XIcon, ChevronLeft, ChevronRight as CaretRight
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
    blurb: "Process, blockout",
    link: "https://www.artstation.com/artwork/XXXXX",
    media: [
      { type: "youtube", src: "https://youtu.be/ZfSN77J8tL4", ratio: "16 / 9" },
      { type: "image", src: "https://i.ytimg.com/vi/ZfSN77J8tL4/maxresdefault.jpg" },
    ],
  },
  {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Lighting & rendering.",
    link: "#",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4", ratio: "16 / 9"},
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
   {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Lighting & rendering.",
    link: "#",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4", ratio: "16 / 9"},
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
   {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Lighting & rendering.",
    link: "#",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4", ratio: "16 / 9"},
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
   {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Lighting & rendering.",
    link: "#",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4", ratio: "16 / 9"},
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
   {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Lighting & rendering.",
    link: "#",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4", ratio: "16 / 9"},
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
   {
    title: "Mochis",
    tags: ["Product Visualization", "Blender", "Materials"],
    blurb: "Lighting & rendering.",
    link: "#",
    media: [
      { type: "video", src: "https://cdn.artstation.com/p/video_sources/002/776/695/0811-2.mp4", ratio: "16 / 9"},
      { type: "image", src: "https://cdna.artstation.com/p/assets/images/images/090/781/582/large/dan-inverno-mochi.jpg?1754904212" },
    ],
  },
  /*{
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
    ],
  },*/
  {
    title: "Image Study",
    tags: ["Still"],
    blurb: "Lighting & materials study.",
    link: "#",
    media: [
      { type: "image", src: "https://cdnb.artstation.com/p/assets/images/images/090/780/581/large/dan-inverno-render00-final.jpg?1754901377" },
    ],
  },
];

/* ---------- Lightbox ---------- */
function Lightbox({ open, onClose, project, startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex);
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
          <video src={m.src} poster={m.poster || undefined} className="max-h-full max-w-full object-contain" controls autoPlay playsInline muted />
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
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
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
    if (m.type === "image") return (
      <button onClick={() => setIndex(idx)} className={`${base} ${active} ${size}`} aria-label={`Go to image ${idx + 1}`}>
        <img src={m.src} alt="" className="h-full w-full object-cover" />
      </button>
    );
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
        <div className="p-3 sm:p-4 flex items-center justify-between gap-3 text-gray-2 00">
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

/* ---------- Contact Form (isolated to prevent re-mounts; focus-safe) ---------- */
const ContactFormCard = memo(function ContactFormCard() {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/movlrwyk";
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error
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
          {/* Honeypot (hidden) */}
          <input
            ref={honeypotRef}
            name="_gotcha"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Row: Name + Email */}
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

          {/* Company */}
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

          {/* Project brief */}
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

          {/* Footer */}
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

  // Hover preview
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

  // Fetch blog feed
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setBlog((b) => ({ ...b, status: "loading" }));
        const res = await fetch("/blog/feed.json", { headers: { Accept: "application/feed+json, application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const feed = await res.json();
        const items = (feed?.items || [])
          .slice()
          .sort((a, b) => new Date(b.date_published || b.date_modified || 0) - new Date(a.date_published || a.date_modified || 0))
          .slice(0, 3);
        if (alive) setBlog({ items, status: "ready" });
      } catch {
        if (alive) setBlog({
          status: "ready",
          items: [
            {
              id: "sample-1",
              url: "/blog/",
              title: "Volumetric logic dev diary",
              summary: "Translating Akari-style constraints into a readable 3D grid with light paths.",
              date_published: "2025-07-22T10:00:00Z",
              tags: ["Unreal", "Design"],
            },
            {
              id: "sample-2",
              url: "/blog/",
              title: "Hard-surface toolkit notes",
              summary: "Bevel strategies, trim sheets, and boolean hygiene for clean silhouettes.",
              date_published: "2025-08-05T10:00:00Z",
              tags: ["Blender", "Workflow"],
            },
            {
              id: "sample-3",
              url: "/blog/",
              title: "Clo3D → Unreal lookdev",
              summary: "Quick pipeline tests moving garments into a real-time lighting setup.",
              date_published: "2025-07-01T10:00:00Z",
              tags: ["Clo3D", "Unreal"],
            },
          ]
        });
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

      {/* Work (SECTION THEME) */}
      <section id="work" className="theme-work section-surface py-24 md:py-32 text-gray-100">
        <div className={container}>
          <h2 className="section-title text-center text-3xl sm:text-5xl font-semibold tracking-tight">
            Portfolio Projects
          </h2>

          <div className="mt-14 md:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            {projects.map((p, i) => {
              const k = `${p.title}-${i}`;
              const first = p.media[0];
              const isYT  = first?.type === "youtube";
              const isMP4 = first?.type === "video";
              const isIMG = first?.type === "image";
              const playing = (hovered === i) || (!hasInteracted && i === 0);

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
                      <div className="relative w-full">
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
                          />
                        )}
                        {isYT && (
                          playing ? (
                            <div className="relative w-full" style={{ aspectRatio: first.ratio || "16 / 9" }}>
                              <iframe
                                src={ytEmbedMuted(first.src, origin)}
                                title={p.title}
                                className="absolute inset-0 w-full h-full"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                              />
                            </div>
                          ) : (
                            <img
                              src={ytThumb(first.src) || ""}
                              alt={p.title}
                              className="block w-full h-auto object-cover"
                              draggable={false}
                            />
                          )
                        )}
                        {isIMG && (
                          <img
                            src={first.src}
                            alt={p.title}
                            className="block w-full h-auto object-cover"
                          />
                        )}

                        <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-70"} bg-black`} />

                        <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 text-white bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {p.tags?.map((t) => (
                              <span key={t} className="px-2 py-1 rounded-full text-xs border border-white/30 bg-black/40 backdrop-blur">{t}</span>
                            ))}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-semibold">{p.title}</h3>
                          <p className="mt-2 text-sm md:text-base text-gray-300 max-w-xl">{p.blurb}</p>
                        </div>

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
        </div>
      </section>

      {/* Blog (SECTION THEME) */}
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

      {/* About (SECTION THEME) */}
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

      {/* Contact (SECTION THEME) */}
      <section id="contact" className="theme-contact section-surface py-24 md:py-32 text-gray-100">
        <div className={container}>
          <h2 className="section-title text-center text-3xl sm:text-5xl font-semibold tracking-tight">
            Contact
          </h2>

          {/* Centered socials under title */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-100/90">
            <a href="#" className="hover:opacity-80">LinkedIn</a>
            <a href="#" className="hover:opacity-80">Instagram</a>
            <a href="#" className="hover:opacity-80">X/Twitter</a>
          </div>

          {/* Form */}
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

