import 'reflect-metadata';

import {
  Entity,
  type EntityOptions,
  type EntityTarget,
  type ObjectLiteral,
} from 'typeorm';

const TO_ENTITY_SINGULAR_NAME_KEY = 'TYPEORM_TABLE_SINGULAR_NAME_KEY';
const TO_ENTITY_PLURAL_NAME_KEY = 'TYPEORM_TABLE_PLURAL_NAME_KEY';

export type NamedEntityOptions = Omit<EntityOptions, 'name'> & {
  table: string;
  singular: string;
  plural: string;
};

export function NamedEntity(options: NamedEntityOptions): ClassDecorator {
  return function (target) {
    const { table, singular, plural } = options;
    Reflect.defineMetadata(TO_ENTITY_SINGULAR_NAME_KEY, singular, target);
    Reflect.defineMetadata(TO_ENTITY_PLURAL_NAME_KEY, plural, target);
    Entity(table, options)(target);
  };
}

export function getTypeOrmEntitySingularName(
  entity: EntityTarget<ObjectLiteral>,
) {
  // oxlint-disable-next-line no-unsafe-function-type ban-types
  const target: Function =
    typeof entity === 'function' ? entity : entity.constructor;
  return `${Reflect.getMetadata(TO_ENTITY_SINGULAR_NAME_KEY, target)}`;
}

export function getTypeOrmEntityPluralName(
  entity: EntityTarget<ObjectLiteral>,
) {
  // oxlint-disable-next-line no-unsafe-function-type ban-types
  const target: Function =
    typeof entity === 'function' ? entity : entity.constructor;
  return `${Reflect.getMetadata(TO_ENTITY_PLURAL_NAME_KEY, target)}`;
}
