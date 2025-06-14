const axios = require("axios");

module.exports = async (req, res) => {
  const { url } = req.query;

  // Kiểm tra URL hợp lệ
  if (!url || !url.startsWith("https://")) {
    return res.status(400).json({ error: "Thiếu hoặc sai query `url`" });
  }

  try {
    const response = await axios.get(url, {
      timeout: 15000,
      responseType: "text",
      decompress: true,
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "origin": "https://cryptorank.io",
        "referer": "https://cryptorank.io/",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      },
    });

    res.status(200).send(response.data);
  } catch (err) {
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
