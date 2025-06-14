const express = require("express");
const puppeteer = require("puppeteer-core");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const executablePath = "/opt/render/.cache/puppeteer/chrome/linux-137.0.7151.70/chrome-linux64/chrome";

app.get("/api/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "Thiếu hoặc sai định dạng query `url`" });
  }

  try {
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const content = await page.content();
    const text = await page.evaluate(() => document.body.innerText);

    await browser.close();

    try {
      return res.json(JSON.parse(text));
    } catch {
      return res.send(text || content);
    }
  } catch (err) {
    console.error("❌ Puppeteer error:", err.message);
    return res.status(500).json({
      error: "Lỗi khi dùng trình duyệt để bypass Cloudflare",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer proxy server listening on http://localhost:${PORT}`);
});
