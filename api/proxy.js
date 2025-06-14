const axios = require("axios");
const tunnel = require("tunnel");

const PROXY = {
  host: '103.162.15.96',
  port: 8947,
  auth: '64UDF:fhd45y',
};

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("https://")) {
    res.status(400).json({ error: "Thiếu hoặc sai query `url`" });
    return;
  }

  try {
    const agent = tunnel.httpsOverHttp({
      proxy: {
        host: PROXY.host,
        port: PROXY.port,
        proxyAuth: PROXY.auth,
      },
    });

    const response = await axios.get(url, {
      httpsAgent: agent,
      timeout: 15000,
      responseType: "text", // trả về raw text, tránh lỗi parse gzip
      decompress: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://cryptorank.io",
        "Referer": "https://cryptorank.io/",
        "Content-Type": "application/json",
      },
    });

    // Forward đúng content-type gốc (nếu có)
    res.setHeader("Content-Type", response.headers["content-type"] || "application/json");

    res.status(200).send(response.data);
  } catch (err) {
    console.error("❌ Proxy lỗi:", err.message);
    res.status(500).json({ error: "Lỗi proxy: " + err.message });
  }
};
