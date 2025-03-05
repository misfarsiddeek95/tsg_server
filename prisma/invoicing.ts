import { Prisma } from '@prisma/client';

export const goaTiers: Prisma.GOATiersCreateManyInput[] = [
  {
    id: 1,
    discription: 'Tier 1',
    tier_code: 't1'
  },
  {
    id: 2,
    discription: 'Tier 2',
    tier_code: 't2'
  },
  {
    id: 3,
    discription: 'Tier 1D',
    tier_code: 't1d'
  }
];
