const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.error('[ERROR] DATABASE_URL is missing. Please set it in .env');
  process.exit(1);
}

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

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
  .finally(async () => {
    await prisma.$disconnect();
  });