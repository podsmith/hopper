import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  type Relation,
} from 'typeorm';

import { BaseUuidEntity } from '@/database/_entities/base';
import { UserRole } from '@/database/_entities/user-role';

@Entity('users')
@Check('char_length(first_name) > 0')
@Check('char_length(last_name) > 0')
@Check('is_valid_phone(phone)')
@Check('is_valid_person_name(first_name)')
@Check('is_valid_person_name(last_name)')
@Index(['email'], { unique: true, where: 'deleted_at is not null' })
@Index(['phone'], { unique: true, where: 'deleted_at is not null' })
@Index(['role'])
export class User extends BaseUuidEntity {
  @Column({ type: 'varchar' })
  firstName?: string;

  @Column({ type: 'varchar' })
  lastName?: string;

  @Column({ type: 'citext' })
  email?: string;

  @Column({ type: 'citext' })
  phone?: string;

  @ManyToOne(() => UserRole, (role) => role.user, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  role?: Relation<UserRole>;
}
