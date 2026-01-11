import { DataSource } from 'typeorm';

import { typeOrmMigrationOptions } from '@/configs/_typeorm';

const dataSource = new DataSource(typeOrmMigrationOptions);
export default dataSource;
