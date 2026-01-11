import dataSource from '@/database/_typeorm/data-source';
import seederDataSource from '@/database/_typeorm/seed-data-source';

const setup = async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.runMigrations({ transaction: 'all' });
  await dataSource.destroy();

  await seederDataSource.initialize();
  await seederDataSource.runMigrations({ transaction: 'each' });
  await seederDataSource.destroy();
};

await setup();
