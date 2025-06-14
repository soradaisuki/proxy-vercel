// api/proxy.js

const axios = require("axios");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("https://")) {
    res.status(400).json({ error: "Thiếu hoặc sai query `url`" });
    return;
  }

  try {
    const response = await axios.get(url, {
      timeout: 15000,
      responseType: "text",
      decompress: true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://cryptorank.io",
        "Referer": "https://cryptorank.io/",
        "Content-Type": "application/json",
      },
    });

    res.status(200).send(response.data);
  } catch (err) {
    // In ra chi tiết lỗi để debug (hiện trong Vercel logs)
    console.error("❌ Lỗi khi gọi API:", {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      url: err.config?.url,
    });

    res.status(500).json({
      error: "Lỗi khi request",
      message: err.message,
      status: err.response?.status || null,
      data: typeof err.response?.data === "string" ? err.response.data : null,
    });
  }
};
