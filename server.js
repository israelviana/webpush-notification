require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let subscriptions = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.get('/send-notification', (req, res) => {
  const payload = JSON.stringify({
    title: 'Notificação!',
    body: 'Você recebeu uma notificação Web Push!'
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });

  res.send('Notificação enviada.');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
