import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToContracts1770027000000 implements MigrationInterface {
    name = 'AddCascadeDeleteToContracts1770027000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_c53f3c74676e74930dd90c6cf92"`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_c53f3c74676e74930dd90c6cf92" FOREIGN KEY ("renterId") REFERENCES "renter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_c53f3c74676e74930dd90c6cf92"`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_c53f3c74676e74930dd90c6cf92" FOREIGN KEY ("renterId") REFERENCES "renter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
