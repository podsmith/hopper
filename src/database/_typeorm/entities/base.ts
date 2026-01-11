import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseUuidEntity extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', default: () => 'uuidv7()' })
  id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;
}

@Check('char_length(first_name) > 0')
@Check('char_length(last_name) > 0')
@Check('is_valid_phone(phone)')
@Check('is_valid_person_name(first_name)')
@Check('is_valid_person_name(last_name)')
@Index(['email'], { unique: true, where: 'deleted_at is null' })
@Index(['phone'], { unique: true, where: 'deleted_at is null' })
export abstract class BaseUserEntity extends BaseUuidEntity {
  @Column({ type: 'varchar' })
  firstName?: string;

  @Column({ type: 'varchar' })
  lastName?: string;

  @Column({ type: 'citext' })
  email?: string;

  @Column({ type: 'citext' })
  phone?: string;
}
