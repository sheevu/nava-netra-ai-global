import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Loader2,
  ArrowRight,
  MessageCircle,
  Mail,
  CheckCircle,
} from "lucide-react";
import { cn } from "../lib/utils";

interface ScannerProps {
  onScan: (url: string) => Promise<void>;
  isScanning: boolean;
}

const WHATSAPP_URL =
  "https://wa.me/917080842220?text=Hi%20NNN%20AI%20Labs%2C%20I%27d%20like%20a%20free%20growth%20plan%20for%20my%20business.";
const GOOGLE_CHAT_URL = "https://chat.google.com/room/AAQAwk_PPn4?cls=7";

export default function Scanner({ onScan, isScanning }: ScannerProps) {
  const [url, setUrl] = useState("");
  const [scanType, setScanType] = useState("retail");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a website URL");
      return;
    }
    setError("");
    onScan(url.trim());
  };

  const statCards = [
    { value: "↑137%", label: "Organic Traffic Lift", color: "text-neon" },
    { value: "₹89/mo", label: "Plans Start From", color: "text-emerald-400" },
    { value: "3.2×", label: "Google Ads ROAS", color: "text-amber-400" },
    { value: "50K", label: "Monthly Impressions", color: "text-brand-pink" },
  ];

  const trust = [
    "DPIIT Startup India Registered",
    "50+ International Clients",
    "USA & Global Coverage",
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ── LEFT HERO ── */}
        <div className="lg:col-span-7 space-y-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-neon rounded-full"
          >
            <Zap className="w-3.5 h-3.5 fill-dark text-dark" />
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-dark">
              DPIIT Startup India Registered · Lucknow, India
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h1
              className="font-display font-black text-dark leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)" }}
            >
              Turn{" "}
              <span className="text-brand-pink">Search</span>
              <br />
              Into{" "}
              <span
                className="inline-block bg-neon px-4 pb-1 rounded-lg"
                style={{ transform: "rotate(-1.5deg)" }}
              >
                Revenue
              </span>
              <br />
              <span className="text-dark/40">Globally.</span>
            </h1>
          </motion.div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[1.05rem] font-semibold leading-[1.7] text-dark/55 max-w-[520px]"
          >
            NNN AI Labs is an international SEO & digital marketing agency
            helping small businesses and startups capture high-intent searches —
            with <strong className="text-dark/80 font-bold">transparent Google Ads pricing</strong> and a global
            growth playbook built for lean teams.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-3"
          >
            {trust.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-100 rounded-full text-[11px] font-bold text-dark/60 uppercase tracking-wider shadow-sm"
              >
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                {t}
              </span>
            ))}
          </motion.div>

          {/* ── FREE SCANNER ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="bg-dark rounded-[2rem] p-8 space-y-6 relative overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-neon/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-brand-indigo/15 blur-3xl pointer-events-none" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neon rounded-full text-[10px] font-black uppercase tracking-widest text-dark mb-4">
                  <Zap className="w-3 h-3 fill-dark" />
                  Free AI Tool — No Sign‑Up
                </span>

                <h2
                  className="font-display font-black text-white leading-[1.0] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
                >
                  Free Website SEO
                  <br />
                  &amp; Marketing Scan
                </h2>

                <p className="mt-3 text-[0.88rem] font-medium leading-[1.65] text-white/55">
                  Paste your URL below. Our Gemini AI analyses your SEO health,
                  digital marketing gaps, Google Ads opportunity and delivers a
                  free actionable report — instantly.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* URL input */}
                  <div className="relative flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      disabled={isScanning}
                      className={cn(
                        "w-full pl-12 pr-4 py-4 rounded-2xl text-[0.9rem] font-semibold transition-all outline-none",
                        "bg-white/10 border text-white placeholder:text-white/30",
                        "focus:ring-2 focus:ring-neon focus:border-neon",
                        error
                          ? "border-brand-pink/50"
                          : "border-white/10 focus:border-neon"
                      )}
                    />
                  </div>

                  {/* Type select */}
                  <select
                    value={scanType}
                    onChange={(e) => setScanType(e.target.value)}
                    disabled={isScanning}
                    className="px-4 py-4 rounded-2xl text-[0.85rem] font-bold bg-white/10 border border-white/10 text-white outline-none focus:border-neon cursor-pointer"
                  >
                    <option value="ecommerce">E‑Commerce</option>
                    <option value="saas">SaaS / Software</option>
                    <option value="retail">Retail / MSME</option>
                    <option value="startup">Early Startup</option>
                    <option value="service">Service Business</option>
                    <option value="agency">Agency / Freelancer</option>
                  </select>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isScanning}
                  className="w-full py-4 bg-neon text-dark font-black uppercase text-[0.78rem] tracking-widest rounded-2xl hover:bg-neon/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-lime-200/20"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analysing with Gemini AI…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-dark" />
                      Run Free AI Scan
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {error && (
                  <p className="text-brand-pink text-[11px] font-black uppercase tracking-wider text-center">
                    {error}
                  </p>
                )}
              </form>

              {/* Bottom CTAs */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#20BD5A] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Us
                </a>
                <a
                  href={GOOGLE_CHAT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-indigo text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Google Chat
                </a>
                <a
                  href="mailto:sudarshanailabs@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/15 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT KPI PANEL ── */}
        <div className="lg:col-span-5 space-y-5">
          {/* KPI dark card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-dark p-8 rounded-[2.5rem] text-white space-y-7 relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-neon/8 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-brand-pink/10 blur-3xl" />

            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
              Live Client Dashboard
            </p>

            <div className="grid grid-cols-2 gap-3.5">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className="p-5 bg-white/6 rounded-2xl border border-white/8 space-y-1.5"
                >
                  <p
                    className={cn(
                      "font-display font-black leading-none tracking-tight",
                      s.color
                    )}
                    style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Rotating badge */}
            <div className="flex items-center justify-center pt-2">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border border-white/15 animate-spin-slow" />
                <div className="absolute inset-2 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-neon fill-neon" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* USA coverage card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neon/15 p-8 rounded-[2.5rem] border-2 border-neon/25 space-y-5"
          >
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5 text-brand-indigo" />
            </div>
            <div className="space-y-2">
              <h3
                className="font-display font-black text-dark leading-tight tracking-tight"
                style={{ fontSize: "1.2rem" }}
              >
                USA &amp; International
                <br />
                Market Coverage
              </h3>
              <p className="text-[0.83rem] font-semibold leading-[1.65] text-dark/62">
                Capturing "marketing agency USA", "seo companies in usa" and 200+
                high-intent queries your buyers type every day.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["seo service", "digital marketing ads", "google ads prices"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-dark/8 rounded-full text-[10px] font-black text-dark/55 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* Ecosystem links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 space-y-4"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-dark/35">
              Our Ecosystem
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "📦 Vyapai.in", href: "https://vyapai.in/", color: "bg-brand-indigo/8 text-brand-indigo" },
                { label: "🤖 Sudarshan AI", href: "https://www.sudarshan-ai-labs.com/", color: "bg-brand-aqua/10 text-teal-700" },
                { label: "💬 WhatsApp", href: WHATSAPP_URL, color: "bg-emerald-50 text-emerald-700" },
                { label: "💼 Google Chat", href: GOOGLE_CHAT_URL, color: "bg-blue-50 text-blue-700" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "flex items-center justify-center py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-opacity hover:opacity-80",
                    l.color
                  )}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SCANNING OVERLAY ── */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/90 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center space-y-8 max-w-sm px-6">
              {/* Scanner animation */}
              <div className="relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 rounded-3xl border-2 border-neon/30" />
                <div className="absolute inset-0 rounded-3xl border-2 border-neon border-t-transparent animate-spin" />
                <Globe className="absolute inset-0 m-auto w-10 h-10 text-neon" />
                {/* Scan bar */}
                <div className="absolute inset-2 overflow-hidden rounded-2xl">
                  <div className="scan-bar absolute w-full h-0.5 bg-neon/60 left-0" />
                </div>
              </div>

              <div className="space-y-3">
                <h3
                  className="font-display font-black text-white tracking-tight leading-tight"
                  style={{ fontSize: "1.7rem" }}
                >
                  Gemini AI Analysing…
                </h3>
                <p className="text-[0.85rem] font-medium text-white/50 leading-relaxed">
                  Crawling page structure, checking SEO signals, evaluating
                  digital marketing opportunities…
                </p>
              </div>

              {/* Progress */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 18, ease: "linear" }}
                  className="h-full bg-neon rounded-full"
                />
              </div>

              <p className="text-[10px] font-black text-white/25 uppercase tracking-widest">
                Powered by Google Gemini — NNN AI Labs
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
