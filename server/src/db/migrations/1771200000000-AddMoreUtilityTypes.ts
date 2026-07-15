import { MigrationInterface, QueryRunner } from 'typeorm';

const NEW_VALUES = ['water_cold', 'water_hot', 'gas', 'gas_delivery', 'heating', 'garbage'];
const ENUM_TYPES = ['utility_tariff_utility_type_enum', 'meter_reading_utility_type_enum'];

export class AddMoreUtilityTypes1771200000000 implements MigrationInterface {
  name = 'AddMoreUtilityTypes1771200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const enumType of ENUM_TYPES) {
      for (const value of NEW_VALUES) {
        await queryRunner.query(
          `ALTER TYPE "public"."${enumType}" ADD VALUE IF NOT EXISTS '${value}'`,
        );
      }
    }
  }

  public async down(): Promise<void> {
    // PostgreSQL не підтримує видалення значень з enum; відкат не потрібен —
    // зайві значення не впливають на роботу попередньої версії коду.
  }
}
