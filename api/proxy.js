const axios = require("axios");
const tunnel = require("tunnel");

const PROXY = {
  host: '103.162.15.96',
  port: 8947,
  auth: '64UDF:fhd45y'
};

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: "Thiếu query `url`" });
    return;
  }

  try {
    const agent = tunnel.httpsOverHttp({
      proxy: {
        host: PROXY.host,
        port: PROXY.port,
        proxyAuth: PROXY.auth
      }
    });

    const response = await axios.get(url, {
      httpsAgent: agent,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("❌ Proxy lỗi:", err.message);
    res.status(500).json({ error: "Lỗi proxy: " + err.message });
  }
};
