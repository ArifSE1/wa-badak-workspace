const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({ authStrategy: new LocalAuth(), puppeteer: { headless: true } });

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WA Badak siap! Jangan close Codespace/laptop 😎');
});

client.on('auth_failure', msg => {
  console.error('Auth gagal:', msg);
});

client.initialize();
