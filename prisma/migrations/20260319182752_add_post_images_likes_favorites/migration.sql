-- AlterTable
ALTER TABLE "Post" ADD COLUMN "images" TEXT;

-- CreateTable
CREATE TABLE "PostLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostFavorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "PostFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PostFavorite_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_userId_postId_key" ON "PostLike"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostFavorite_userId_postId_key" ON "PostFavorite"("userId", "postId");
