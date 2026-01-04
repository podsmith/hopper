import { DataSource } from 'typeorm';

import { typeOrmMigrationOptions } from '@/configs/database';

const dataSource = new DataSource(typeOrmMigrationOptions);
export default dataSource;
