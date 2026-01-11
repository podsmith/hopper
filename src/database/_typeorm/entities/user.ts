import { Column, Entity, Index, ManyToOne, type Relation } from 'typeorm';

import { BaseUserEntity } from '@/database/_typeorm/entities/base';
import { UserRole } from '@/database/_typeorm/entities/user-role';

@Entity('users')
@Index(['role'])
export class User extends BaseUserEntity {
  @Column({ type: 'boolean', default: false })
  isRoot?: boolean;

  @ManyToOne(() => UserRole, (role) => role.user, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  role?: Relation<UserRole>;
}
