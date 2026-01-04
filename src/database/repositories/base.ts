import type {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';

import { ErrorMessage } from '@/constants/error-message';
import type { BaseSerialEntity } from '@/database/entities/base';
import dataSource from '@/database/source';
import {
  getTypeOrmEntityPluralName,
  getTypeOrmEntitySingularName,
} from '@/lib/typeorm/decorators/named-entity';
import type { NonEmptyArray } from '@/types/utils';
import { NotFoundError } from '@/utils/error';

export const getEntityRepository = <T extends BaseSerialEntity>(
  entity: EntityTarget<T>,
  manager: EntityManager = dataSource.manager,
) => {
  return manager.getRepository(entity).extend({
    async paginate(
      page: number,
      limit: number,
      options: Omit<FindManyOptions<T>, 'skip' | 'take'>,
    ) {
      const skip = (page - 1) * limit;

      const [records, totalRecords] = await this.findAndCount({
        ...options,
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(totalRecords / limit);
      const nextPage = page < totalPages ? page + 1 : undefined;
      const prevPage = page > 1 ? page - 1 : undefined;

      const meta = {
        totalRecords,
        totalPages,
        nextPage,
        prevPage,
        currPage: page,
      };

      return [records, meta] as const;
    },
    async findOneOrFail(options: FindOneOptions<T>) {
      const record = await this.findOne(options);

      if (!record) {
        throw new NotFoundError(
          ErrorMessage.Fields.KeyNotFound(
            getTypeOrmEntitySingularName(entity).toLocaleLowerCase(),
          ),
        );
      }

      return record;
    },
    async findManyOrFail(
      options: FindManyOptions<T>,
    ): Promise<NonEmptyArray<T>> {
      // oxlint-disable-next-line unicorn/no-array-callback-reference
      const records = await this.find(options);

      if (records.length > 0) {
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        return records as NonEmptyArray<T>;
      }

      throw new NotFoundError(
        ErrorMessage.Fields.KeyNotFound(
          getTypeOrmEntityPluralName(entity).toLocaleLowerCase(),
        ),
      );
    },
  });
};
