import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractPdfProfileToUser1770600000000 implements MigrationInterface {
  name = 'AddContractPdfProfileToUser1770600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "contract_pdf_profile" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "contract_pdf_profile"`);
  }
}
