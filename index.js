// index.js
const express = require("express");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("https://")) {
    return res.status(400).json({ error: "Thiếu hoặc sai định dạng query `url`" });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const bodyText = await page.evaluate(() => document.body.innerText);
    await browser.close();

    try {
      const json = JSON.parse(bodyText);
      res.json(json);
    } catch {
      res.send(bodyText);
    }
  } catch (err) {
    console.error("❌ Puppeteer error:", err.message);
    res.status(500).json({
      error: "Lỗi khi dùng trình duyệt để bypass Cloudflare",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer proxy server listening on http://localhost:${PORT}`);
});
