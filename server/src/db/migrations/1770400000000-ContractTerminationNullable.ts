import { MigrationInterface, QueryRunner } from 'typeorm'

export class ContractTerminationNullable1770400000000 implements MigrationInterface {
  name = 'ContractTerminationNullable1770400000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "termination" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "contract" SET "termination" = "commencement" WHERE "termination" IS NULL`,
    )
    await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "termination" SET NOT NULL`)
  }
}
