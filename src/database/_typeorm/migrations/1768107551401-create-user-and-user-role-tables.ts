import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndUserRoleTables1768107551401 implements MigrationInterface {
  name = 'CreateUserAndUserRoleTables1768107551401';

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
                "image_key" citext,
                "is_root" boolean NOT NULL DEFAULT false,
                "role_id" uuid NOT NULL,
                CONSTRAINT "CHK_dca6d9e0a52779f5615e748f31" CHECK (is_valid_person_name(last_name)),
                CONSTRAINT "CHK_38a0a0d7fabc6ab47e00f5d89b" CHECK (is_valid_person_name(first_name)),
                CONSTRAINT "CHK_62d3b8b8f324c7a570e1f080fa" CHECK (is_valid_phone(phone)),
                CONSTRAINT "CHK_3a544638a1fc6f89da9eaa5af2" CHECK (
                    image_key is null
                    or char_length(image_key) > 10
                ),
                CONSTRAINT "CHK_ee6c42bed2299238e73c72748b" CHECK (char_length(last_name) > 0),
                CONSTRAINT "CHK_48a5070de79afeba733ff0c273" CHECK (char_length(first_name) > 0),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_ca75e7d14ec1d5cfb9d5140e16" ON "users" ("image_key")
            WHERE deleted_at is null
                and image_key is not null
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_6d2dce4f596bcf6daea0d2df46" ON "users" ("phone")
            WHERE deleted_at is null
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_10cea423e3e4924f7a3c24b7ba" ON "users" ("email")
            WHERE deleted_at is null
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_4b21adb5e0db79555d17444cda" ON "users" ("is_root")
            WHERE deleted_at is null
                and is_root = true
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "id" uuid NOT NULL DEFAULT uuidv7(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "name" character varying NOT NULL,
                CONSTRAINT "CHK_6e81e308d5973542f9b8a0e19f" CHECK (name ~ '^[a-zA-Z][a-zA-Z0-9_)(\\s-]*$'),
                CONSTRAINT "CHK_975f4648a307e0f9afa84f24de" CHECK (char_length(name) > 0),
                CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_4b7c50b441464046c7ce59b84d" ON "user_roles" ("name")
            WHERE deleted_at is null
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
            DROP INDEX "public"."IDX_4b7c50b441464046c7ce59b84d"
        `);
    await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a2cecd1a3531c0b041e29ba46e"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4b21adb5e0db79555d17444cda"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_10cea423e3e4924f7a3c24b7ba"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6d2dce4f596bcf6daea0d2df46"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ca75e7d14ec1d5cfb9d5140e16"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
