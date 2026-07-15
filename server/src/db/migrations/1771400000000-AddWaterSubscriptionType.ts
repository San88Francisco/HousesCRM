import { MigrationInterface, QueryRunner } from 'typeorm';

const ENUM_TYPES = ['utility_tariff_utility_type_enum', 'meter_reading_utility_type_enum'];

export class AddWaterSubscriptionType1771400000000 implements MigrationInterface {
  name = 'AddWaterSubscriptionType1771400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const enumType of ENUM_TYPES) {
      await queryRunner.query(
        `ALTER TYPE "public"."${enumType}" ADD VALUE IF NOT EXISTS 'water_subscription'`,
      );
    }
  }

  public async down(): Promise<void> {
    // PostgreSQL не підтримує видалення значень з enum; зайве значення не заважає
  }
}
