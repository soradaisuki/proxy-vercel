const axios = require("axios");
const tunnel = require("tunnel");

const PROXY = {
  host: "103.162.15.96",
  port: 8947,
  auth: "64UDF:fhd45y"
};

module.exports = async (req, res) => {
  const { method, url, headers, data } = req.body || {};

  if (!url || !method) {
    return res.status(400).json({ error: "Thiếu `url` hoặc `method` trong body." });
  }

  try {
    const agent = tunnel.httpsOverHttp({
      proxy: {
        host: PROXY.host,
        port: PROXY.port,
        proxyAuth: PROXY.auth
      }
    });

    const response = await axios({
      method,
      url,
      data,
      headers,
      timeout: 10000,
      httpsAgent: agent
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("❌ Proxy lỗi:", err.message);
    res.status(500).json({ error: "Lỗi proxy: " + err.message });
  }
};
