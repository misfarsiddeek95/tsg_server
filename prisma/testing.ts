/**
 * custom seed file to generate dummy accounts on demand for testing purpose
 * 25-03-2024
 * Banuka / Gishan
 * ---->>>> run this using TERMINAL COMMAND ->>>
 * yarn ts-node prisma/testing.ts
 * <<<<<< -----
 */

import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();
import { isUserExist, isUsernameExist } from './create-non-tutor';
import { createTutor } from './create-tutor';

async function main() {
  console.log(`Start seeding dummy accounts...\n`);

  // -------------------------------
  // -------------------------------
  // -------------------------------
  // SET/UPDATE Following data as needed.
  // -------------------------------

  //add a plain email. without + sign
  const baseEmail = 'tutor@tsg.com';
  const accountsNeeded = 5;

  // const candidateLevel = 2; //Application-F
  const candidateLevel = 3; //ESA
  // const candidateLevel = 4; //PI
  //   const candidateLevel = 5; //TI
  //   const candidateLevel = 6; //FAS

  // -------------------------------
  // -------------------------------
  // -------------------------------
  // DO NOT CHANGE FROM HERE ONWARDS
  // -------------------------------
  const maxTspId = await prisma.user.findFirst({
    select: { tsp_id: true },
    orderBy: {
      tsp_id: 'desc'
    }
  });
  console.log('maxTspId', maxTspId);

  if (
    maxTspId &&
    maxTspId.tsp_id &&
    maxTspId.tsp_id > 0 &&
    accountsNeeded > 0
  ) {
    let tsp_id = maxTspId.tsp_id;
    let createdCount = 0;
    console.log(`tsp_id \t\tusername \tfname \tlname\n`);
    for (let i = 1; i <= 100; i++) {
      if (createdCount === accountsNeeded) {
        break;
      }
      const append_part = `+${candidateLevel}_${String(i).padStart(4, '0')}@`;
      const username = baseEmail.replace('@', append_part);
      if (!!(await isUsernameExist(username))) {
        continue;
      }

      tsp_id++;
      const fname =
        baseEmail.split('@')[0].charAt(0).toUpperCase() +
        baseEmail.split('@')[0].slice(1);
      const lname =
        'ACC' +
        Array.from({ length: 5 }, () =>
          'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26))
        ).join('');

      !(await isUserExist(tsp_id)) &&
        (await createTutor(tsp_id, username, fname, lname, candidateLevel));
      console.log(`${username} \t${tsp_id} \t${fname} \t${lname}`);

      createdCount++;
    }

    console.log(
      `\nCreated candidate accounts of level: ${candidateLevel} with password: b`
    );
  }

  console.log(`\nSeeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
