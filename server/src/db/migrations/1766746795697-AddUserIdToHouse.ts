import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserIdToHouse1766746795697 implements MigrationInterface {
  name = 'AddUserIdToHouse1766746795697'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'house' AND column_name = 'userId'
    `)

    if (columnExists && columnExists.length > 0) {
      console.log('Column userId already exists in house table')
      return
    }

    await queryRunner.query(`ALTER TABLE "house" ADD COLUMN "userId" uuid`)

    const users = await queryRunner.query(`SELECT id FROM "user" ORDER BY "created_at" ASC LIMIT 1`)

    if (users && users.length > 0) {
      const firstUserId = users[0].id

      await queryRunner.query(`UPDATE "house" SET "userId" = '${firstUserId}' WHERE "userId" IS NULL`)
    }

    const constraintExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'FK_house_user' AND table_name = 'house'
    `)

    if (!constraintExists || constraintExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "house" ADD CONSTRAINT "FK_house_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      )
    }

    const housesWithoutUserId = await queryRunner.query(`SELECT COUNT(*)::int as count FROM "house" WHERE "userId" IS NULL`)
    const count = housesWithoutUserId[0]?.count || 0

    if (count === 0) {
      await queryRunner.query(`ALTER TABLE "house" ALTER COLUMN "userId" SET NOT NULL`)
    } else {
      console.warn(`⚠️  WARNING: Found ${count} houses without userId. Please fill them manually before setting NOT NULL constraint.`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "house" DROP CONSTRAINT IF EXISTS "FK_house_user"`)

    await queryRunner.query(`ALTER TABLE "house" DROP COLUMN IF EXISTS "userId"`)
  }
}
