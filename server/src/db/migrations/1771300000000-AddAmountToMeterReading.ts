import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmountToMeterReading1771300000000 implements MigrationInterface {
  name = 'AddAmountToMeterReading1771300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meter_reading" ADD COLUMN IF NOT EXISTS "amount" numeric(12,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "meter_reading" DROP COLUMN IF EXISTS "amount"`);
  }
}
