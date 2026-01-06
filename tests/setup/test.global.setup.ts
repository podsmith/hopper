import dataSource from '@/database/_migration';
import seederDataSource from '@/database/_seeder';

const setup = async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.runMigrations({ transaction: 'all' });
  await dataSource.destroy();

  await seederDataSource.initialize();
  await seederDataSource.runMigrations({ transaction: 'each' });
  await seederDataSource.destroy();
};

export default setup;
