import { DataSource } from 'typeorm';

import { typeOrmSeederOptions } from '@/configs/database';

const seederDataSource = new DataSource(typeOrmSeederOptions);
export default seederDataSource;
