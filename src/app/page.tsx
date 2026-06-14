"use client";

// Performance constraints: DOM mutations for high-frequency loops (timers, SVGs) 
// bypass React's render phase. Animations utilize composite-only CSS properties.

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight, BrainCircuit, Layers, Activity,
  CheckSquare, Timer, Repeat, BarChart2, UserPlus, Target, Play,
} from "lucide-react";

// Shared animation variants
const FADE_UP = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-0.5 left-0 w-full h-[0.35em] bg-blue-600 -z-10 rounded-sm" />
    </span>
  );
}

// Word rotator synced with underline layout
const WORDS = ["profundidad.", "precisión.", "intención.", "claridad."];

function RotatingWord() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % WORDS.length), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-white inline-block"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
      <span className="absolute bottom-0.5 left-0 w-full h-[0.35em] bg-blue-600 -z-10 rounded-sm" />
    </span>
  );
}

// Single RAF pomodoro to avoid batching lag
const POMO_TOTAL = 25 * 60;
const POMO_SPEED = 150; 
const POMO_R = 80;
const POMO_CIRC = 2 * Math.PI * POMO_R;

function PomodoroDisplay() {
  const secsRef = useRef(POMO_TOTAL);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const svgArcRef = useRef<SVGCircleElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const [flash, setFlash] = useState(false);
  const flashing = useRef(false);

  const tick = useCallback((now: number) => {
    const delta = lastRef.current ? (now - lastRef.current) / 1000 : 0;
    lastRef.current = now;

    if (flashing.current) { 
      rafRef.current = requestAnimationFrame(tick); 
      return; 
    }

    secsRef.current = Math.max(0, secsRef.current - delta * POMO_SPEED);
    const s = secsRef.current;

    if (svgArcRef.current) {
      const offset = POMO_CIRC * (1 - s / POMO_TOTAL);
      svgArcRef.current.style.strokeDashoffset = String(offset);
    }
    
    if (timeRef.current) {
      const m = String(Math.floor(s / 60)).padStart(2, "0");
      const sec = String(Math.floor(s % 60)).padStart(2, "0");
      timeRef.current.textContent = `${m}:${sec}`;
    }

    if (s <= 0) {
      flashing.current = true;
      setFlash(true);
      setTimeout(() => {
        secsRef.current = POMO_TOTAL;
        lastRef.current = 0;
        flashing.current = false;
        setFlash(false);
      }, 700);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  return (
    <div className="flex items-center justify-center w-full h-full"
      style={{ filter: flash ? "brightness(2.2)" : "none", transition: "filter 0.25s" }}>
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={POMO_R} fill="none" stroke="#27272a" strokeWidth="7" />
          <circle
            ref={svgArcRef}
            cx="100" cy="100" r={POMO_R} fill="none" stroke="white" strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={POMO_CIRC}
            strokeDashoffset="0"
          />
        </svg>
        <div className="relative z-10 text-center">
          <span ref={timeRef} className="text-4xl font-bold text-white font-mono tabular-nums">25:00</span>
          <p className="text-[10px] text-zinc-500 mt-1.5 uppercase tracking-widest">Enfoque</p>
        </div>
      </div>
    </div>
  );
}

// Vertical infinite list
const TASKS = [
  { text: "Desplegar backend en Vercel", s: "done" },
  { text: "Actualizar repositorio servicio social", s: "doing" },
  { text: "Revisar PR #42 — auth middleware", s: "todo" },
  { text: "Documentar API endpoints", s: "done" },
  { text: "Configurar CI/CD pipeline", s: "doing" },
  { text: "Refactorizar módulo de pagos", s: "todo" },
  { text: "Code review — feature/dashboard", s: "done" },
];

const BADGE = {
  done:  { label: "Done",  cls: "bg-zinc-800 text-zinc-500" },
  doing: { label: "Doing", cls: "bg-blue-900/60 text-blue-400" },
  todo:  { label: "To Do", cls: "bg-zinc-800/60 text-zinc-400" },
} as const;

type TStatus = keyof typeof BADGE;

function TaskCarousel() {
  const IH = 56;
  const items = [...TASKS, ...TASKS];
  
  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-zinc-900/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-zinc-900/80 to-transparent z-10 pointer-events-none" />
      <motion.ul
        animate={{ y: [0, -(IH * TASKS.length)] }}
        transition={{ duration: 16, ease: "linear", repeat: Infinity }}
        className="px-6 pt-4"
      >
        {items.map((t, idx) => (
          <li key={idx} style={{ height: IH }} className="flex items-center gap-3 border-b border-zinc-800/60">
            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${t.s === "done" ? "bg-white border-white" : "border-zinc-600"}`}>
              {t.s === "done" && (
                <svg className="w-2.5 h-2.5 text-zinc-900" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <span className={`text-sm flex-1 truncate ${t.s === "done" ? "text-zinc-500 line-through" : t.s === "doing" ? "text-blue-400" : "text-zinc-300"}`}>{t.text}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${BADGE[t.s as TStatus].cls}`}>
              {BADGE[t.s as TStatus].label}
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

// Habit dot staggered visualization
const HABITS = [
  { label: "Entrenamiento tren superior", f: 3 },
  { label: "Aportación ETFs / inversión",  f: 1 },
  { label: "Bloque de lectura 30 min",     f: 5 },
  { label: "Revisión semanal de tareas",   f: 2 },
];

function HabitDot({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      animate={filled ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
      transition={filled ? { duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" } : {}}
      className={`w-5 h-5 rounded-sm ${filled ? "bg-white" : "bg-zinc-800"}`}
    />
  );
}

function HabitsVisual() {
  return (
    <div className="w-3/4 space-y-4 relative z-10">
      {HABITS.map((h, i) => (
        <div key={i} className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
          <span className="text-sm text-white truncate mr-4">{h.label}</span>
          <div className="flex gap-1 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, j) => (
              <HabitDot key={j} filled={j < h.f} delay={j * 0.4 + i * 0.1} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// SVG performance chart
const CHART_DATA = [
  { day: "L", focus: 42, avg: 18 },
  { day: "M", focus: 68, avg: 22 },
  { day: "X", focus: 55, avg: 20 },
  { day: "J", focus: 83, avg: 25 },
  { day: "V", focus: 91, avg: 23 },
  { day: "S", focus: 74, avg: 21 },
  { day: "D", focus: 100, avg: 28 },
];

function AnalyticsChart() {
  const ref = useRef<SVGPathElement>(null);
  const ref2 = useRef<SVGPathElement>(null);
  const isVisible = useInView({ current: ref.current?.closest("div") as HTMLElement | null }, { once: true });

  const W = 320; const H = 140; const PAD = 20;
  const maxV = 100;
  const pts = (key: "focus" | "avg") =>
    CHART_DATA.map((d, i) => ({
      x: PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2),
      y: H - PAD - (d[key] / maxV) * (H - PAD * 2),
    }));

  const smooth = (points: { x: number; y: number }[]) =>
    points.reduce((acc, p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `${acc} C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
    }, "");

  const focusPath = smooth(pts("focus"));
  const avgPath = smooth(pts("avg"));

  useEffect(() => {
    if (!isVisible) return;
    [ref.current, ref2.current].forEach((el) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: 1800, easing: "cubic-bezier(0.22,1,0.36,1)", fill: "forwards",
      });
    });
  }, [isVisible]);

  return (
    <div className="relative z-10 w-full px-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Horas de enfoque — semana</p>
        <div className="flex items-center gap-4 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />PlanIt</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-zinc-600 inline-block rounded" />Promedio</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={`${focusPath} L ${W - PAD} ${H - PAD} L ${PAD} ${H - PAD} Z`} fill="url(#focusGrad)" />
        <path ref={ref2} d={avgPath} fill="none" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={focusPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" filter="url(#glow)" />
        <path ref={ref} d={focusPath} fill="none" stroke="#60a5fa" strokeWidth="2" />
        {pts("focus").map((p, i) => (
          <text key={i} x={p.x} y={H - 4} textAnchor="middle" className="fill-zinc-600" style={{ fontSize: 9, fontFamily: "inherit" }}>
            {CHART_DATA[i].day}
          </text>
        ))}
        {pts("focus").map((p, i) => (
          <motion.circle key={i} cx={p.x} cy={p.y} r={3} fill="#3b82f6"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 1.2 + i * 0.08, duration: 0.3, ease: "backOut" }} />
        ))}
      </svg>
    </div>
  );
}

// Continuous marque slider
const TESTIMONIALS = [
  { quote: "Como desarrollador, el cambio de contexto me estaba matando. Tener tareas y timer en la misma pantalla ha multiplicado mi producción de código útil.", name: "Andrés M.", role: "Software Engineer" },
  { quote: "PlanIt consolidó 3 apps en una. Registro mi lectura, sesiones universitarias y tareas en un solo flujo. No volvería a las herramientas tradicionales.", name: "Sofía C.", role: "Ingeniería de Sistemas" },
  { quote: "Interfaz limpia y totalmente libre de ruido. Ahora estructuro mi día de manera mecánica sin gastar energía mental en decidir qué sigue.", name: "Carlos R.", role: "Indie Maker" },
  { quote: "Probé Notion y Todoist. Ninguno poseía un timer integrado y funcional que no te bombardeara con notificaciones. Esto lo resuelve elegante.", name: "Diego F.", role: "Full-Stack Developer" },
  { quote: "La combinación perfecta entre hábitos y bloques de concentración. El modo oscuro está diseñado magistralmente para trabajar de noche.", name: "Marta G.", role: "Data Scientist" },
];

function TestimonialsSlider() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  
  return (
    <div className="w-full relative overflow-hidden rounded-3xl pb-4">
      <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
        className="flex gap-6 w-max px-6"
      >
        {items.map((t, i) => (
          <div key={i} className="w-[360px] flex-shrink-0 p-8 rounded-3xl bg-[#0f0f11] border border-white/5 shadow-lg cursor-pointer hover:border-blue-500/20 transition-colors">
            <p className="text-zinc-300 text-sm leading-relaxed mb-8">"{t.quote}"</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white font-bold">
                {t.name[0]}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-zinc-500 text-xs">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Interactive Problem Cards
const PROBLEM_CARDS = [
  {
    icon: <Layers className="w-7 h-7 text-white" strokeWidth={1.5} />,
    title: "Sobrecarga de herramientas",
    body: "Saltar entre gestor de tareas, temporizador y hojas de cálculo agota tu energía mental antes de empezar.",
    accent: "from-violet-500/20 via-blue-500/5 to-transparent",
  },
  {
    icon: <BrainCircuit className="w-7 h-7 text-white" strokeWidth={1.5} />,
    title: "Fricción cognitiva",
    body: "Interfaces saturadas de colores y menús compiten por tu atención, imposibilitando el enfoque sostenido.",
    accent: "from-blue-500/20 via-violet-500/5 to-transparent",
  },
  {
    icon: <Activity className="w-7 h-7 text-white" strokeWidth={1.5} />,
    title: "Desconexión de rutinas",
    body: "Separar trabajo de objetivos personales crea una falsa dicotomía. Tu capacidad de enfoque depende de tus hábitos.",
    accent: "from-indigo-500/20 via-blue-500/5 to-transparent",
  },
];

function ProblemCard({ icon, title, body, accent }: typeof PROBLEM_CARDS[0]) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="relative rounded-2xl overflow-hidden cursor-default"
      style={{ cursor: "default" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-zinc-900/50 border border-zinc-800 transition-colors duration-300"
        style={{ borderColor: hovered ? "rgba(139,92,246,0.4)" : "" }} />
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 bg-gradient-to-br ${accent} pointer-events-none`}
      />
      <motion.div
        animate={{ x: hovered ? 20 : 0, y: hovered ? -20 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/10 blur-2xl pointer-events-none"
      />
      <div className="relative z-10 p-8 flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}

// Navigation
const NAV_LINKS = [
  { label: "El problema",      id: "problema" },
  { label: "Características",  id: "caracteristicas" },
  { label: "Reseñas",          id: "resenias" },
  { label: "Sobre nosotros",   id: "sobre-nosotros" },
];

function Nav() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-12 py-6 max-w-[1400px] mx-auto w-full pointer-events-none"
    >
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2 cursor-pointer pointer-events-auto"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
          <div className="w-2 h-2 bg-[#0A0A0B] rounded-sm" />
        </div>
        PlanIt
      </motion.div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 pointer-events-auto">
        {NAV_LINKS.map((l) => (
          <button key={l.id} onClick={() => go(l.id)}
            className="hover:text-white transition-colors cursor-pointer">
            {l.label}
          </button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        className="text-xs font-bold tracking-wide uppercase border border-zinc-700 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer pointer-events-auto"
      >
        Comenzar
      </motion.button>
    </motion.nav>
  );
}

function FeatureRow({ title, accent, body, visual, reverse = false }: {
  title: string; accent: string; body: string; visual: React.ReactNode; reverse?: boolean;
}) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
      variants={STAGGER}
      className={`flex flex-col items-center gap-12 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <div className="flex-1 space-y-5">
        <motion.h3 variants={FADE_UP} className="text-4xl font-bold text-white leading-tight">
          {title} <Accent>{accent}</Accent>
        </motion.h3>
        <motion.p variants={FADE_UP} className="text-zinc-400 text-lg leading-relaxed">{body}</motion.p>
      </div>
      <motion.div variants={FADE_UP}
        className="flex-1 w-full aspect-[4/3] bg-zinc-900/50 rounded-2xl border border-zinc-800 relative overflow-hidden shadow-2xl flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-blue-900/10 pointer-events-none" />
        {visual}
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0A0A0B] selection:bg-blue-500/30"
      style={{ cursor: "default" }}>
      <Nav />
      <div className="fixed top-[-20%] left-[10%] w-[50vw] h-[50vw] bg-blue-600/8 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[60%] right-[-10%] w-[40vw] h-[40vw] bg-violet-700/8 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero */}
      <motion.main initial="hidden" animate="visible" variants={STAGGER}
        className="w-full max-w-[1200px] mx-auto px-6 pt-40 pb-32 z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
          <motion.h1 variants={FADE_UP}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] text-white mb-6">
            Organiza tu mente ahora.<br className="hidden md:block" />
            Ejecuta en <RotatingWord />
          </motion.h1>
          <motion.p variants={FADE_UP} className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
            PlanIt unifica tareas, bloques de tiempo y hábitos en un ecosistema libre de fricción. Diseñado para eliminar el ruido y mantenerte en la zona.
          </motion.p>
          <motion.button variants={FADE_UP} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-white text-[#0A0A0B] px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide cursor-pointer">
            Prueba PlanIt Gratis <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
        <motion.div variants={FADE_UP}
          className="hidden md:block flex-1 aspect-[4/3] rounded-2xl bg-zinc-900/30 border border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-blue-600/8 to-transparent" />
        </motion.div>
      </motion.main>

      {/* Problem */}
      <section id="problema" className="w-full max-w-[1200px] mx-auto px-6 pb-24 z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={STAGGER} className="text-center mb-16">
          <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            ¿Por qué falla tu <Accent>productividad?</Accent>
          </motion.h2>
          <motion.p variants={FADE_UP} className="text-zinc-400 text-lg max-w-2xl mx-auto">
            El entorno moderno está diseñado para fracturar tu atención. Las herramientas tradicionales solo empeoran el problema.
          </motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={STAGGER} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEM_CARDS.map((c, i) => (
            <motion.div key={i} variants={FADE_UP}>
              <ProblemCard {...c} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="caracteristicas" className="w-full max-w-[1200px] mx-auto px-6 py-24 z-10 space-y-32">
        <FeatureRow
          title="Gestión de tareas" accent="minimalista"
          body="Captura ideas y organiza tu sprint sin menús infinitos. Define prioridad, asigna estado — To Do, Doing, Done — y ejecuta con claridad total."
          visual={<TaskCarousel />}
        />
        <FeatureRow reverse
          title="Sesiones de" accent="enfoque integradas"
          body="Asocia temporizadores Pomodoro directamente a tus tareas. PlanIt rastrea tus ciclos de trabajo profundo y gestiona pausas automáticamente."
          visual={<PomodoroDisplay />}
        />
        <FeatureRow
          title="Seguimiento de" accent="hábitos reales"
          body="Desde tu rutina de entrenamiento hasta la gestión de inversiones. Todo suma momentum y se refleja en tu rendimiento semanal."
          visual={<HabitsVisual />}
        />
        <FeatureRow reverse
          title="Analytics de" accent="rendimiento"
          body="Visualiza horas de enfoque acumuladas, racha de hábitos y velocidad de cierre de tareas. Lo que se mide, mejora."
          visual={<AnalyticsChart />}
        />
      </section>

      {/* How to Start */}
      <section className="w-full px-6 py-24 z-10 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">Cómo empezar</h2>
            <p className="text-zinc-400 text-lg">Tres pasos para estructurar tu entorno y recuperar el control de tus horas.</p>
          </div>
          <div className="flex-1 relative border-l border-zinc-800 pl-8 space-y-12">
            {[
              { icon: <UserPlus className="w-3 h-3 text-white" />, title: "1. Regístrate", body: "Crea tu cuenta en segundos e inicializa tu entorno privado.", active: true },
              { icon: <Target className="w-3 h-3 text-zinc-400" />,  title: "2. Define tu enfoque", body: "Añade tus tareas clave y configura los hábitos que quieres monitorear.", active: false },
              { icon: <Play className="w-3 h-3 text-zinc-400" />,   title: "3. Trabaja en bloques", body: "Inicia un ciclo Pomodoro y deja que el sistema rastree tu tiempo.", active: false },
            ].map((step, i) => (
              <motion.div key={i} className="relative"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-zinc-950 flex items-center justify-center border-2 ${step.active ? "border-white" : "border-zinc-700"}`}>
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-zinc-400 text-sm">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="resenias" className="w-full max-w-[1200px] mx-auto py-32 px-6 z-10 scroll-mt-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Reseñas de usuarios
          </h2>
        </div>
        <TestimonialsSlider />
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 py-24 mb-12 text-center z-10 border-t border-zinc-900">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">Recupera el control.</h2>
        <p className="text-lg text-zinc-400 mb-10">Únete y comienza a estructurar tus días con intención absoluta.</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="bg-white text-[#0A0A0B] px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wide cursor-pointer">
          Crear cuenta gratuita
        </motion.button>
      </section>
    </div>
  );
}