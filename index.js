const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("https://")) {
    return res.status(400).json({ error: "Thiếu hoặc sai định dạng query `url`" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--proxy-server=http://103.162.15.96:8947',
      ]
    });

    const page = await browser.newPage();

    await page.authenticate({
      username: "64UDF",
      password: "fhd45y"
    });

    await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const content = await page.content();
    const bodyText = await page.evaluate(() => document.body.innerText);

    await browser.close();

    try {
      const json = JSON.parse(bodyText);
      res.json(json);
    } catch {
      res.send(bodyText || content);
    }
  } catch (err) {
    console.error("❌ Puppeteer error:", err.message);
    res.status(500).json({ error: "Lỗi khi dùng trình duyệt để bypass Cloudflare", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer proxy server listening on http://localhost:${PORT}`);
});
