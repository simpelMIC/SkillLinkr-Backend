import { prisma } from '@database/prisma.js';

async function skillExists({ id }: { id: number }): Promise<boolean> {
  const skill = await prisma.skill.findFirst({
    where: {
      id
    },
    select: { id: true }
  });

  return skill !== null;
}

export { skillExists };
