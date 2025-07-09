const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Parse body
  let body = '';
  await new Promise((resolve) => {
    req.on('data', chunk => { body += chunk; });
    req.on('end', resolve);
  });
  const { date, food, happiness } = JSON.parse(body);

  // Send mail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const message = `Món ăn đã chọn: ${food}\nThời gian: ${date}\nMức độ hạnh phúc: ${happiness}/100`;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Thông báo lựa chọn từ user',
      text: message
    });
    res.status(200).send('Đã gửi email!');
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    res.status(500).send('Có lỗi khi gửi email.');
  }
};
