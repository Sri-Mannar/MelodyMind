/*
  Warnings:

  - The primary key for the `Audio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Text` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Audio" DROP CONSTRAINT "Audio_pkey",
ADD COLUMN     "bpm" INTEGER,
ADD COLUMN     "embedding" DOUBLE PRECISION[],
ADD COLUMN     "energy" DOUBLE PRECISION,
ADD COLUMN     "genreTags" TEXT[],
ADD COLUMN     "key" TEXT,
ADD COLUMN     "valence" DOUBLE PRECISION,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Audio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Audio_id_seq";

-- AlterTable
ALTER TABLE "public"."Text" DROP CONSTRAINT "Text_pkey",
ADD COLUMN     "embedding" DOUBLE PRECISION[],
ADD COLUMN     "rhymeScheme" TEXT,
ADD COLUMN     "sentiment" DOUBLE PRECISION,
ADD COLUMN     "syllables" INTEGER,
ADD COLUMN     "themes" TEXT[],
ADD COLUMN     "wordCount" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Text_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Text_id_seq";
