import React, { Suspense, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import Scanner from "./components/Scanner";
import { ScanData, AnalysisReport } from "./types";
import {
  ArrowRight, CheckCircle2, Globe, MessageCircle, Mail,
  Star, Zap, Shield, BarChart3, TrendingUp, ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "./lib/utils";

const Report = React.lazy(() => import("./components/Report"));

const WHATSAPP = "https://wa.me/917080842220?text=Hi%20NNN%20AI%20Labs%21%20I%20want%20to%20discuss%20a%20growth%20plan.";
const GCHAT    = "https://chat.google.com/room/AAQAwk_PPn4?cls=7";
const EMAIL    = "mailto:sudarshanailabs@gmail.com?subject=Growth%20Plan%20Request";
const VYAPAI   = "https://vyapai.in/";
const SUDARSHAN = "https://www.sudarshan-ai-labs.com/";

// ── Service catalogue from product roadmap ──────────────────────────────────
const SERVICES = [
  { icon: "📈", title: "Google Ads Setup", price: "$29", recur: "+$20/mo", cmp: "$500 setup (WebGuruz)", save: "94% cheaper", tag: "Most Popular", color: "bg-neon/12 border-neon/25" },
  { icon: "📧", title: "Email Marketing", price: "$19", recur: "+$15/mo", cmp: "$300/mo (DefiningWeb)", save: "94% cheaper", tag: null, color: "bg-brand-indigo/8 border-brand-indigo/20" },
  { icon: "📍", title: "Local SEO Boost", price: "$25", recur: "+$15/mo", cmp: "$250/mo (WebGuruz)", save: "90% cheaper", tag: "High ROI", color: "bg-emerald-50 border-emerald-200" },
  { icon: "🌐", title: "5‑Page Website", price: "$49", recur: "+$10/mo", cmp: "$1,000 (DefiningWeb)", save: "95% cheaper", tag: null, color: "bg-amber-50 border-amber-200" },
  { icon: "📣", title: "PPC / FB Ads Mgmt", price: "$39", recur: "+$25/mo", cmp: "$400/mo (Webart)", save: "90% cheaper", tag: null, color: "bg-rose-50 border-rose-200" },
  { icon: "✍️", title: "Content Writing", price: "$15/art", recur: "or $49/mo", cmp: "$200/article (Artvgrow)", save: "93% cheaper", tag: "New", color: "bg-purple-50 border-purple-200" },
  { icon: "🛒", title: "E‑com Store Setup", price: "$39", recur: "+$15/mo", cmp: "$2,000 (WebGuruz)", save: "98% cheaper", tag: null, color: "bg-teal-50 border-teal-200" },
  { icon: "🎬", title: "Video / Reels Pack", price: "$29/mo", recur: "10 custom shorts", cmp: "$50/video (Webart)", save: "94% cheaper", tag: "Viral", color: "bg-sky-50 border-sky-200" },
  { icon: "⭐", title: "Review Management", price: "$19", recur: "+$10/mo", cmp: "$150/mo", save: "87% cheaper", tag: null, color: "bg-orange-50 border-orange-200" },
  { icon: "🤖", title: "AI Chatbot", price: "$25", recur: "one-time", cmp: "$300 setup", save: "92% cheaper", tag: "AI", color: "bg-brand-indigo/8 border-brand-indigo/20" },
];

const BUNDLES = [
  {
    tier: "Bronze", emoji: "🥉",
    price: "$30", monthly: "$25/mo",
    tagline: "Launch Your Social Game",
    color: "bg-white border-2 border-gray-100",
    accent: "text-amber-700",
    badge: null,
    features: [
      "All Major Meta + GMB/Blogger",
      "10 Canva Pro posters + 20 templates",
      "4 Reels / month",
      "1 SEO blog + backlink + 1 PR",
      "Basic SEO keywords/meta opt",
      "WhatsApp/Telegram reminders",
      "PDF analytics report",
      "SBA Microloan Checklist ($500–$50K)",
      "Email/WhatsApp support",
    ],
    cta: "Start Bronze →",
    ctaStyle: "bg-dark text-white",
  },
  {
    tier: "Silver", emoji: "🥈",
    price: "$38", monthly: "$25/mo",
    tagline: "Scale Social + SEO",
    color: "bg-dark border-2 border-neon/40",
    accent: "text-neon",
    badge: "MOST POPULAR",
    features: [
      "Everything in Bronze",
      "+ Pinterest, X, Tumblr, Mastodon",
      "15 posters + 20+ templates",
      "8 Reels / month",
      "5 SEO blogs + 1 PR",
      "Brand kit + GMB top listings",
      "SEO audit + lead tracking",
      "Telegram bot reminders",
      "SBA 7(a)/STEP Export Grants (up to $5M)",
    ],
    cta: "Go Silver →",
    ctaStyle: "bg-neon text-dark",
  },
  {
    tier: "Gold", emoji: "🏆",
    price: "$49", monthly: "$25/mo",
    tagline: "Elite Social / SEO / Funding",
    color: "bg-white border-2 border-amber-300",
    accent: "text-amber-600",
    badge: "BEST VALUE",
    features: [
      "ALL platforms fully interlinked",
      "30 posters + 30 templates",
      "12 Reels / month",
      "12 SEO blogs + 2 PR + full strategy",
      "Landing/QR/website setup",
      "Competitor SEO research",
      "ROI/conversion dashboard",
      "Video reports + dedicated manager",
      "SBIR/STTR R&D + MBDA Minority Grants ($4K+)",
    ],
    cta: "Go Gold →",
    ctaStyle: "bg-amber-500 text-white",
  },
];

type ServiceItem = (typeof SERVICES)[number];
type BundleItem = (typeof BUNDLES)[number];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TESTIMONIALS = [
  { name: "James Mitchell", role: "Founder, Clearcut Blinds", country: "🇺🇸 USA", stars: 5, text: "We were paying a large US agency a fortune and seeing nothing. NNN AI Labs ranked us for competitive searches in 60 days at literally 1/5th the cost. The transparent pricing model is what got me on a call." },
  { name: "Sneha Agarwal", role: "Co-Founder, Freshleaf Organics", country: "🇮🇳 India", stars: 5, text: "Our Google Ads budget was a total black box before NNN AI Labs. They explained 'google ads costs' in plain English — ROAS went from 1.4× to 3.8× in 90 days. Remarkable." },
  { name: "Rafael Cruz", role: "CEO, Stackr.io", country: "🇲🇽 Mexico", stars: 5, text: "I searched 'marketing agency USA' looking for a startup-friendly partner. NNN AI Labs delivered a growth plan the same day and had our first posts ranking within 3 weeks." },
  { name: "Ramesh Gupta", role: "Owner, Gupta Kirana Store", country: "🇮🇳 India", stars: 5, text: "As a kirana store owner I never thought SEO was for me. NNN AI Labs set up Google Ads at $5/mo and now I get 15-20 new customers a week from search alone." },
  { name: "Thomas Wright", role: "Director, Wright Digital", country: "🇬🇧 UK", stars: 5, text: "We were competing against companies 10× our size. NNN Labs built a keyword strategy and we started outranking agencies that have been around 20 years. Unbelievable ROI." },
  { name: "Priya Khanna", role: "Founder, PK Boutique", country: "🇮🇳 Kanpur", stars: 5, text: "The Vyapai CRM + WhatsApp AI agent changed everything. Clients are handled 24/7. I feel like I finally have a proper digital team without the enterprise price tag." },
];

type OfferingDetailProps = {
  kind: "service" | "bundle";
  item: ServiceItem | BundleItem;
  onHome: () => void;
  onScan: () => void;
};

function OfferingDetailPage({ kind, item, onHome, onScan }: OfferingDetailProps) {
  const isService = kind === "service";
  const title = isService ? (item as ServiceItem).title : (item as BundleItem).tier;
  const eyebrow = isService
    ? (item as ServiceItem).tag || "Service detail"
    : (item as BundleItem).badge || "Plan detail";
  const summary = isService
    ? `A focused, mobile-first build for ${(item as ServiceItem).title.toLowerCase()} with cleaner structure, stronger motion, and a sharper conversion path.`
    : `${(item as BundleItem).tagline} with a clear delivery path, premium look, and lower-friction start.`;
  const metrics = isService
    ? [
        { label: "Price", value: (item as ServiceItem).price },
        { label: "Recurring", value: (item as ServiceItem).recur },
        { label: "Savings", value: (item as ServiceItem).save },
      ]
    : [
        { label: "Setup", value: (item as BundleItem).price },
        { label: "Monthly", value: (item as BundleItem).monthly },
        { label: "Tier", value: (item as BundleItem).tier },
      ];
  const bullets = isService
    ? [
        `Built around ${(item as ServiceItem).title} and tuned for small screens first.`,
        "Clear next-step CTA, stronger outline treatment, and smoother motion.",
        "Conversion-focused content that keeps the page readable and fast.",
        `Comparison signal: ${(item as ServiceItem).cmp}`,
      ]
    : (item as BundleItem).features.slice(0, 6);

  return (
    <div className="min-h-screen bg-surface text-dark overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <button onClick={onHome} className="flex items-center gap-2.5 group">
            <div className="w-2.5 h-2.5 bg-neon rounded-full animate-pulse" />
            <span className="font-display font-black text-[1.05rem] tracking-[-0.03em] uppercase group-hover:text-brand-indigo transition-colors">
              NNN AI Labs
            </span>
          </button>
          <div className="flex items-center gap-2">
            <a href="/" className="px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-full border border-gray-200 hover:border-neon transition-colors">
              Home
            </a>
            <button
              onClick={onScan}
              className="px-4 py-2 bg-neon text-dark text-[11px] font-black uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity neon-frame"
            >
              Free Scan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-6">
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-7 bg-dark modern-dark-box text-white rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden neon-frame"
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-neon/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-pink/10 blur-3xl" />
            <div className="relative space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neon rounded-full text-[10px] font-black uppercase tracking-widest text-dark neon-frame">
                <Sparkles className="w-3 h-3" />
                Detailed page
              </span>
              <h1 className="font-display font-black leading-[0.92] tracking-[-0.05em]" style={{ fontSize: "clamp(2.3rem, 5vw, 4.8rem)" }}>
                {title}
              </h1>
              <p className="text-white/65 text-[0.95rem] sm:text-[1rem] leading-relaxed max-w-2xl">
                {summary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                {metrics.map((metric, idx) => (
                  <div key={metric.label} className={cn(
                    "rounded-2xl p-4 border border-white/10 premium-box-gradient overflow-hidden min-w-0 neon-frame",
                    idx === 0 ? "card-shimmer" : ""
                  )}>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-1">{metric.label}</div>
                    <div className="font-display font-black text-neon text-xl sm:text-2xl break-words">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="xl:col-span-5 space-y-4">
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.25rem] p-6 sm:p-8 border border-gray-100 neon-frame"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-display font-black text-dark text-[1.15rem]">What you get</h2>
                <span className="px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo text-[10px] font-black uppercase tracking-widest">
                  {eyebrow}
                </span>
              </div>
              <ul className="space-y-3">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-[0.9rem] text-dark/70 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-[linear-gradient(135deg,rgba(79,64,240,0.14),rgba(204,255,0,0.16),rgba(255,45,90,0.12))] rounded-[2.25rem] p-6 sm:p-8 border border-white/70 neon-frame"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-dark" />
                <h3 className="font-display font-black text-dark text-[1.05rem]">Next step</h3>
              </div>
              <p className="text-dark/75 text-[0.9rem] leading-relaxed">
                Use the free scan to validate the current site, then move into this offer page with a clearer conversion path and a cleaner visual system.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button onClick={onScan} className="px-5 py-3 rounded-2xl bg-dark text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity neon-frame">
                  Run Free Scan
                </button>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-2xl bg-[#25D366] text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity neon-frame">
                  WhatsApp
                </a>
              </div>
            </motion.section>
          </div>
        </section>
      </main>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData]     = useState<ScanData | null>(null);
  const [report, setReport]         = useState<AnalysisReport | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [pathname, setPathname]     = useState(
    () => (typeof window !== "undefined" ? window.location.pathname : "/")
  );

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  const activeService = useMemo(
    () => SERVICES.find((service) => pathname === `/services/${slugify(service.title)}`) || null,
    [pathname]
  );
  const activeBundle = useMemo(
    () => BUNDLES.find((bundle) => pathname === `/plans/${slugify(bundle.tier)}`) || null,
    [pathname]
  );

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPathname(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScan = async (url: string) => {
    setIsScanning(true); setError(null); setReport(null); setScanData(null);
    try {
      const { data: sd }  = await axios.post("/api/scan",    { url });
      setScanData(sd);
      const { data: rep } = await axios.post("/api/analyze", { scanData: sd });
      setReport(rep);
    } catch (err: any) {
      setError(err.response?.data?.error || "An unexpected error occurred. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => { setScanData(null); setReport(null); setError(null); };

  if (activeService || activeBundle) {
    return (
      <OfferingDetailPage
        kind={activeService ? "service" : "bundle"}
        item={(activeService || activeBundle)!}
        onHome={() => navigate("/")}
        onScan={() => {
          navigate("/");
          window.setTimeout(() => {
            document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="bg-white/85 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[4.5rem] flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 bg-neon rounded-full animate-pulse" />
            <span className="font-display font-black text-[1.15rem] tracking-[-0.03em] text-dark uppercase group-hover:text-brand-indigo transition-colors">
              NNN AI Labs
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-7 text-[0.8rem] font-bold text-dark/50">
            {["/","#why","#services","#pricing","#testimonials","#scanner"].map((h, i) => (
              <a key={h} href={h} className="hover:text-dark transition-colors capitalize">
                {["Home","Why Us","Services","Pricing","Results","Free Scan"][i]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={WHATSAPP}
              target="_blank" rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a
              href={EMAIL}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neon text-dark text-[11px] font-black uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
            >
              Get Growth Plan <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <main className="flex-grow">
        {error && (
          <div className="max-w-2xl mx-auto mt-8 px-4 sm:px-6 py-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-[0.875rem] font-semibold text-center flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {!report ? (
          <>
            {/* Hero + Scanner */}
            <Scanner onScan={handleScan} isScanning={isScanning} />

            {/* ── MARQUEE ─── */}
            <div className="bg-dark overflow-hidden py-4 my-0">
              <div className="ticker-track flex w-max gap-0">
                {Array(2).fill([
                  "SEO Service","Digital Marketing & SEO","Google Ads Pricing",
                  "Marketing Agency USA","SEO Companies in USA","Digital Ads Agency",
                  "SEO Optimization","Google Advertising","USA SEO Company","Agency Digital Marketing",
                ]).flat().map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-2.5 px-6 text-[11px] font-black uppercase tracking-[0.12em] text-white/35 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon inline-block" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── WHY SECTION ─── */}
            <section id="why" className="py-24 neon-frame">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="max-w-xl mb-14">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-dark/35 mb-4">Why NNN AI Labs</p>
                  <h2 className="font-display font-black text-dark leading-[0.92] tracking-[-0.035em]" style={{fontSize:"clamp(2.2rem,4.5vw,3.6rem)"}}>
                    Built For Small Teams.<br />
                    <span className="text-brand-indigo">Priced For Startups.</span>
                  </h2>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  {/* Main dark card */}
                  <div className="col-span-12 lg:col-span-7 bg-dark modern-dark-box rounded-[2rem] p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[360px]">
                    <div>
                  <span className="inline-block px-3.5 py-1.5 bg-neon text-dark text-[10px] font-black uppercase tracking-widest rounded-full mb-5 neon-frame">vs. Large Agencies Like WebFX</span>
                      <h3 className="font-display font-black text-white leading-tight tracking-tight mb-4" style={{fontSize:"clamp(1.4rem,2.5vw,2rem)"}}>
                        We skip the enterprise complexity.<br />We deliver results.
                      </h3>
                      <p className="text-[0.875rem] text-white/50 leading-relaxed font-medium">
                        Winning high-intent searches like "digital marketing and seo" by combining technical SEO, content, and performance ads into one integrated strategy — designed for founders, not Fortune 500s.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                      {[["Low","Competition on 50K/mo keywords","text-neon"],["$5","Starting monthly plan","text-brand-aqua"],["5:1","Average SMB ROI","text-amber-400"]].map(([n,l,c])=>(
                        <motion.div whileHover={{ scale: 1.03, y: -4 }} key={l} className="premium-box-gradient rounded-xl p-5 border border-white/10 overflow-hidden relative shadow-2xl">
                          <div className={cn("font-display font-black leading-none tracking-tight mb-1.5",c)} style={{fontSize:"1.8rem"}}>{n}</div>
                          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{l}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Transparent pricing */}
                  <div className="col-span-12 lg:col-span-5 bg-neon/12 border-2 border-neon/25 rounded-[2rem] p-6 sm:p-8 lg:p-9 space-y-4">
                    <div className="w-11 h-11 bg-neon rounded-xl flex items-center justify-center"><Zap className="w-5 h-5 fill-dark text-dark"/></div>
                    <h3 className="font-display font-black text-dark leading-tight tracking-tight" style={{fontSize:"1.25rem"}}>Transparent Google Ads Pricing — Zero Surprises</h3>
                    <p className="text-[0.85rem] text-dark/60 leading-relaxed font-medium">100% transparent on "google ads prices" — with clear budgets, forecasts, and ROI targets before you launch. No confusing price lists — just clarity.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {["google ads costs","google ads rates","google ppc price"].map(t=><span key={t} className="px-3 py-1.5 bg-dark/8 rounded-full text-[10px] font-black text-dark/50 uppercase tracking-wider">{t}</span>)}
                    </div>
                    <a href={`/services/${slugify("Google Ads Setup")}`} className="inline-flex items-center gap-2 mt-2 text-[11px] font-black text-dark/60 uppercase tracking-widest hover:text-dark transition-colors">Get Free Pricing Sheet <ArrowRight className="w-3.5 h-3.5"/></a>
                  </div>

                  {/* Mini cards */}
                  {[
                    { icon:"🌍", title:"USA & International Ready", text:"Capturing 'marketing agency USA' and 'seo company in america' intent via our cost-efficient globally distributed team.", col:"col-span-6 lg:col-span-4", bg:"bg-white border-2 border-gray-100" },
                    { icon:"⚡", title:"Founder-First Always", text:"Direct comms. No fluff. Your strategist is always one WhatsApp message away.", col:"col-span-6 lg:col-span-4", bg:"bg-white border-2 border-gray-100" },
                    { icon:"🤖", title:"AI-Augmented Speed", text:"AI-powered keyword research, content, and reporting — 10× faster delivery than traditional agencies.", col:"col-span-12 lg:col-span-4", bg:"bg-dark" },
                  ].map(c=>(
                    <div key={c.title} className={cn("rounded-[2rem] p-6 sm:p-8 space-y-3", c.col, c.bg)}>
                      <div className="text-2xl">{c.icon}</div>
                      <h3 className={cn("font-display font-black leading-tight tracking-tight", c.bg.includes("dark")?"text-white":"text-dark")} style={{fontSize:"1rem"}}>{c.title}</h3>
                      <p className={cn("text-[0.82rem] leading-relaxed font-medium", c.bg.includes("dark")?"text-white/45":"text-dark/55")}>{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SERVICES SECTION ─── */}
            <section id="services" className="py-24 bg-[#EEEAE0] neon-frame">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-dark/35 mb-4">Core Services</p>
                    <h2 className="font-display font-black text-dark leading-[0.92] tracking-[-0.035em]" style={{fontSize:"clamp(2.2rem,4.5vw,3.6rem)"}}>
                      Services Designed Around<br />
                      <span className="text-brand-indigo">How Your Customers Search</span>
                    </h2>
                  </div>
                  <p className="text-[0.9rem] font-semibold text-dark/50 max-w-xs leading-relaxed">
                    Every service beats US & global agency pricing by 80–98% — without cutting corners.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {SERVICES.map((s) => (
                    <motion.div
                      key={s.title}
                      whileHover={{ y: -5 }}
                      className={cn("rounded-[1.75rem] p-7 border relative overflow-hidden bg-white transition-all cursor-default group", s.color)}
                    >
                      {s.tag && (
                        <span className="absolute top-4 right-4 px-2.5 py-1 bg-neon text-dark text-[9px] font-black uppercase tracking-widest rounded-full">{s.tag}</span>
                      )}
                      <div className="text-2xl mb-4">{s.icon}</div>
                      <h3 className="font-display font-black text-dark leading-tight tracking-tight mb-2" style={{fontSize:"1rem"}}>{s.title}</h3>
                      <div className="flex items-baseline gap-1.5 mb-1.5">
                        <span className="font-display font-black text-dark" style={{fontSize:"1.5rem"}}>{s.price}</span>
                        <span className="text-[11px] font-bold text-dark/45">{s.recur}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px] font-bold text-dark/35 price-strike">{s.cmp}</span>
                      </div>
                      <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full">{s.save}</span>
                      <div className="mt-4 pt-4 border-t border-dark/8">
                        <a href={`/services/${slugify(s.title)}`} className="text-[10px] font-black uppercase tracking-widest text-dark/40 group-hover:text-brand-indigo transition-colors flex items-center gap-1">
                          Get Started <ChevronRight className="w-3 h-3"/>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* UltraFast Landing Page highlight */}
                <div className="mt-6 bg-dark modern-dark-box rounded-[2rem] p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-3.5 py-1.5 bg-neon text-dark text-[10px] font-black uppercase tracking-widest rounded-full mb-5">🚀 World's Cheapest</span>
                    <h3 className="font-display font-black text-white leading-tight tracking-tight mb-3" style={{fontSize:"clamp(1.6rem,3vw,2.4rem)"}}>
                      UltraFast Landing Page<br />
                      <span className="text-neon">$10 One-Time. Yours Forever.</span>
                    </h3>
                    <p className="text-[0.88rem] text-white/50 font-medium leading-relaxed mb-5">
                      Beat $50 Fiverr gigs & $19/mo builders. Pro design on a shared domain — SSL secure, mobile-ready, lead capture, Stripe/PayPal payments. Live in under 10 minutes.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {["One-click build","Lead capture forms","Analytics ready","Stripe/PayPal embed","Upgrade anytime"].map(f=>(
                        <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/8 text-white/70 rounded-full text-[10px] font-bold border border-white/10">
                          <CheckCircle2 className="w-3 h-3 text-neon"/> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="inline-block">
                      <div className="font-display font-black text-neon leading-none mb-1" style={{fontSize:"5rem"}}>$10</div>
                      <div className="text-white/40 font-bold text-[0.8rem] uppercase tracking-wider mb-6">One-time · No subscription</div>
                      <div className="flex flex-col gap-3">
                        <a href={EMAIL} className="px-8 py-4 bg-neon text-dark font-black uppercase text-[11px] tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                          Order My $10 Landing Page <ArrowRight className="w-4 h-4"/>
                        </a>
                        <a href={WHATSAPP} target="_blank" rel="noreferrer" className="px-8 py-4 bg-white/10 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-white/15 transition-colors flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4"/> WhatsApp to Order
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── PRICING BUNDLES ─── */}
            <section id="pricing" className="py-24 neon-frame">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-5">
                  <span className="inline-flex items-center gap-2 px-5 py-2 bg-neon/15 border border-neon/30 text-dark text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                    🏆 Cheapest Social Media Packages in USA & Globally
                  </span>
                  <h2 className="font-display font-black text-dark leading-[0.92] tracking-[-0.035em]" style={{fontSize:"clamp(2.2rem,4.5vw,3.8rem)"}}>
                    Beats Fiverr. Beats Agencies.
                    <br /><span className="text-brand-indigo">Period.</span>
                  </h2>
                  <p className="text-[0.95rem] text-dark/50 font-semibold mt-5 max-w-lg mx-auto leading-relaxed">
                    Social media management bundles starting at $30 one-time + $25/mo — with USA funding guides included at no extra charge.
                  </p>
                </div>

                {/* Comparison banner */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  {[["Fiverr freelancers","$300+/mo"],["US Digital Agencies","$800+/mo"],["WebFX / Ignite","$1,500+/mo"]].map(([n,p])=>(
                    <div key={n} className="flex items-center gap-3 px-5 py-3 bg-rose-50 border border-rose-200 rounded-2xl">
                      <span className="text-rose-500 text-lg font-black">✕</span>
                      <div>
                        <div className="text-[11px] font-black text-rose-700 uppercase tracking-wider">{n}</div>
                        <div className="text-[0.95rem] font-black text-rose-600 price-strike">{p}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-5 py-3 bg-neon/15 border-2 border-neon/40 rounded-2xl">
                    <span className="text-neon text-xl font-black">✓</span>
                    <div>
                      <div className="text-[11px] font-black text-dark/60 uppercase tracking-wider">NNN AI Labs</div>
                      <div className="text-[0.95rem] font-black text-dark">From $30 setup + $25/mo</div>
                    </div>
                  </div>
                </div>

                {/* Bundle cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
                  {BUNDLES.map((b, i) => (
                    <motion.div
                      key={b.tier}
                      whileHover={{ y: -7 }}
                      className={cn(
                        "rounded-[2rem] p-6 sm:p-9 relative overflow-hidden transition-all",
                        b.color,
                        i === 1 && "pricing-glow"
                      )}
                    >
                      {b.badge && (
                        <div className="absolute top-5 right-5">
                          <span className={cn("px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full", i===1?"bg-neon text-dark":"bg-amber-500 text-white")}>
                            {b.badge}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">{b.emoji}</span>
                        <div>
                          <div className={cn("font-display font-black leading-none tracking-tight", b.color.includes("dark")?"text-white":"text-dark")} style={{fontSize:"1.3rem"}}>{b.tier}</div>
                          <div className={cn("text-[10px] font-bold uppercase tracking-wider mt-0.5", b.color.includes("dark")?"text-white/40":"text-dark/40")}>{b.tagline}</div>
                        </div>
                      </div>

                      <div className="mb-7">
                        <div className="flex items-baseline gap-2">
                          <span className={cn("font-display font-black leading-none", b.accent)} style={{fontSize:"2.8rem"}}>{b.price}</span>
                          <span className={cn("text-[0.8rem] font-bold", b.color.includes("dark")?"text-white/40":"text-dark/40")}>setup</span>
                        </div>
                        <div className={cn("text-[0.85rem] font-bold mt-1", b.color.includes("dark")?"text-white/50":"text-dark/40")}>
                          then {b.monthly}
                        </div>
                      </div>

                      <ul className="space-y-2.5 mb-8">
                        {b.features.map(f => (
                          <li key={f} className="flex items-start gap-2.5">
                            <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0 mt-0.5", b.color.includes("dark")?"text-neon":"text-emerald-500")}/>
                            <span className={cn("text-[0.82rem] font-medium leading-snug", b.color.includes("dark")?"text-white/65":"text-dark/65")}>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={`/plans/${slugify(b.tier)}`}
                        className={cn("w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-opacity hover:opacity-90", b.ctaStyle)}
                      >
                        {b.cta}
                      </a>
                    </motion.div>
                  ))}
                </div>

                {/* All plans CTA */}
                <div className="text-center bg-[#EEEAE0] rounded-[2rem] p-6 sm:p-8 lg:p-10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-dark/35 mb-3">Free Trial Available</p>
                  <h3 className="font-display font-black text-dark leading-tight tracking-tight mb-4" style={{fontSize:"clamp(1.5rem,3vw,2.2rem)"}}>
                    All Plans Include a <span className="text-neon bg-dark px-3 py-1 rounded-lg inline-block">7-Day Free Trial</span> + Free Funding Consult
                  </h3>
                  <p className="text-[0.88rem] text-dark/50 font-semibold mb-7 max-w-md mx-auto">
                    Includes USA funding guides — SBA, SBIR/STTR, MBDA grants worth $4K–$5M. Zero extra charge.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href={`/plans/${slugify("Gold")}`} className="px-8 py-4 bg-dark text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center gap-2">
                      Start Free Trial <ArrowRight className="w-4 h-4"/>
                    </a>
                    <a href={WHATSAPP} target="_blank" rel="noreferrer" className="px-8 py-4 bg-[#25D366] text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center gap-2">
                      <MessageCircle className="w-4 h-4"/> WhatsApp to Discuss
                    </a>
                    <a href={GCHAT} target="_blank" rel="noreferrer" className="px-8 py-4 bg-white border-2 border-gray-200 text-dark font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-gray-50 transition-colors">
                      Join Google Chat Community
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* ── FREE SCANNER SECTION ─── */}
            <section id="scanner" className="py-24 bg-[#EEEAE0] neon-frame">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-dark/35 mb-4">Free AI Tool</p>
                  <h2 className="font-display font-black text-dark leading-[0.92] tracking-[-0.035em]" style={{fontSize:"clamp(2.2rem,4vw,3.4rem)"}}>
                    Scan Your Website Free<br />
                    <span className="text-brand-indigo">Powered by OpenAI GPT-4.1 mini</span>
                  </h2>
                  <p className="text-[0.9rem] text-dark/50 font-semibold mt-5 max-w-md mx-auto leading-relaxed">
                    Get an instant SEO health score, digital marketing gap analysis, and actionable recommendations — free, no sign-up.
                  </p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <Scanner onScan={handleScan} isScanning={isScanning} />
                </div>
              </div>
            </section>

            {/* ── TESTIMONIALS ─── */}
            <section id="testimonials" className="py-24 neon-frame">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-dark/35 mb-4">Client Results</p>
                  <h2 className="font-display font-black text-dark leading-[0.92] tracking-[-0.035em]" style={{fontSize:"clamp(2.2rem,4vw,3.4rem)"}}>
                    From Search Terms<br />
                    <span className="text-brand-indigo">To Signed Customers</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {TESTIMONIALS.map((t, i) => (
                    <motion.div
                      key={t.name}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className={cn(
                        "rounded-[2rem] p-8 relative overflow-hidden",
                        i === 0 ? "bg-dark text-white" :
                        i === 1 ? "bg-neon/15 border-2 border-neon/30" :
                        i === 2 ? "bg-brand-indigo/8 border-2 border-brand-indigo/15" :
                        i === 3 ? "bg-amber-50 border-2 border-amber-200" :
                        i === 4 ? "bg-rose-50 border-2 border-rose-200" :
                        "bg-white border-2 border-gray-100"
                      )}
                    >
                      <div className="absolute top-5 right-6 text-[5rem] font-black leading-none opacity-5 select-none">"</div>
                      <div className="flex gap-0.5 mb-4">
                        {Array(t.stars).fill(0).map((_,s) => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400"/>)}
                      </div>
                      <p className={cn("text-[0.88rem] font-medium leading-relaxed mb-6 italic", i===0?"text-white/70":"text-dark/70")}>
                        "{t.text}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-sm", i===0?"bg-neon text-dark":i===1?"bg-dark text-neon":"bg-brand-indigo text-white")}>
                          {t.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <div className={cn("font-display font-black text-[0.9rem] tracking-tight", i===0?"text-white":"text-dark")}>{t.name}</div>
                          <div className={cn("text-[11px] font-semibold mt-0.5", i===0?"text-white/45":"text-dark/45")}>{t.role} · {t.country}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Trust bar */}
                <div className="mt-6 bg-dark modern-dark-box rounded-[2rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="font-display font-black text-white leading-tight tracking-tight" style={{fontSize:"1.15rem"}}>Competing with WebFX on High-Intent Searches</p>
                    <p className="text-white/40 text-[0.83rem] font-medium mt-1.5">Same keywords as the world's largest agencies — at a fraction of the cost.</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <a href={EMAIL} className="px-6 py-3 bg-neon text-dark text-[11px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity">Get Free Comparison →</a>
                    <a href={SUDARSHAN} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/15 transition-colors flex items-center gap-2">🤖 Sudarshan AI Labs <ExternalLink className="w-3 h-3"/></a>
                  </div>
                </div>
              </div>
            </section>

            {/* ── FINAL CTA ─── */}
            <section className="py-16 neon-frame">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-brand-indigo rounded-[2.5rem] p-8 sm:p-10 lg:p-16 relative overflow-hidden text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(204,255,0,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(255,45,90,0.08),transparent_60%)]"/>
                  <div className="relative">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-5">Ready to grow globally?</p>
                    <h2 className="font-display font-black text-white leading-[0.92] tracking-[-0.035em] mb-6" style={{fontSize:"clamp(2rem,4.5vw,3.8rem)"}}>
                      Turn Search Into Revenue<br />Starting This Week.
                    </h2>
                    <p className="text-white/55 text-[0.95rem] font-semibold leading-relaxed mb-10 max-w-lg mx-auto">
                      NNN AI Labs partners with small businesses and startups that want serious results without enterprise-agency complexity.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <a href={EMAIL} className="px-8 py-4 bg-neon text-dark font-black uppercase text-[11px] tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center gap-2"><Mail className="w-4 h-4"/> Email Us — sudarshanailabs@gmail.com</a>
                      <a href={WHATSAPP} target="_blank" rel="noreferrer" className="px-8 py-4 bg-[#25D366] text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:opacity-90 transition-opacity flex items-center gap-2"><MessageCircle className="w-4 h-4"/> WhatsApp +91‑7080842220</a>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                      <a href={GCHAT} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/15 transition-colors">💼 Google Chat Community</a>
                      <a href={VYAPAI} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/15 transition-colors">📦 Explore Vyapai.in</a>
                      <a href={SUDARSHAN} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/15 transition-colors">🤖 Sudarshan AI Labs</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="py-12">
            <Suspense
              fallback={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                  <div className="rounded-[2rem] bg-white border border-gray-100 shadow-sm p-8">
                    <div className="h-4 w-40 bg-gray-100 rounded-full animate-pulse mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="h-72 rounded-[1.75rem] bg-gray-50 animate-pulse" />
                      <div className="h-72 rounded-[1.75rem] bg-gray-50 animate-pulse" />
                    </div>
                  </div>
                </div>
              }
            >
              <Report report={report} scanData={scanData!} onReset={handleReset} />
            </Suspense>
          </div>
        )}
      </main>

      {/* ── ANIMATED FOOTER ─────────────────────────────────────────────────── */}
      <footer className="footer-animated text-white pt-20 pb-10 relative overflow-hidden">
        {/* Floating orbs */}
        <div className="footer-orb   absolute top-10   left-[10%] w-64  h-64  rounded-full bg-neon/10    blur-3xl pointer-events-none" />
        <div className="footer-orb-2 absolute top-40   right-[8%] w-80  h-80  rounded-full bg-brand-indigo/15 blur-3xl pointer-events-none" />
        <div className="footer-orb-3 absolute bottom-10 left-[45%] w-48  h-48  rounded-full bg-brand-pink/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-neon rounded-full animate-pulse" />
                <span className="font-display font-black text-[1.2rem] tracking-[-0.03em] uppercase">NNN AI Labs</span>
              </div>
              <p className="text-[0.83rem] text-white/45 font-medium leading-relaxed max-w-[220px]">
                International SEO & digital marketing agency for small businesses and startups. Transparent pricing. Global reach.
              </p>
              {/* Contact links */}
              <div className="space-y-2.5">
                {[
                  { label:"📧 sudarshanailabs@gmail.com", href:EMAIL },
                  { label:"💬 WhatsApp +91-7080842220",   href:WHATSAPP },
                  { label:"💼 Google Chat Community",      href:GCHAT },
                ].map(l=>(
                  <a key={l.label} href={l.href} target={l.href.startsWith("http")?"_blank":undefined} rel="noreferrer"
                    className="flex items-center gap-2 text-[11px] font-bold text-white/40 hover:text-neon transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
              {/* Social */}
              <div className="flex gap-2.5">
                {[
                  { icon:<MessageCircle className="w-4 h-4"/>, href:WHATSAPP },
                  { icon:<Globe className="w-4 h-4"/>, href:SUDARSHAN },
                  { icon:<ExternalLink className="w-4 h-4"/>, href:VYAPAI },
                ].map((s,i)=>(
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    className="w-9 h-9 bg-white/6 border border-white/8 rounded-xl flex items-center justify-center text-white/40 hover:bg-neon hover:text-dark transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30 mb-5">Services</h4>
              <ul className="space-y-3">
                {["SEO Services","Digital Marketing","Google Ads Mgmt","USA & Int'l SEO","Landing Pages","Content Writing","AI Chatbot"].map(s=>(
                  <li key={s}><a href={EMAIL} className="text-[0.83rem] font-semibold text-white/45 hover:text-neon transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30 mb-5">Company</h4>
              <ul className="space-y-3">
                {[["Why NNN Labs","#why"],["Services","#services"],["Pricing","#pricing"],["Client Results","#testimonials"],["Free AI Scan","#scanner"]].map(([l,h])=>(
                  <li key={l}><a href={h} className="text-[0.83rem] font-semibold text-white/45 hover:text-neon transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Ecosystem */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30 mb-5">Ecosystem</h4>
              <ul className="space-y-3">
                {[
                  ["📦 Vyapai.in", VYAPAI],
                  ["🤖 Sudarshan AI Labs", SUDARSHAN],
                  ["💬 WhatsApp", WHATSAPP],
                  ["📧 Email Us", EMAIL],
                  ["💼 Google Chat", GCHAT],
                ].map(([l,h])=>(
                  <li key={l}><a href={h} target="_blank" rel="noreferrer" className="text-[0.83rem] font-semibold text-white/45 hover:text-neon transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider with neon glow */}
          <div className="relative h-px mb-8">
            <div className="absolute inset-0 bg-white/8"/>
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-32 h-px bg-neon blur-sm"/>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-[11px] font-bold text-white/30">
            <span>© {new Date().getFullYear()} NNN AI Labs · Global digital growth systems for modern brands</span>
            <span className="flex items-center gap-1.5">Powered by <span className="text-neon">ChatGPT API</span> · Built with <span className="text-brand-pink">❤</span> for MSMEs globally</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP}
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-110 transition-transform"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white"/>
      </a>
    </div>
  );
}
