import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1750563282087 implements MigrationInterface {
  name = 'InitDatabase1750563282087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "link" character varying, "vendor" "public"."artist_vendor_enum" NOT NULL DEFAULT 'itunes', "vendorId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dd5a88442cd2e068463fa03e49" ON "artist" ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ARTIST_VENDOR_VENDORID" ON "artist" ("vendor", "vendorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "episode" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "vendor" "public"."episode_vendor_enum" NOT NULL DEFAULT 'itunes', "vendorId" character varying NOT NULL, "releaseDate" TIMESTAMP, "description" text, "durationMillis" integer, "artwork" character varying, "link" character varying, "fileExtention" character varying, "vendorMetadata" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "podcastId" integer, CONSTRAINT "PK_7258b95d6d2bf7f621845a0e143" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b8186cd5641b3bf6ee49479ce" ON "episode" ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_EPISODE_VENDOR_VENDORID" ON "episode" ("vendor", "vendorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "podcast" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "link" character varying, "feedUrl" character varying, "artwork" character varying, "vendor" "public"."podcast_vendor_enum" NOT NULL DEFAULT 'itunes', "vendorId" character varying NOT NULL, "vendorMetadata" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "artistId" integer, CONSTRAINT "PK_8938ce8558ac308bea99f4360e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_20794ab832e8cfe33e90710bac" ON "podcast" ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_PODCAST_VENDOR_VENDORID" ON "podcast" ("vendor", "vendorId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" ADD CONSTRAINT "FK_553934f46dc107c0ce9326d2419" FOREIGN KEY ("podcastId") REFERENCES "podcast"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "podcast" ADD CONSTRAINT "FK_6842159d1908a7e3e4b633d2507" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "podcast" DROP CONSTRAINT "FK_6842159d1908a7e3e4b633d2507"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode" DROP CONSTRAINT "FK_553934f46dc107c0ce9326d2419"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_PODCAST_VENDOR_VENDORID"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_20794ab832e8cfe33e90710bac"`,
    );
    await queryRunner.query(`DROP TABLE "podcast"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_EPISODE_VENDOR_VENDORID"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b8186cd5641b3bf6ee49479ce"`,
    );
    await queryRunner.query(`DROP TABLE "episode"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ARTIST_VENDOR_VENDORID"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dd5a88442cd2e068463fa03e49"`,
    );
    await queryRunner.query(`DROP TABLE "artist"`);
  }
}
