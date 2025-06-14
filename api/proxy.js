const axios = require("axios");

/**
 * Proxy API cho phép bypass CORS + Cloudflare bằng cách giả lập request từ trình duyệt iPhone.
 * Triển khai trên Vercel dưới dạng API Function.
 */
module.exports = async (req, res) => {
  const { url } = req.query;

  // Kiểm tra query `url`
  if (!url || !url.startsWith("https://")) {
    return res.status(400).json({ error: "Thiếu hoặc sai định dạng query `url`" });
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
        "user-agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      },
    });

    // Trả về nội dung nhận được từ API gốc
    res.status(200).send(response.data);
  } catch (err) {
    const status = err.response?.status || 500;

    console.error("❌ Lỗi khi gọi API:", {
      message: err.message,
      status: status,
      statusText: err.response?.statusText,
      url: err.config?.url,
    });

    res.status(status).json({
      error: "Lỗi khi request",
      message: err.message,
      status: status,
      data: typeof err.response?.data === "string" ? err.response.data : null,
    });
  }
};
