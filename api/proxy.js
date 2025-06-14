export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Thiếu tham số ?url" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "origin": "https://cryptorank.io",
        "referer": "https://cryptorank.io/",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "accept-encoding": "gzip, deflate, br", // Dù fetch không xử lý nén, giữ lại cho sát thật
      },
    });

    // Forward header loại content-type
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");

    // Lấy body dưới dạng text (do có thể là gzip hoặc JSON)
    const body = await response.text();

    res.status(response.status).send(body);
  } catch (error) {
    res.status(500).json({ error: `Lỗi proxy: ${error.message}` });
  }
}
