-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'partner',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BattleCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "competitor" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "BattleCard_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BattleCardTag" (
    "battleCardId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("battleCardId", "tagId"),
    CONSTRAINT "BattleCardTag_battleCardId_fkey" FOREIGN KEY ("battleCardId") REFERENCES "BattleCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BattleCardTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    CONSTRAINT "Resource_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "BattleCard_industry_idx" ON "BattleCard"("industry");

-- CreateIndex
CREATE INDEX "BattleCard_competitor_idx" ON "BattleCard"("competitor");

-- CreateIndex
CREATE INDEX "BattleCard_published_idx" ON "BattleCard"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "BattleCardTag_tagId_idx" ON "BattleCardTag"("tagId");

-- CreateIndex
CREATE INDEX "Announcement_published_idx" ON "Announcement"("published");

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");

-- CreateIndex
CREATE INDEX "Resource_published_idx" ON "Resource"("published");
