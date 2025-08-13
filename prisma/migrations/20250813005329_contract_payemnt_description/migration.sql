/*
  Warnings:

  - You are about to drop the column `paidAt` on the `ContractPayment` table. All the data in the column will be lost.
  - Added the required column `dsescription` to the `ContractPayment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContractPayment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contractId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "dsescription" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContractPayment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ContractPayment" ("amount", "contractId", "createdAt", "id", "updatedAt") SELECT "amount", "contractId", "createdAt", "id", "updatedAt" FROM "ContractPayment";
DROP TABLE "ContractPayment";
ALTER TABLE "new_ContractPayment" RENAME TO "ContractPayment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
