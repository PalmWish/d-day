const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.error('[ERROR] DATABASE_URL is missing. Please set it in .env');
  process.exit(1);
}

const prisma = require('../src/config/prisma.js');

// ----------------------------------------------------------------------
// 1. ฟังก์ชัน Seed ตาราง Booths (รองรับทั้ง JSON และ CSV)
// ----------------------------------------------------------------------
async function seedBooths() {
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
        const [booth_id, project_name, category, rawMembers, advisor, project_type, code] = lines[i]
          .split(',')
          .map((v) => (v ? v.trim() : ''));

        booths.push({
          booth_id: booth_id || `UNK-${i}`,
          project_name: project_name || 'ไม่มีชื่อโปรเจกต์',
          category: category || 'ไม่ระบุหมวดหมู่',
          members: rawMembers ? rawMembers.split('|').map(m => m.trim()) : [],
          advisor: advisor || 'ไม่ระบุอาจารย์ที่ปรึกษา',
          project_type: project_type || 'ไม่ระบุประเภท',
          code: code || `CODE-${i}`,
        });
      }
    }
  } catch (error) {
    console.error(`[ERROR] Failed to parse file: ${error.message}`);
    process.exit(1);
  }

  console.log(`\n--- Starting Seeding Booths from ${fileName} ---`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < booths.length; i++) {
    const booth = booths[i];
    const lineNumber = i + 1;

    const { booth_id, project_name, category, members, advisor, project_type } = booth;
    const code = (booth.code || '').trim();

    if (!booth_id || !project_name || !category || !advisor || !project_type || !code) {
      console.error(
        `[VALIDATION ERROR] Line ${lineNumber}: Missing required fields — booth_id, project_name, category, advisor, project_type, code.`
      );
      process.exit(1);
    }

    const validMembers = Array.isArray(members) ? members : [];

    try {
      const existing = await prisma.booth.findUnique({ where: { code } });

      await prisma.booth.upsert({
        where: { code },
        update: { 
          booth_id,
          project_name, 
          category, 
          members: validMembers, 
          advisor, 
          project_type 
        },
        create: { 
          booth_id,
          project_name, 
          category, 
          members: validMembers, 
          advisor, 
          project_type, 
          code 
        },
      });

      if (existing) {
        updatedCount++;
        console.log(`[UPDATED]   Line ${lineNumber}: [${booth_id}] "${project_name}" | code: ${code}`);
      } else {
        insertedCount++;
        console.log(`[INSERTED]  Line ${lineNumber}: [${booth_id}] "${project_name}" | code: ${code}`);
      }
    } catch (error) {
      console.error(`[ERROR] Line ${lineNumber}: Database operation failed — ${error.message}`);
      process.exit(1);
    }
  }

  console.log('\n--- Booths Seeding Summary ---');
  console.log(`Inserted : ${insertedCount}`);
  console.log(`Updated  : ${updatedCount}`);
  console.log(`Total    : ${insertedCount + updatedCount}`);
}

// ----------------------------------------------------------------------
// 2. ฟังก์ชัน Seed ตาราง Role Thresholds
// ----------------------------------------------------------------------
async function seedRoleThresholds() {
  console.log('\n--- Seeding Role Thresholds ---');

  const thresholds = [
    { role: 'SIT_STUDENT', required_stamps: 6, required_votes: 3 },
    { role: 'STUDENT',     required_stamps: 6, required_votes: 3 },
    { role: 'GUEST',       required_stamps: 6, required_votes: 3 },
    { role: 'ADMIN',       required_stamps: 0, required_votes: 3 },
  ];

  for (const threshold of thresholds) {
    try {
      await prisma.roleThreshold.upsert({
        where:  { role: threshold.role },
        update: { required_stamps: threshold.required_stamps, required_votes: threshold.required_votes },
        create: { role: threshold.role, required_stamps: threshold.required_stamps, required_votes: threshold.required_votes },
      });
      console.log(
        `[UPSERTED]  role: ${threshold.role} | required_stamps: ${threshold.required_stamps} | required_votes: ${threshold.required_votes}`
      );
    } catch (error) {
      console.error(`[ERROR] Failed to seed role threshold for ${threshold.role} —`, error);
      process.exit(1);
    }
  }
}

// ----------------------------------------------------------------------
// 3. ฟังก์ชัน Seed ตาราง Period Configs
// ----------------------------------------------------------------------
async function seedPeriodConfigs() {
  console.log('\n--- Seeding Period Configs ---');

  const periods = [
    {
      type:     'STAMPING',
      start_at: new Date('2026-04-27T09:00:00+07:00'),
      end_at:   new Date('2026-04-27T15:30:00+07:00'),
    },
    {
      type:     'VOTING',
      start_at: new Date('2026-04-27T09:00:00+07:00'),
      end_at:   new Date('2026-04-27T15:30:00+07:00'),
    },
  ];

  for (const period of periods) {
    try {
      await prisma.periodConfig.upsert({
        where:  { type: period.type },
        update: { start_at: period.start_at, end_at: period.end_at },
        create: { type: period.type, start_at: period.start_at, end_at: period.end_at },
      });
      console.log(
        `[UPSERTED]  type: ${period.type} | start: ${period.start_at.toISOString()} → end: ${period.end_at.toISOString()}`
      );
    } catch (error) {
      console.error(`[ERROR] Failed to seed period config for ${period.type} —`, error);
      process.exit(1);
    }
  }
}

// ----------------------------------------------------------------------
// 4. Main Execution (รันตามลำดับ)
// ----------------------------------------------------------------------
async function main() {
  await seedBooths();
  await seedRoleThresholds();
  await seedPeriodConfigs();

  console.log('\n✅ All 3 tables have been successfully seeded.\n');
}

main()
  .catch((e) => {
    console.error(`[FATAL ERROR] ${e.message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });