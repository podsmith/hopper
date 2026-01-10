import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1768052671478 implements MigrationInterface {
  name = 'CreateUsersTable1768052671478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuidv7(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "email" citext NOT NULL,
                "phone" citext NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "CHK_dca6d9e0a52779f5615e748f31" CHECK (is_valid_person_name(last_name)),
                CONSTRAINT "CHK_38a0a0d7fabc6ab47e00f5d89b" CHECK (is_valid_person_name(first_name)),
                CONSTRAINT "CHK_62d3b8b8f324c7a570e1f080fa" CHECK (is_valid_phone(phone)),
                CONSTRAINT "CHK_ee6c42bed2299238e73c72748b" CHECK (char_length(last_name) > 0),
                CONSTRAINT "CHK_48a5070de79afeba733ff0c273" CHECK (char_length(first_name) > 0),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_1f536ec5990f7695570a12f373" ON "users" ("phone")
            WHERE deleted_at is not null
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_bffe012c3638e65ec2f9dddde7" ON "users" ("email")
            WHERE deleted_at is not null
        `);
    await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "id" uuid NOT NULL DEFAULT uuidv7(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "name" character varying NOT NULL,
                CONSTRAINT "CHK_2fadb877d2720aa90aadbce6f9" CHECK ((name ~ '^[a-zA-Z][a-zA-Z0-9_)(\\s-]*$')),
                CONSTRAINT "CHK_975f4648a307e0f9afa84f24de" CHECK (char_length(name) > 0),
                CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_6b4d2aaea1805c54602e7c9269" ON "user_roles" ("name")
            WHERE deleted_at is not null
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6b4d2aaea1805c54602e7c9269"
        `);
    await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_bffe012c3638e65ec2f9dddde7"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1f536ec5990f7695570a12f373"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a2cecd1a3531c0b041e29ba46e"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
