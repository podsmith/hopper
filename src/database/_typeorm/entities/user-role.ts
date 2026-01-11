import {
  Check,
  Column,
  Entity,
  Index,
  OneToMany,
  type Relation,
} from 'typeorm';

import { BaseUuidEntity } from '@/database/_typeorm/entities/base';
import { User } from '@/database/_typeorm/entities/user';

@Entity('user_roles')
@Check('char_length(name) > 0')
@Check(String.raw`name ~ '^[a-zA-Z][a-zA-Z0-9_)(\\s-]*$'`)
@Index(['name'], { unique: true, where: 'deleted_at is null' })
export class UserRole extends BaseUuidEntity {
  @Column({ type: 'varchar' })
  name?: string;

  @OneToMany(() => User, (user) => user.role, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  user?: Relation<User>;
}
