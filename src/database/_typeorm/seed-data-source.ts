import { DataSource } from 'typeorm';

import { typeOrmSeederOptions } from '@/configs/_typeorm';

const seederDataSource = new DataSource(typeOrmSeederOptions);
export default seederDataSource;
