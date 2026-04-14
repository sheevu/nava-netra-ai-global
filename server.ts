import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
      const targetUrl = new URL(url).toString();

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
      const imgCount = $("img").length;
      const linkCount = $("a").length;
      const scriptCount = $("script").length;
      const imgWithAlt = $("img[alt]").length;
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

      res.json({
        url: targetUrl,
        metadata: {
          title,
          description,
          h1Count,
          imgCount,
          linkCount,
          scriptCount,
          imgWithAlt,
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

  // Analyse endpoint — Gemini-powered JSON report
  app.post("/api/analyze", async (req, res) => {
    const { scanData } = req.body;
    if (!scanData) return res.status(400).json({ error: "Scan data required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(500).json({
        error:
          "Gemini API Key not configured. Add GEMINI_API_KEY to your .env.local file in AI Studio Secrets panel.",
      });
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
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const raw = result.text || "{}";
      // Strip any accidental markdown fences
      const clean = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      const report = JSON.parse(clean);
      res.json(report);
    } catch (error: any) {
      console.error("Gemini analysis error:", error.message);
      res.status(500).json({
        error: `AI analysis failed: ${error.message}. Check your GEMINI_API_KEY in the Secrets panel.`,
      });
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
      `🔑 Gemini API Key: ${apiKey ? "✅ Configured" : "❌ Missing — add to Secrets panel"}`
    );
  });
}

startServer();
