import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialRoles1768063953124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO
        "user_roles" ("id", "name") 
      VALUES
        ('019bab3e-5e65-7325-8970-1c7fbcc365ef', 'Admin'),
        ('019bab3e-5e65-7824-9563-fa680a177983', 'Customer Care Executive'),
        ('019bab3e-5e65-7edf-be7b-90a61dc1791e', 'Residence Coordinator');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM
        "user_roles"
      WHERE
        "id" IN (
          '019bab3e-5e65-7325-8970-1c7fbcc365ef',
          '019bab3e-5e65-7824-9563-fa680a177983',
          '019bab3e-5e65-7edf-be7b-90a61dc1791e'
        );
    `);
  }
}
