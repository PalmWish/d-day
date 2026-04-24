const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.error('[ERROR] DATABASE_URL is missing. Please set it in .env');
  process.exit(1);
}

const prisma = require('../src/config/prisma.js');

async function main() {
  const fileName = process.argv[2] || 'booths.json';
  const filePath = path.join(process.cwd(), 'data', fileName);
  const fileExtension = path.extname(fileName).toLowerCase();

  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] Seed file not found at: ${filePath}`);
    process.exit(1);
  }

  let booths = [];

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');

    if (fileExtension === '.json') {
      booths = JSON.parse(rawData);
    } else if (fileExtension === '.csv') {
      const lines = rawData.split('\n').filter((line) => line.trim() !== '');

      if (lines.length <= 1) {
        console.error('[ERROR] CSV file is empty or only contains headers.');
        process.exit(1);
      }

      for (let i = 1; i < lines.length; i++) {
        const [name, description, location, code, qrcode] = lines[i]
          .split(',')
          .map((v) => v.trim());

        booths.push({
          name,
          description: description || 'Booth from CSV',
          location: location || 'See map',
          code: code || name,
          qrcode: qrcode || name,
        });
      }
    }
  } catch (error) {
    console.error(`[ERROR] Failed to parse file: ${error.message}`);
    process.exit(1);
  }

  console.log(`\n--- Starting Seeding from ${fileName} ---`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < booths.length; i++) {
    const booth = booths[i];
    const lineNumber = i + 1;

    const { name, description, location } = booth;
    const code = (booth.code || '').trim();
    const qrcode = (booth.qrcode || '').trim();

    if (!name || !description || !location || !code || !qrcode) {
      console.error(
        `[VALIDATION ERROR] Line ${lineNumber}: Missing required fields — name, description, location, code, qrcode are all required.`
      );
      process.exit(1);
    }

    try {
      const existing = await prisma.booth.findUnique({ where: { code } });

      await prisma.booth.upsert({
        where: { code },
        update: { name, description, location, qrcode },
        create: { name, description, location, code, qrcode },
      });

      if (existing) {
        updatedCount++;
        console.log(`[UPDATED]   Line ${lineNumber}: "${name}" | code: ${code} | qrcode: ${qrcode}`);
      } else {
        insertedCount++;
        console.log(`[INSERTED]  Line ${lineNumber}: "${name}" | code: ${code} | qrcode: ${qrcode}`);
      }
    } catch (error) {
      console.error(`[ERROR] Line ${lineNumber}: Database operation failed — ${error.message}`);
      process.exit(1);
    }
  }

  console.log('\n--- Seeding Summary ---');
  console.log(`Inserted : ${insertedCount}`);
  console.log(`Updated  : ${updatedCount}`);
  console.log(`Total    : ${insertedCount + updatedCount}`);
  console.log('-----------------------\n');
}

main()
  .catch((e) => {
    console.error(`[FATAL ERROR] ${e.message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });