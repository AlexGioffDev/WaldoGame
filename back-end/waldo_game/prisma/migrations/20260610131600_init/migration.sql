-- CreateTable
CREATE TABLE "Image" (
    "image_id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "Character" (
    "character_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "posX" DOUBLE PRECISION NOT NULL,
    "posY" DOUBLE PRECISION NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("character_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "game_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("game_id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("image_id") ON DELETE RESTRICT ON UPDATE CASCADE;
