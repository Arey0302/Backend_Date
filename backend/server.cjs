const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Hàm gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.post('/notify-admin', (req, res) => {
    const { date, food, happiness } = req.body;
    const message = `Món ăn đã chọn: ${food}\nThời gian: ${date}\nMức độ hạnh phúc: ${happiness}/100`;
    transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Thông báo lựa chọn từ user',
      text: message
    })
    .then(() => {
        res.status(200).send('Đã gửi email!');
    })
    .catch((error) => {
        console.error('Lỗi gửi email:', error);
        res.status(500).send('Có lỗi khi gửi email.');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
