import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNecessaryExtensions1765727076539 implements MigrationInterface {
  extensions = ['citext'];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.extensions.map((ext) =>
        queryRunner.query(`CREATE EXTENSION IF NOT EXISTS ${ext};`),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.extensions.map((ext) =>
        queryRunner.query(`DROP EXTENSION IF EXISTS ${ext};`),
      ),
    );
  }
}
