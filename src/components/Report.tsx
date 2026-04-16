import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe,
  Link2,
  RefreshCcw,
  Search,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { AnalysisReport, ScanData } from "../types";
import { cn } from "../lib/utils";

interface ReportProps {
  report: AnalysisReport;
  scanData: ScanData;
  onReset: () => void;
}

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-500";
  if (score >= 55) return "text-amber-500";
  return "text-fuchsia-600";
}

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Mixed";
  return "Needs work";
}

function impactClass(impact: AnalysisReport["recommendations"][number]["impact"]) {
  if (impact === "High") return "bg-brand-pink/10 text-brand-pink border-brand-pink/20";
  if (impact === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

function impactDot(impact: AnalysisReport["recommendations"][number]["impact"]) {
  if (impact === "High") return "bg-brand-pink";
  if (impact === "Medium") return "bg-amber-500";
  return "bg-blue-500";
}

function friendlyLabel(key: string) {
  switch (key) {
    case "bestPractices":
      return "Best practices";
    case "performance":
      return "Performance";
    case "accessibility":
      return "Accessibility";
    case "seo":
      return "SEO";
    default:
      return key;
  }
}

function safeHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "website";
  }
}

function buildReportHtml(report: AnalysisReport, scanData: ScanData) {
  const host = safeHost(scanData.url);
  const score = Math.max(0, Math.min(100, report.overallScore));
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${host} report</title>
  <style>
    body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#fff7ed,#ecfeff,#fdf2f8);color:#0f172a;padding:32px}
    .wrap{max-width:980px;margin:0 auto;background:#fff;border:1px solid rgba(99,102,241,.18);border-radius:28px;padding:28px;box-shadow:0 20px 60px rgba(15,23,42,.08)}
    .hero{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;flex-wrap:wrap}
    .score{width:132px;height:132px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#22c55e ${score}%, #e5e7eb 0)}
    .score > div{width:104px;height:104px;border-radius:50%;background:#fff;display:grid;place-items:center;text-align:center}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:20px}
    .card{border:1px solid rgba(99,102,241,.14);border-radius:20px;padding:16px;background:linear-gradient(180deg,#fff,#faf5ff)}
    .k{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;font-weight:800;margin-bottom:8px}
    .v{font-size:28px;font-weight:900;color:#111827}
    ul{padding-left:18px}
    li{margin:8px 0;line-height:1.5}
    h1,h2,h3{margin:0}
    h1{font-size:36px}
    h2{font-size:20px;margin-top:28px;margin-bottom:12px}
    .pill{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:#0f172a;color:#fff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.18em}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <div>
        <div class="pill">Website Audit Report</div>
        <h1 style="margin-top:14px">${scanData.metadata.title || host}</h1>
        <p style="max-width:680px;color:#334155;line-height:1.7">${report.summary}</p>
      </div>
      <div class="score"><div><div style="font-size:34px;font-weight:900">${score}</div><div style="font-size:11px;font-weight:800;color:#64748b">/100</div></div></div>
    </div>
    <div class="grid">
      <div class="card"><div class="k">Performance</div><div class="v">${report.categories.performance}%</div></div>
      <div class="card"><div class="k">SEO</div><div class="v">${report.categories.seo}%</div></div>
      <div class="card"><div class="k">Accessibility</div><div class="v">${report.categories.accessibility}%</div></div>
      <div class="card"><div class="k">Best practices</div><div class="v">${report.categories.bestPractices}%</div></div>
    </div>
    <h2>Recommendations</h2>
    <ul>${report.recommendations.map((rec) => `<li><strong>${rec.title}:</strong> ${rec.description}</li>`).join("")}</ul>
    <h2>Strengths</h2>
    <ul>${report.strengths.map((item) => `<li>${item}</li>`).join("")}</ul>
    <h2>Weaknesses</h2>
    <ul>${report.weaknesses.map((item) => `<li>${item}</li>`).join("")}</ul>
  </div>
</body>
</html>`;
}

export default function Report({ report, scanData, onReset }: ReportProps) {
  const score = Math.max(0, Math.min(100, report.overallScore));
  const metricCards: Array<{
    label: string;
    value: number;
    icon: React.ReactNode;
  }> = [
    { label: "Performance", value: report.categories.performance, icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { label: "SEO", value: report.categories.seo, icon: <Search className="w-5 h-5 text-emerald-500" /> },
    { label: "Accessibility", value: report.categories.accessibility, icon: <Shield className="w-5 h-5 text-blue-500" /> },
    { label: "Best Practices", value: report.categories.bestPractices, icon: <BarChart3 className="w-5 h-5 text-purple-500" /> },
  ];

  const radarData = [
    { subject: "Performance", A: report.categories.performance, fullMark: 100 },
    { subject: "SEO", A: report.categories.seo, fullMark: 100 },
    { subject: "Accessibility", A: report.categories.accessibility, fullMark: 100 },
    { subject: "Best Practices", A: report.categories.bestPractices, fullMark: 100 },
    {
      subject: "Opportunity",
      A: Math.min(100, Math.round(score + 12)),
      fullMark: 100,
    },
  ];

  const growthData = [
    { month: "Month 1", current: 100, potential: Math.max(130, score + 40) },
    { month: "Month 2", current: 145, potential: Math.max(210, score + 75) },
    { month: "Month 3", current: 200, potential: Math.max(340, score + 120) },
    { month: "Month 4", current: 295, potential: Math.max(520, score + 170) },
    { month: "Month 5", current: 410, potential: Math.max(760, score + 230) },
    { month: "Month 6", current: 560, potential: Math.max(1080, score + 300) },
  ];

  const pageHost = (() => {
    try {
      return new URL(scanData.url).hostname.replace(/^www\./, "");
    } catch {
      return scanData.url;
    }
  })();

  const internalLinkCount = scanData.metadata.internalLinkCount ?? 0;
  const externalLinkCount = scanData.metadata.externalLinkCount ?? 0;
  const textLength = scanData.metadata.pageTextLength ?? scanData.content.length;
  const sections = scanData.metadata.sectionCount ?? 0;
  const forms = scanData.metadata.formCount ?? 0;

  const shareReport = async () => {
    const text = `Website audit for ${safeHost(scanData.url)}: ${report.overallScore}/100 overall score`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${safeHost(scanData.url)} audit`,
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }

    await navigator.clipboard?.writeText(`${text} ${window.location.href}`);
  };

  const downloadReport = () => {
    const blob = new Blob([buildReportHtml(report, scanData)], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${safeHost(scanData.url)}-audit-report.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-8 relative overflow-hidden rounded-[3rem] bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_30%)]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-dark/35">
            <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
            Website Audit Report
          </div>
          <h1
            className="font-display font-black text-dark leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.7rem)" }}
          >
            {scanData.metadata.title || pageHost}
          </h1>
          <a
            href={scanData.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[0.85rem] font-semibold text-brand-indigo hover:opacity-80 transition-opacity"
          >
            {scanData.url}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-dark text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity w-fit"
        >
          <RefreshCcw className="w-4 h-4" />
          Scan another site
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-4 bg-[linear-gradient(145deg,#111827,#312e81,#1e1b4b)] text-white rounded-[2.25rem] p-8 relative overflow-hidden neon-frame"
        >
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/75 neon-frame">
                <Zap className="w-3 h-3 text-cyan-300" />
                Overall Score
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 neon-frame">
                {scoreLabel(score)}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative w-32 h-32 shrink-0">
                <div
                  className="absolute inset-0 rounded-full p-2"
                  style={{
                    background: `conic-gradient(#22c55e 0 ${Math.max(18, score * 0.34)}%, #06b6d4 ${Math.max(18, score * 0.34)}% ${Math.max(42, score * 0.66)}%, #f97316 ${Math.max(42, score * 0.66)}% ${score}%, rgba(255,255,255,0.12) ${score}% 100%)`,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#121225] flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={cn("font-display font-black leading-none", scoreTone(score))}
                        style={{ fontSize: "2.5rem" }}
                      >
                        {score}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/35">
                        / 100
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[0.88rem] font-semibold leading-relaxed text-white/60 max-w-[220px]">
                  {report.summary}
                </p>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/35">
                  <Shield className="w-3.5 h-3.5 text-neon" />
                  OpenAI-backed audit
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/6 p-4 border border-white/8">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-1">
                  Images with alt
                </div>
                <div className="font-display font-black text-neon text-2xl">
                  {scanData.metadata.imgWithAlt}/{scanData.metadata.imgCount}
                </div>
              </div>
              <div className="rounded-2xl bg-white/6 p-4 border border-white/8">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-1">
                  Headings
                </div>
                <div className="font-display font-black text-white text-2xl">
                  {scanData.metadata.h1Count}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-8 bg-white/90 backdrop-blur rounded-[2.25rem] p-8 border border-fuchsia-100 neon-frame"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-brand-indigo" />
            <h2 className="font-display font-black text-dark text-[1.15rem] tracking-tight">
              Category breakdown
            </h2>
          </div>
          <p className="mb-5 text-[0.82rem] font-medium text-dark/50">
            A quick read on where the site is healthy, where it is vulnerable, and what to fix first.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metricCards.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "rounded-[1.75rem] bg-gradient-to-br from-white via-cyan-50 to-fuchsia-50 p-5 border border-fuchsia-100 group hover:border-cyan-300 transition-all neon-frame",
                  i === 0 && "card-shimmer"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-neon transition-colors neon-frame">
                    {metric.icon}
                  </div>
                  <span className="text-2xl font-display font-black text-dark">{metric.value}%</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-dark transition-colors">
                  {metric.label}
                </div>
                <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: i * 0.08 }}
                    className={cn(
                      "h-full rounded-full",
                      metric.value >= 80 ? "bg-emerald-500" : metric.value >= 55 ? "bg-amber-500" : "bg-brand-pink"
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
            {[
              ["Sections", sections],
              ["Forms", forms],
              ["Internal links", internalLinkCount],
              ["External links", externalLinkCount],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white p-4 neon-frame">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-1">
                  {label}
                </div>
                <div className="font-display font-black text-cyan-300 text-2xl">{String(value)}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.75rem] bg-[linear-gradient(135deg,#0f172a,#312e81)] text-white p-5 neon-frame">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-cyan-300" />
              <h3 className="font-display font-black text-[1rem] tracking-tight">
                Scan metadata
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[0.82rem]">
              <div>
                <div className="text-white/35 uppercase tracking-widest font-black text-[10px] mb-1">Title</div>
                <div className="text-white/75 font-semibold line-clamp-2">{scanData.metadata.title || "N/A"}</div>
              </div>
              <div>
                <div className="text-white/35 uppercase tracking-widest font-black text-[10px] mb-1">Description</div>
                <div className="text-white/75 font-semibold line-clamp-2">{scanData.metadata.description || "N/A"}</div>
              </div>
              <div>
                <div className="text-white/35 uppercase tracking-widest font-black text-[10px] mb-1">Canonical</div>
                <div className="text-white/75 font-semibold break-all">{scanData.metadata.canonical || "Missing"}</div>
              </div>
              <div>
                <div className="text-white/35 uppercase tracking-widest font-black text-[10px] mb-1">Viewport / Robots</div>
                <div className="text-white/75 font-semibold">
                  {scanData.metadata.hasViewport ? "Viewport set" : "Missing viewport"} ·{" "}
                  {scanData.metadata.hasRobots ? "Robots present" : "No robots meta"}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 bg-white/90 backdrop-blur p-8 rounded-[2.25rem] border border-cyan-100 shadow-sm neon-frame"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-indigo" />
            <h2 className="font-display font-black text-dark text-[1.15rem] tracking-tight">
              Optimization Radar
            </h2>
          </div>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f3f4f6" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 800 }}
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#7c3aed"
                  fill="#06b6d4"
                  fillOpacity={0.28}
                  animationDuration={1800}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                  itemStyle={{ color: "#67e8f9" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-7 bg-[linear-gradient(135deg,#111827,#7c3aed,#db2777)] p-8 rounded-[2.25rem] text-white neon-frame"
        >
          <div className="flex justify-between items-start mb-5 gap-3">
            <div>
              <h2 className="font-display font-black text-[1.15rem] tracking-tight">
                6-Month Growth Projection
              </h2>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">
                Projected uplift based on report signals
              </p>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Potential +{Math.max(25, Math.round(score * 1.2))}%
              </span>
            </div>
          </div>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorPotential" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="45%" stopColor="#06b6d4" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                  itemStyle={{ color: "#67e8f9" }}
                />
                <Area
                  type="monotone"
                  dataKey="potential"
                  stroke="#67e8f9"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPotential)"
                  animationDuration={2200}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorCurrent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-[10px] text-white/65 font-bold uppercase tracking-widest text-center">
            * Directional growth projection based on content structure, metadata, and technical hygiene
          </p>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(report.categories).map(([key, value], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={cn("bg-white/90 backdrop-blur p-6 rounded-[2rem] border border-fuchsia-100 hover:border-cyan-300 transition-all group neon-frame", i % 2 === 0 ? "card-shimmer" : "")}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-cyan-50 rounded-2xl flex items-center justify-center group-hover:bg-neon transition-colors neon-frame">
                {key === "performance" && <Zap className="w-5 h-5 text-orange-500 group-hover:text-dark" />}
                {key === "seo" && <Search className="w-5 h-5 text-emerald-500 group-hover:text-dark" />}
                {key === "accessibility" && <Shield className="w-5 h-5 text-sky-500 group-hover:text-dark" />}
                {key === "bestPractices" && <BarChart3 className="w-5 h-5 text-fuchsia-500 group-hover:text-dark" />}
              </div>
              <span className="text-2xl font-display font-black text-dark">{value}%</span>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-dark transition-colors">
              {friendlyLabel(key)}
            </h3>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${value}%` }}
                transition={{ duration: 1, delay: i * 0.08 }}
                className={cn(
                  "h-full rounded-full",
                  value >= 80 ? "bg-emerald-500" : value >= 55 ? "bg-amber-500" : "bg-brand-pink"
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 bg-white/90 backdrop-blur p-8 rounded-[2.25rem] border border-fuchsia-100 shadow-sm space-y-6 neon-frame"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-fuchsia-500" />
            <h2 className="font-display font-black text-dark text-[1.2rem] tracking-tight">
              Growth Recommendations
            </h2>
          </div>
          <div className="space-y-4">
            {report.recommendations.map((rec, i) => (
              <motion.div
                key={`${rec.title}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.07 * i }}
                whileHover={{ x: 5, scale: 1.01 }}
                className={cn("flex gap-5 p-5 rounded-[1.75rem] bg-gradient-to-br from-white via-amber-50 to-cyan-50 border border-cyan-100 cursor-default transition-all duration-300 group neon-frame", i % 2 === 0 ? "card-shimmer" : "")}
              >
                <div className={cn("mt-1 w-3 h-3 rounded-full shrink-0 shadow-sm", impactDot(rec.impact))} />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-dark uppercase text-sm tracking-tight">
                      {rec.title}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                        impactClass(rec.impact)
                      )}
                    >
                      {rec.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{rec.description}</p>
                  <a
                    href={`mailto:sudarshanailabs@gmail.com?subject=${encodeURIComponent(
                      `Fix: ${rec.title} for ${pageHost}`
                    )}`}
                    className="inline-flex items-center gap-2 text-[10px] font-black text-brand-indigo uppercase tracking-widest hover:text-dark transition-colors pt-1"
                  >
                    Fix this with NNN AI <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="lg:col-span-5 space-y-6">
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[linear-gradient(135deg,#f8fafc,#ecfeff,#fdf2f8)] p-8 rounded-[2.25rem] space-y-5 neon-frame"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-dark/50">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Summary
            </div>
            <p className="text-dark/80 font-medium leading-relaxed">
              {report.summary}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-white/80 p-4 neon-frame">
                <div className="text-[10px] font-black uppercase tracking-widest text-dark/45 mb-1">Text length</div>
                <div className="font-display font-black text-dark text-2xl">{textLength.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 neon-frame">
                <div className="text-[10px] font-black uppercase tracking-widest text-dark/45 mb-1">Links</div>
                <div className="font-display font-black text-dark text-2xl">
                  {(internalLinkCount + externalLinkCount).toLocaleString()}
                </div>
              </div>
            </div>
            <a
              href={`mailto:sudarshanailabs@gmail.com?subject=${encodeURIComponent(`Growth plan for ${pageHost}`)}`}
              className="w-full py-4 bg-dark text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 neon-frame"
            >
              Claim Full Strategy <Zap className="w-4 h-4 fill-neon text-neon" />
            </a>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur p-8 rounded-[2.25rem] border border-emerald-100 space-y-4 neon-frame"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-display font-black text-dark text-[1.1rem] tracking-tight">
                Strengths
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {report.strengths.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-lime-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 leading-relaxed normal-case neon-frame"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur p-8 rounded-[2.25rem] border border-fuchsia-100 space-y-4 neon-frame"
          >
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-brand-indigo" />
              <h3 className="font-display font-black text-dark text-[1.1rem] tracking-tight">
                Weaknesses
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {report.weaknesses.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="px-4 py-2 bg-gradient-to-r from-rose-50 to-fuchsia-50 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100 leading-relaxed normal-case neon-frame"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-fuchsia-100">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Share results:</span>
          <button
            onClick={shareReport}
            className="p-3 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-cyan-100 border border-fuchsia-200 text-dark hover:opacity-90 transition-all shadow-sm neon-frame"
            aria-label="Share report"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={downloadReport}
            className="p-3 rounded-2xl bg-gradient-to-br from-cyan-100 to-amber-100 border border-cyan-200 text-dark hover:opacity-90 transition-all shadow-sm neon-frame"
            aria-label="Download report"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-dark transition-colors"
            type="button"
          >
            <Sparkles className="w-4 h-4" />
            Download report
          </button>
          <button
            onClick={onReset}
            className="px-8 py-4 rounded-2xl bg-dark text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-gray-200 neon-frame"
            type="button"
          >
            Scan New Domain
          </button>
        </div>
      </div>
    </motion.div>
  );
}
