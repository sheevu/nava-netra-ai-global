import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY || "";
const openai = new OpenAI({ apiKey: openaiApiKey });

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function buildFallbackReport(scanData: any) {
  const metadata = scanData?.metadata ?? {};
  const title = String(metadata.title || "");
  const description = String(metadata.description || "");
  const hostname = (() => {
    try {
      return new URL(String(scanData.url)).hostname.replace(/^www\./, "");
    } catch {
      return String(scanData.url || "the site");
    }
  })();

  const imgCount = Number(metadata.imgCount || 0);
  const imgWithAlt = Number(metadata.imgWithAlt || 0);
  const h1Count = Number(metadata.h1Count || 0);
  const h2Count = Number(metadata.h2Count || 0);
  const h3Count = Number(metadata.h3Count || 0);
  const formCount = Number(metadata.formCount || 0);
  const linkCount = Number(metadata.linkCount || 0);
  const internalLinkCount = Number(metadata.internalLinkCount || 0);
  const externalLinkCount = Number(metadata.externalLinkCount || 0);
  const scriptCount = Number(metadata.scriptCount || 0);
  const ariaLabelCount = Number(metadata.ariaLabelCount || 0);
  const structuredDataCount = Number(metadata.structuredDataCount || 0);
  const sectionCount = Number(metadata.sectionCount || 0);
  const pageTextLength = Number(metadata.pageTextLength || 0);
  const metaKeywords = String(metadata.metaKeywords || "");
  const hasViewport = Boolean(metadata.hasViewport);
  const hasRobots = Boolean(metadata.hasRobots);
  const hasCanonical = Boolean(metadata.canonical);
  const hasOgTitle = Boolean(metadata.ogTitle);
  const titlePresent = title.trim().length > 0;
  const descriptionPresent = description.trim().length > 0;
  const titleLength = title.trim().length;
  const descriptionLength = description.trim().length;
  const altRatio = imgCount > 0 ? imgWithAlt / imgCount : 1;
  const headingStructureScore =
    h1Count === 1 ? 12 : h1Count === 0 ? -10 : Math.max(-6, 8 - (h1Count - 1) * 2);
  const titleScore = titlePresent
    ? clamp(12 - Math.abs(titleLength - 58) / 6, 4, 12)
    : -14;
  const descriptionScore = descriptionPresent
    ? clamp(14 - Math.abs(descriptionLength - 155) / 10, 4, 14)
    : -14;
  const contentDepthScore = clamp(
    4 +
      Math.min(sectionCount, 8) +
      Math.min(h2Count * 1.5 + h3Count, 12) +
      (pageTextLength > 1200 ? 4 : 0),
    0,
    20
  );
  const linkBalanceScore = clamp(
    4 + Math.min(internalLinkCount / 4, 8) + (externalLinkCount > 0 ? 2 : 0),
    0,
    14
  );

  const seo = clamp(
    38 +
      titleScore +
      descriptionScore +
      headingStructureScore +
      (hasCanonical ? 8 : -6) +
      (hasViewport ? 7 : -10) +
      (hasRobots ? 5 : 0) +
      (hasOgTitle ? 4 : -2) +
      (structuredDataCount > 0 ? 6 : 0) +
      Math.min(contentDepthScore, 8) +
      Math.min(linkBalanceScore, 6)
  );

  const accessibility = clamp(
    42 +
      altRatio * 34 +
      (hasViewport ? 8 : -10) +
      (ariaLabelCount > 0 ? 6 : -4) +
      (formCount > 0 ? 4 : 0) +
      (h1Count === 1 ? 4 : -4)
  );
  const performance = clamp(
    66 -
      Math.min(scriptCount * 1.7, 22) -
      Math.min(imgCount * 0.45, 16) +
      (pageTextLength > 1000 ? 6 : 0) +
      (structuredDataCount > 0 ? 2 : 0) +
      (scriptCount < 10 ? 6 : 0)
  );
  const bestPractices = clamp(
    50 +
      (hasCanonical ? 8 : -8) +
      (hasViewport ? 7 : -10) +
      (hasRobots ? 5 : 0) +
      (structuredDataCount > 0 ? 5 : 0) +
      (metaKeywords ? 2 : 0) -
      (scriptCount > 25 ? 7 : 0) +
      (sectionCount >= 4 ? 4 : -2)
  );
  const overallScore = clamp(Math.round((performance + seo + accessibility + bestPractices) / 4));

  const strengths = [
    titlePresent ? `Title tag present (${titleLength} characters).` : "Title tag is missing.",
    descriptionPresent
      ? `Meta description present (${descriptionLength} characters).`
      : "Meta description is missing.",
    hasViewport ? "Viewport meta is configured for mobile." : "Viewport meta is missing.",
  ];

  if (hasCanonical) strengths.push("Canonical URL is declared.");
  if (structuredDataCount > 0) strengths.push("Structured data is present.");
  if (ariaLabelCount > 0) strengths.push("ARIA labels are present on interactive elements.");

  const weaknesses = [
    h1Count === 1
      ? "Heading hierarchy has a clear primary H1."
      : "Heading hierarchy should be reduced to one clear H1.",
    imgCount > 0 && imgWithAlt < imgCount
      ? "Several images still need descriptive alt text."
      : "Alt text coverage should still be audited.",
    scriptCount > 20
      ? "The page appears script-heavy and may benefit from deferring non-critical JS."
      : "Client-side scripts should still be reviewed for load cost.",
  ];

  return {
    overallScore,
    categories: {
      performance,
      seo,
      accessibility,
      bestPractices,
    },
    summary: `Fallback audit for ${hostname}. The page exposes ${h1Count} H1 tag(s), ${h2Count + h3Count} secondary headings, ${imgCount} image(s), and ${linkCount} link(s), so the scanner still returns a practical baseline report even without an AI response.`,
    strengths,
    weaknesses,
    recommendations: [
      {
        title: "Tighten title + description",
        description:
          "Write a concise, unique title tag and a meta description that better matches the target intent and search query.",
        impact: "High",
      },
      {
        title: "Fix heading hierarchy",
        description:
          "Keep one primary H1, then use H2 and H3 levels to create a cleaner hierarchy for search engines and assistive tech.",
        impact: "Medium",
      },
      {
        title: "Improve image accessibility",
        description:
          "Add descriptive alt text to meaningful images and make decorative assets intentionally empty-alt.",
        impact: "High",
      },
      {
        title: "Reduce client-side weight",
        description:
          "Defer non-critical scripts, remove dead weight, and keep the page lean on slower mobile connections.",
        impact: "Low",
      },
      {
        title: "Validate technical signals",
        description:
          "Keep viewport, canonical, robots, structured data, and Open Graph metadata consistent across templates.",
        impact: "Medium",
      },
    ],
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Scan endpoint — fetch and parse the website
  app.post("/api/scan", async (req, res) => {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      url = url.trim();
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      const targetUrlObj = new URL(url);
      const targetUrl = targetUrlObj.toString();

      const response = await axios.get(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: (status) => status < 400,
      });

      const $ = cheerio.load(response.data);
      const title =
        $("title").text().trim() ||
        $("h1").first().text().trim() ||
        "Untitled Page";
      const description =
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "";
      const h1Count = $("h1").length;
      const h2Count = $("h2").length;
      const h3Count = $("h3").length;
      const imgCount = $("img").length;
      const formCount = $("form").length;
      const linkCount = $("a").length;
      const scriptCount = $("script").length;
      const imgWithAlt = $("img[alt]").length;
      const ariaLabelCount = $("[aria-label]").length;
      const structuredDataCount = $('script[type="application/ld+json"]').length;
      const sectionCount = $("section").length;
      const metaKeywords =
        $('meta[name="keywords"]').attr("content") || "";
      const canonical = $('link[rel="canonical"]').attr("href") || "";
      const ogTitle =
        $('meta[property="og:title"]').attr("content") || "";
      const hasViewport = $('meta[name="viewport"]').length > 0;
      const hasRobots = $('meta[name="robots"]').length > 0;

      $("script, style, noscript, iframe, nav, footer, header").remove();
      const bodyText = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 5000);
      const pageTextLength = bodyText.length;

      let internalLinkCount = 0;
      let externalLinkCount = 0;
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;
        try {
          const resolved = new URL(href, targetUrlObj);
          if (resolved.hostname === targetUrlObj.hostname) internalLinkCount++;
          else externalLinkCount++;
        } catch {
          internalLinkCount++;
        }
      });

      res.json({
        url: targetUrl,
        metadata: {
          title,
          description,
          h1Count,
          h2Count,
          h3Count,
          imgCount,
          formCount,
          linkCount,
          internalLinkCount,
          externalLinkCount,
          scriptCount,
          imgWithAlt,
          ariaLabelCount,
          structuredDataCount,
          sectionCount,
          pageTextLength,
          metaKeywords,
          canonical,
          ogTitle,
          hasViewport,
          hasRobots,
        },
        content: bodyText,
      });
    } catch (error: any) {
      console.error("Scan error:", error.message);
      let msg = "Failed to scan website. ";
      if (error.code === "ECONNABORTED") msg += "Request timed out.";
      else if (error.response) msg += `Site returned ${error.response.status}.`;
      else if (error.code === "ENOTFOUND") msg += "Domain not found.";
      else msg += "Check the URL and try again.";
      res.status(500).json({ error: msg });
    }
  });

  // Analyse endpoint — OpenAI-powered JSON report
  app.post("/api/analyze", async (req, res) => {
    const { scanData } = req.body;
    if (!scanData) return res.status(400).json({ error: "Scan data required" });

    if (!openaiApiKey || openaiApiKey === "MY_OPENAI_API_KEY") {
      return res.json(buildFallbackReport(scanData));
    }

    const prompt = `You are a world-class website auditor, SEO expert, and digital marketing strategist at NNN AI Labs — an international agency that competes with WebFX on high-intent searches.

Analyze this website thoroughly and return ONLY valid JSON (no markdown, no backticks, no preamble):

URL: ${scanData.url}
Page Title: ${scanData.metadata.title}
Meta Description: ${scanData.metadata.description}
H1 Tags: ${scanData.metadata.h1Count}
Images: ${scanData.metadata.imgCount} (${scanData.metadata.imgWithAlt} with alt text)
Links: ${scanData.metadata.linkCount}
Scripts: ${scanData.metadata.scriptCount}
Has Viewport Meta: ${scanData.metadata.hasViewport}
Has Robots Meta: ${scanData.metadata.hasRobots}
Canonical URL: ${scanData.metadata.canonical}
OG Title: ${scanData.metadata.ogTitle}

Page Content Sample:
${scanData.content}

Return this exact JSON schema with realistic scores based on the actual analysis:
{
  "overallScore": <integer 0-100>,
  "categories": {
    "performance": <integer 0-100>,
    "seo": <integer 0-100>,
    "accessibility": <integer 0-100>,
    "bestPractices": <integer 0-100>
  },
  "summary": "<2-3 sentence executive summary mentioning the actual domain>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recommendations": [
    {
      "title": "<short action title>",
      "description": "<specific actionable recommendation for this site>",
      "impact": "High"
    },
    {
      "title": "<short action title>",
      "description": "<specific recommendation>",
      "impact": "Medium"
    },
    {
      "title": "<short action title>",
      "description": "<specific recommendation>",
      "impact": "High"
    },
    {
      "title": "<short action title>",
      "description": "<specific recommendation>",
      "impact": "Low"
    },
    {
      "title": "<short action title>",
      "description": "<specific recommendation>",
      "impact": "Medium"
    }
  ]
}`;

    try {
      const result = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a world-class website auditor, SEO expert, and digital marketing strategist. Return only valid JSON that matches the requested schema.",
          },
          { role: "user", content: prompt },
        ],
      });

      const raw = result.choices[0]?.message?.content || "{}";
      const clean = raw.trim();

      const report = JSON.parse(clean);
      res.json(report);
    } catch (error: any) {
      console.error("OpenAI analysis error:", error.message);
      res.json(buildFallbackReport(scanData));
    }
  });

  // Vite middleware (dev) or static (prod)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 NNN AI Labs server running on http://localhost:${PORT}`);
    console.log(
      `🔑 OpenAI API Key: ${openaiApiKey ? "✅ Configured" : "❌ Missing — add to Secrets panel"}`
    );
  });
}

startServer();
