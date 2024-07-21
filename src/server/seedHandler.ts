import PermissionSeeder from '@database/seeders/permissions.js';
import RolesSeeder from '@database/seeders/roles.js';
import SkillCategoriesSeeder from '@database/seeders/skillCategories.js';
import SkillsSeeder from '@database/seeders/skills.js';

async function seedHandler() {
  await Promise.all([
    PermissionSeeder(),
    RolesSeeder(),
    SkillCategoriesSeeder()
  ]);
  // ! Explicit called later because skill categories must be seeded first
  await SkillsSeeder();
  console.info('Database seeded');
}

export { seedHandler };
