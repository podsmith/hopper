import { Column, Entity, Index, ManyToOne, type Relation } from 'typeorm';

import { BaseUserEntity } from '@/database/_typeorm/entities/base';
import { UserRole } from '@/database/_typeorm/entities/user-role';

@Entity('users')
@Index(['role'])
@Index(['isRoot'], {
  unique: true,
  where: 'deleted_at is null and is_root = true',
})
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
