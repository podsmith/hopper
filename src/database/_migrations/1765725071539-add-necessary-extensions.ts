import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNecessaryExtensions1765727076539 implements MigrationInterface {
  extensions = ['citext'];

  public async up(queryRunner: QueryRunner): Promise<void> {
    const extentionQuery = this.extensions
      .map((ext) => `CREATE EXTENSION IF NOT EXISTS ${ext};`)
      .join('\n');

    await queryRunner.query(extentionQuery);
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
        RETURNS BOOLEAN
        LANGUAGE sql
        IMMUTABLE
        RETURNS NULL ON NULL INPUT
        AS $$
            SELECT email ~* '^(?!\\.)(?!.*\\.\\.)([a-z0-9_''+\\-\\.]*)[a-z0-9_+\\-]@([a-z0-9][a-z0-9\\-]*\\.)+[a-z]{2,}$';
        $$;
    `);
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION is_valid_phone(phone TEXT)
        RETURNS BOOLEAN
        LANGUAGE sql
        IMMUTABLE
        RETURNS NULL ON NULL INPUT
        AS $$
            SELECT phone ~ '^\\+[1-9][0-9]{6,14}$';
        $$;
    `);
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION is_valid_person_name(name TEXT)
        RETURNS BOOLEAN
        LANGUAGE sql
        IMMUTABLE
        RETURNS NULL ON NULL INPUT
        AS $$
            SELECT trim(name) ~ '^[A-Za-z]+([ ''-][A-Za-z]+)*$';
        $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const extentionQuery = this.extensions
      .map((ext) => `DROP EXTENSION IF EXISTS ${ext};`)
      .join('\n');

    await queryRunner.query(extentionQuery);
    await queryRunner.query(`DROP FUNCTION IF EXISTS is_valid_email;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS is_valid_phone;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS is_valid_person_name;`);
  }
}
