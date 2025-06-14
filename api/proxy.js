// File: /pages/api/proxy.js hoặc /api/proxy.js (tùy cấu trúc)
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://api.cryptorank.io/v0/funding-rounds-v2/find?search=zeta', {
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://cryptorank.io',
        'referer': 'https://cryptorank.io/',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
      },
      decompress: true
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error('❌ Request lỗi:', err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Đã xảy ra lỗi khi truy vấn API'
    });
  }
}
