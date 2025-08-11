import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button.jsx";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { Textarea } from "@/components/ui/Textarea.jsx";
import {
  ArrowRight,
  Mail,
  Sparkles,
  Linkedin,
  Instagram,
  Twitter,
  ChevronRight,
  Pause,
  Play as PlayIcon,
} from "lucide-react";

// Black & Grey color palette
const colors = {
  primary: "from-gray-200 to-gray-400",
  background: "bg-gradient-to-b from-black via-gray-900 to-gray-800",
  text: "text-gray-100",
};

// Reverted to the original project data for the work grid
const projects = [
  {
    title: "Crystal Grid — Light Puzzle",
    tags: ["Game Art", "3D", "Shaders"],
    img: "https://picsum.photos/seed/crystal/2000/1200",
    blurb: "A stylized real‑time environment exploring emissive crystals and light propagation puzzles.",
  },
  {
    title: "Hard‑Surface Drone Kit",
    tags: ["Hard Surface", "Sub‑D", "Texturing"],
    img: "https://picsum.photos/seed/drone/2000/1200",
    blurb: "Modular drone kit with interchangeable payloads, optimized for real‑time engines.",
  },
  {
    title: "Fashion Vis — Clo3D Capsule",
    tags: ["Clo3D", "Lookbook", "Render"],
    img: "https://picsum.photos/seed/fashion/2000/1200",
    blurb: "Digital garments rendered for an editorial lookbook with procedural fabrics.",
  },
  {
    title: "Akari — 3D Puzzle Prototype",
    tags: ["Gameplay", "Level Design", "UE"],
    img: "https://picsum.photos/seed/akari/2000/1200",
    blurb: "Translating paper‑puzzle logic into spatial 3D levels with atmospheric lighting.",
  },
];

const marquee = [
  "3ds Max",
  "Maya",
  "Blender",
  "Substance",
  "Unreal Engine",
  "Unity",
  "ZBrush",
  "Clo3D",
];

export default function PortfolioSlideshowBlackGreyFull() {
  // All slideshow state and logic has been removed.

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
            {/* --- VIDEO BACKGROUND --- */}
            {/* Change "your-video-filename.mp4" to the name of the file you uploaded. */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src="/your-video-filename.mp4" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-3xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Available for freelance in 2025
              </div>
              <h1 className={`mt-4 text-4xl sm:text-6xl md:text-7xl font-semibold leading-[0.98] tracking-tight`}>
                3D Artist & Hard‑Surface <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}>Designer</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 max-w-2xl">
                Clean topology. Strong silhouettes. Real‑time ready. I design modular kits, polished lookbooks, and readable game assets.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full bg-gray-200 text-black hover:bg-white px-6 py-3">
                  <a href="#work" className="flex items-center gap-2">View Work <ArrowRight className="h-4 w-4" /></a>
                </Button>
                <Button variant="secondary" asChild size="lg" className="rounded-full border border-gray-300 text-gray-100 hover:bg-gray-700 px-6 py-3">
                  <a href="#about" className="flex items-center gap-2">About <ChevronRight className="h-4 w-4" /></a>
                </Button>
              </div>
              {/* The slideshow controls have been removed */}
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
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`${i % 4 === 0 ? "lg:col-span-7" : i % 4 === 1 ? "lg:col-span-5" : i % 4 === 2 ? "lg:col-span-5" : "lg:col-span-7"}`}
              >
                <Card className="overflow-hidden rounded-3xl border-gray-700 group bg-gray-900">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img src={p.img} alt={p.title} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {p.tags.map((t) => (
                            <span key={t} className="px-2 py-1 rounded-full text-xs border border-white/30 bg-black/40 backdrop-blur">
                              {t}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold">{p.title}</h3>
                        <p className="mt-2 text-sm md:text-base text-gray-300 max-w-xl">{p.blurb}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              <p>I’m Daniel, a 3D artist focused on hard‑surface and real‑time assets. I’ve shipped content for games, ads, fashion, and interactive media. My approach is simple: clean topology, strong silhouettes, and materials that read instantly.</p>
              <p>Recent explorations include translating Akari‑style logic into volumetric 3D puzzles, and building modular kits that scale from prototypes to production.</p>
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
    </div>
  );
}