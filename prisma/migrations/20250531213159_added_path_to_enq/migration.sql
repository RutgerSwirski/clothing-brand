/*
  Warnings:

  - Added the required column `path` to the `UpcycleEnquiry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UpcycleEnquiry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UpcycleEnquiry" ("createdAt", "email", "id", "message", "name", "updatedAt") SELECT "createdAt", "email", "id", "message", "name", "updatedAt" FROM "UpcycleEnquiry";
DROP TABLE "UpcycleEnquiry";
ALTER TABLE "new_UpcycleEnquiry" RENAME TO "UpcycleEnquiry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
