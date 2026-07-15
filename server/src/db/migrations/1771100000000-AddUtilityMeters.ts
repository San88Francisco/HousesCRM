import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUtilityMeters1771100000000 implements MigrationInterface {
  name = 'AddUtilityMeters1771100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$ BEGIN CREATE TYPE "public"."utility_tariff_utility_type_enum" AS ENUM('electricity', 'water_cold', 'water_hot', 'water_subscription', 'gas', 'gas_delivery', 'heating', 'garbage'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
    );
    await queryRunner.query(
      `DO $$ BEGIN CREATE TYPE "public"."meter_reading_utility_type_enum" AS ENUM('electricity', 'water_cold', 'water_hot', 'water_subscription', 'gas', 'gas_delivery', 'heating', 'garbage'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "utility_tariff" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "utility_type" "public"."utility_tariff_utility_type_enum" NOT NULL DEFAULT 'electricity',
        "price_per_unit" numeric(12,2) NOT NULL,
        "valid_from" date NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_utility_tariff_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_utility_tariff_user_type_valid_from" UNIQUE ("userId", "utility_type", "valid_from"),
        CONSTRAINT "FK_utility_tariff_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "meter_reading" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "utility_type" "public"."meter_reading_utility_type_enum" NOT NULL DEFAULT 'electricity',
        "value" numeric(12,2) NOT NULL,
        "reading_date" date NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "houseId" uuid NOT NULL,
        CONSTRAINT "PK_meter_reading_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_meter_reading_value" CHECK ("value" >= 0),
        CONSTRAINT "UQ_meter_reading_house_type_date" UNIQUE ("houseId", "utility_type", "reading_date"),
        CONSTRAINT "FK_meter_reading_house" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_meter_reading_house_type_date" ON "meter_reading" ("houseId", "utility_type", "reading_date")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_meter_reading_house_type_date"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "meter_reading"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "utility_tariff"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."meter_reading_utility_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."utility_tariff_utility_type_enum"`);
  }
}
