import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCreatedByUserIdToRenter1770200000000 implements MigrationInterface {
  name = 'AddCreatedByUserIdToRenter1770200000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'renter' AND column_name = 'created_by_user_id'
    `)

    if (columnExists && columnExists.length > 0) {
      return
    }

    await queryRunner.query(`ALTER TABLE "renter" ADD COLUMN "created_by_user_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "renter" ADD CONSTRAINT "FK_renter_created_by_user" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "renter" DROP CONSTRAINT IF EXISTS "FK_renter_created_by_user"`)
    await queryRunner.query(`ALTER TABLE "renter" DROP COLUMN IF EXISTS "created_by_user_id"`)
  }
}
