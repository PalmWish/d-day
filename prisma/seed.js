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

  let booths =[];
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    if (fileExtension === '.json') {
      booths = JSON.parse(rawData);
    } 
    else if (fileExtension === '.csv') {
      const lines = rawData.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length <= 1) {
        console.error(`[ERROR] CSV file is empty or only contains headers.`);
        process.exit(1);
      }

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (!values[0]) {
          console.error(`[VALIDATION ERROR] Line ${i + 1}: Data format incorrect (Missing columns).`);
          process.exit(1);
        }

        booths.push({
          name: values[0],        
          code: values[0],        
          description: "Booth from CSV", 
          location: "See map"
        });
      }
    }
  } catch (error) {
    console.error(`[ERROR] Failed to parse JSON: ${error.message}`);
    process.exit(1);
  }
  

  console.log(`--- Starting Seeding from ${fileName} ---`);
  
  let insertedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < booths.length; i++) {
    const booth = booths[i];
    const lineNumber = i + 1;
    const boothCode = (booth.code || booth.name || '').trim();

    if (!booth.name || !booth.location || !boothCode) {
      console.error(`[VALIDATION ERROR] Line ${lineNumber}: 
        Missing required fields (name, location, or code).`);
      process.exit(1); 
    }

    try {
      await prisma.booth.upsert({
        where: { code: boothCode },
        update: {
          name: booth.name,
          description: booth.description,
          location: booth.location,
        },
        create: {
          name: booth.name,
          code: boothCode,
          description: booth.description,
          location: booth.location,
        },
      });

      insertedCount++;
      console.log(`[SUCCESS] Line ${lineNumber}: Processed booth "${booth.name}"`);

    } catch (error) {
      console.error(`[ERROR] Line ${lineNumber}: Database operation failed - ${error.message}`);
      process.exit(1);
    }
  }
  

  console.log(`\n--- Seeding Summary ---`);
  console.log(`Total processed: ${insertedCount}`);
  console.log(`Total skipped: ${skippedCount}`);
  console.log(`-----------------------\n`);



}

main()
  .catch((e) => {
    console.error(`[FATAL ERROR] ${e.message}`);
    process.exit(1);
  })

  //------------------seedBooths-------------------------------------
  async function seedBooths() {
  const booths = [
    { name: "A01", qrcode: "e98ed" }, { name: "A02", qrcode: "b2328" },
    { name: "A03", qrcode: "6d914" }, { name: "A04", qrcode: "e394e" },
    { name: "A05", qrcode: "f6a9a" }, { name: "A06", qrcode: "6d737" },
    { name: "A07", qrcode: "489cb" }, { name: "A08", qrcode: "e05cb" },
    { name: "A09", qrcode: "45351" }, { name: "A10", qrcode: "ad060" },
    { name: "A11", qrcode: "37b5b" }, { name: "A12", qrcode: "91bec" },
    { name: "B01", qrcode: "83aa0" }, { name: "B02", qrcode: "744d1" },
    { name: "B03", qrcode: "3f572" }, { name: "B04", qrcode: "2d12e" },
    { name: "B05", qrcode: "ec2cb" }, { name: "B06", qrcode: "d2406" },
    { name: "B07", qrcode: "db625" }, { name: "B08", qrcode: "5bfe0" },
    { name: "B09", qrcode: "b7721" }, { name: "C01", qrcode: "132bf" },
    { name: "C02", qrcode: "371e0" }, { name: "C03", qrcode: "0dfab" },
    { name: "C04", qrcode: "34a44" }, { name: "C05", qrcode: "12754" },
    { name: "D01", qrcode: "779c5" }, { name: "D02", qrcode: "f29bc" },
    { name: "D03", qrcode: "51b1b" }, { name: "D04", qrcode: "f727a" },
    { name: "E01", qrcode: "e7e7d" }, { name: "E02", qrcode: "d1347" },
    { name: "E03", qrcode: "1454e" }, { name: "E04", qrcode: "bf3d2" },
    { name: "E05", qrcode: "26e2b" }, { name: "E06", qrcode: "51afa" },
    { name: "E07", qrcode: "99e39" }, { name: "E08", qrcode: "d6f62" },
    { name: "E09", qrcode: "5f6a4" }
  ];

  console.log('--- Start Seeding Booths ---');

  for (const booth of booths) {
    try {
      await prisma.booth.upsert({
        where: { code: booth.name },
        update: { name: booth.name },
        create: {
          name: booth.name,
          code: booth.name,
          description: `Booth ${booth.name}`,
          location: "See map"
        }
      });
      console.log(`[SUCCESS] Seeded booth: ${booth.name}`);
    } catch (error) {
      console.error(`[ERROR] Failed to seed booth ${booth.name}:`, error.message);
    }
  }

  console.log('--- Seeding Booths Finished ---');
}

seedBooths()
  .catch((e) => {
    console.error('[FATAL] Seed process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });