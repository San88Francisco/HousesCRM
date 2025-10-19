import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1760469824590 implements MigrationInterface {
  name = 'Init1760469824590'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."house_price_code_enum" AS ENUM('UAH', 'USD', 'EUR', 'PLN')`)
    await queryRunner.query(
      `CREATE TABLE "house_price" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(12,2) NOT NULL, "exchange_rate" numeric(12,2) NOT NULL, "code" "public"."house_price_code_enum" NOT NULL DEFAULT 'UAH', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "houseId" uuid NOT NULL, CONSTRAINT "PK_4f9ee3f3c846d191663f89dada8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE TYPE "public"."house_apartmenttype_enum" AS ENUM('new_build', 'resale')`)
    await queryRunner.query(
      `CREATE TABLE "house" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "apartment_name" character varying(30) NOT NULL, "rooms_count" integer NOT NULL, "total_area" double precision NOT NULL, "purchase_date" TIMESTAMP NOT NULL, "floor" integer NOT NULL, "street" character varying NOT NULL, "apartmentType" "public"."house_apartmenttype_enum" NOT NULL DEFAULT 'new_build', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_032a121e4caf2bf9069f766c62" CHECK ("rooms_count" > 0 AND "total_area" > 0 AND "floor" >= 0), CONSTRAINT "PK_8c9220195fd0a289745855fe908" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE TYPE "public"."contract_status_enum" AS ENUM('active', 'inactive')`)
    await queryRunner.query(
      `CREATE TABLE "contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "commencement" TIMESTAMP NOT NULL, "termination" TIMESTAMP NOT NULL, "status" "public"."contract_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "monthly_payment" integer NOT NULL, "houseId" uuid, "renterId" uuid, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "renter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(15) NOT NULL, "last_name" character varying(20) NOT NULL, "occupied" TIMESTAMP NOT NULL, "vacated" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d1963dd773c2a2a44fc93a956f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying(50) NOT NULL, "password" character varying, "google_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7adac5c0b28492eb292d4a93871" UNIQUE ("google_id"), CONSTRAINT "CHK_af1e74da4cf07055c5fe48a5ae" CHECK ("password" IS NOT NULL OR "google_id" IS NOT NULL), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashed_token" character varying(255) NOT NULL, "jti" character varying(64) NOT NULL, "user_agent" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_e532a5fe469da358494917ce2b" ON "refresh_token" ("jti") `)
    await queryRunner.query(
      `ALTER TABLE "house_price" ADD CONSTRAINT "FK_a7eccc9200a37ee5e6530bd4cab" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_71983fe8665bde9434cd63e3464" FOREIGN KEY ("houseId") REFERENCES "house"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_c53f3c74676e74930dd90c6cf92" FOREIGN KEY ("renterId") REFERENCES "renter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`)
    await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_c53f3c74676e74930dd90c6cf92"`)
    await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_71983fe8665bde9434cd63e3464"`)
    await queryRunner.query(`ALTER TABLE "house_price" DROP CONSTRAINT "FK_a7eccc9200a37ee5e6530bd4cab"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_e532a5fe469da358494917ce2b"`)
    await queryRunner.query(`DROP TABLE "refresh_token"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "renter"`)
    await queryRunner.query(`DROP TABLE "contract"`)
    await queryRunner.query(`DROP TYPE "public"."contract_status_enum"`)
    await queryRunner.query(`DROP TABLE "house"`)
    await queryRunner.query(`DROP TYPE "public"."house_apartmenttype_enum"`)
    await queryRunner.query(`DROP TABLE "house_price"`)
    await queryRunner.query(`DROP TYPE "public"."house_price_code_enum"`)
  }
}
