import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { expect, test } from "@playwright/test";

const repoPath = "/mnt/d/CODEX2025-2026/Global-NNN AI Labs/14April-updated-site-global/repo";
const serverCommand = `cd "${repoPath}" && export OPENAI_API_KEY=MY_OPENAI_API_KEY && npm run build && ./scripts/node ./node_modules/tsx/dist/cli.mjs server.ts`;

let serverProcess: ChildProcessWithoutNullStreams | null = null;

test.beforeAll(async () => {
  serverProcess = spawn("C:\\Windows\\System32\\wsl.exe", ["bash", "-lc", serverCommand], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for the server to start"));
    }, 90_000);

    const cleanup = () => clearTimeout(timeout);

    const handleData = (chunk: Buffer) => {
      const output = chunk.toString();
      process.stdout.write(output);
      if (output.includes("server running on http://localhost:3000")) {
        cleanup();
        resolve();
      }
    };

    const handleError = (chunk: Buffer) => {
      process.stderr.write(chunk);
    };

    serverProcess?.stdout?.on("data", handleData);
    serverProcess?.stderr?.on("data", handleError);
    serverProcess?.once("exit", (code) => {
      cleanup();
      reject(new Error(`Server exited before becoming ready (code ${code ?? "unknown"})`));
    });
  });
});

test.afterAll(() => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
});

test.describe("homepage and scan flow", () => {
  test("renders the homepage and generates a report", async ({ page }) => {
    const scanData = {
      url: "https://example.com",
      metadata: {
        title: "Example Domain",
        description: "This domain is for use in illustrative examples in documents.",
        h1Count: 1,
        h2Count: 2,
        h3Count: 1,
        imgCount: 2,
        formCount: 1,
        linkCount: 4,
        internalLinkCount: 3,
        externalLinkCount: 1,
        scriptCount: 1,
        imgWithAlt: 2,
        ariaLabelCount: 2,
        structuredDataCount: 1,
        sectionCount: 3,
        pageTextLength: 820,
        metaKeywords: "example, demo",
        canonical: "https://example.com/",
        ogTitle: "Example Domain",
        hasViewport: true,
        hasRobots: true,
      },
      content: "Example content for the smoke test.",
    };

    const report = {
      overallScore: 86,
      categories: {
        performance: 82,
        seo: 88,
        accessibility: 84,
        bestPractices: 90,
      },
      summary:
        "Example Domain is in solid shape overall, with strong metadata, clear heading structure, and a balanced technical baseline. The main opportunity is to expand content depth and keep improving conversion-focused signals.",
      strengths: [
        "Title tag present (14 characters).",
        "Meta description present (62 characters).",
        "Viewport meta is configured for mobile.",
      ],
      weaknesses: [
        "Heading hierarchy should be reduced to one clear H1.",
        "Alt text coverage should still be audited.",
        "Client-side scripts should still be reviewed for load cost.",
      ],
      recommendations: [
        {
          title: "Tighten title + description",
          description: "Write a concise, unique title tag and a meta description that better matches the target intent and search query.",
          impact: "High",
        },
        {
          title: "Fix heading hierarchy",
          description: "Keep one primary H1, then use H2 and H3 levels to create a cleaner hierarchy for search engines and assistive tech.",
          impact: "Medium",
        },
        {
          title: "Improve image accessibility",
          description: "Add descriptive alt text to meaningful images and make decorative assets intentionally empty-alt.",
          impact: "High",
        },
        {
          title: "Reduce client-side weight",
          description: "Defer non-critical scripts, remove dead weight, and keep the page lean on slower mobile connections.",
          impact: "Low",
        },
        {
          title: "Validate technical signals",
          description: "Keep viewport, canonical, robots, structured data, and Open Graph metadata consistent across templates.",
          impact: "Medium",
        },
      ],
    };

    await page.route("**/api/scan", async (route) => {
      await route.fulfill({ json: scanData });
    });
    await page.route("**/api/analyze", async (route) => {
      await route.fulfill({ json: report });
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async () => undefined,
      });
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => undefined,
        },
      });
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Turn Search Into Revenue")).toBeVisible();
    await expect(page.getByText("Scan Your Website Free")).toBeVisible();

    await page.getByRole("link", { name: /get started/i }).first().click();
    await expect(page.getByRole("heading", { name: /google ads setup/i })).toBeVisible();
    await expect(page).toHaveURL(/\/services\/google-ads-setup$/);
    await page.getByRole("link", { name: /^home$/i }).click();
    await expect(page.getByText("Scan Your Website Free")).toBeVisible();

    await page.getByRole("link", { name: /go silver/i }).click();
    await expect(page.getByRole("heading", { name: /silver/i })).toBeVisible();
    await expect(page).toHaveURL(/\/plans\/silver$/);
    await page.getByRole("link", { name: /^home$/i }).click();
    await expect(page.getByText("Scan Your Website Free")).toBeVisible();

    const input = page.getByPlaceholder("https://yourwebsite.com").first();
    await input.fill("https://example.com");

    await page.getByRole("button", { name: /run free ai scan/i }).first().click();

    await expect(page.getByText("Website Audit Report")).toBeVisible({ timeout: 120_000 });
    await expect(page.getByText("Category breakdown")).toBeVisible();
    await expect(page.getByText("Optimization Radar")).toBeVisible();
    await expect(page.getByText("6-Month Growth Projection")).toBeVisible();
    await expect(page.getByText("Growth Recommendations")).toBeVisible();
    await expect(page.getByText("Executive Summary")).toBeVisible();

    await page.getByLabel("Share report").click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByLabel("Download report").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("example.com");
  });
});
