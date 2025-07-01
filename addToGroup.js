const fs = require('fs');
const csv = require('csv-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');

if (process.argv.length < 4) {
  console.error('Usage: node addToGroup.js <file.csv> <Nama Grup>');
  process.exit(1);
}

const file = process.argv[2];
const groupName = process.argv[3];
const numbers = [];

fs.createReadStream(file)
  .pipe(csv())
  .on('data', row => {
    const num = row.number.replace(/\\D/g, '');
    numbers.push(num + '@c.us');
  })
  .on('end', startAdd);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function startAdd() {
  const client = new Client({ authStrategy: new LocalAuth(), puppeteer: { headless: true } });
  client.on('ready', async () => {
    console.log(`Masukin ${numbers.length} nomor ke grup "${groupName}"...`);
    const chat = (await client.getChats()).find(c => c.isGroup && c.name === groupName);
    if (!chat) {
      console.error('Grup tidak ditemukan!');
      return process.exit(1);
    }
    for (const id of numbers) {
      try {
        await chat.addParticipants([id]);
        console.log('✅ Added', id);
      } catch (err) {
        console.error('❌ Error add', id, err.message);
      }
      await sleep(4000);
    }
    console.log('👊 Selesai semua!');
    process.exit(0);
  });
  client.initialize();
}
