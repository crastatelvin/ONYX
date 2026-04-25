import { chromium } from "playwright";

const baseUrl = "http://localhost:5173/";
const outputDir = "C:/Users/Administrator/Desktop/ONYX/artifacts/screenshots";
const viewport = { width: 1920, height: 1080 };

async function capture(name, page) {
  await page.screenshot({
    path: `${outputDir}/${name}.png`,
    fullPage: true
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewportSize: viewport });

try {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);

  await capture("01-dashboard-overview", page);

  await page.getByRole("button", { name: /Zero-Shot Classification/i }).click();
  await page.waitForTimeout(800);
  await page.fill("textarea", "The spacecraft navigation software was upgraded with a resilient guidance algorithm.");
  await capture("02-zero-shot-classification", page);

  await page.getByRole("button", { name: /Text Summarization/i }).click();
  await page.waitForTimeout(800);
  await page.fill(
    "textarea",
    "Edge AI enables models to run locally on devices. This reduces latency, improves privacy, and lowers cloud dependency. Teams can still ship modern experiences while keeping user data on-device."
  );
  await capture("03-summarization-input-ready", page);

  await page.getByRole("button", { name: /Question Answering/i }).click();
  await page.waitForTimeout(800);
  await page.fill("textarea", "The Eiffel Tower is in Paris and was designed by Gustave Eiffel's company.");
  await page.fill("input[placeholder='Your question...']", "Who designed the Eiffel Tower?");
  await capture("04-question-answering-ready", page);

  await page.getByRole("button", { name: /Translation/i }).click();
  await page.waitForTimeout(800);
  await page.fill("textarea", "Artificial intelligence is changing every industry.");
  await page.getByRole("button", { name: /INITIALIZE MODEL/i }).click();
  await page.waitForTimeout(1800);
  await capture("05-translation-model-loading", page);
} finally {
  await browser.close();
}
