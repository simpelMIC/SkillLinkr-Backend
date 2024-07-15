import PermissionSeeder from '@database/seeders/permissions.js';
import RolesSeeder from '@database/seeders/roles.js';

async function seedHandler() {
  await Promise.all([PermissionSeeder(), RolesSeeder()]);
  console.info('Database seeded');
}

export { seedHandler };
