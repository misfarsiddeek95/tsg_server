import { Prisma } from '@prisma/client';

export const slotMovementsTypes: Prisma.GOASlotMovementTypeCreateInput[] = [
  {
    code: 'ACTIVATED',
    name: 'Active'
  },
  {
    code: 'DEACTIVATED',
    name: 'Deactive'
  }
];
