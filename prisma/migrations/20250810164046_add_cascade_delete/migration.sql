-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContractRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "contractId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "ContractRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContractRole_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ContractRole" ("contractId", "id", "role", "userId") SELECT "contractId", "id", "role", "userId" FROM "ContractRole";
DROP TABLE "ContractRole";
ALTER TABLE "new_ContractRole" RENAME TO "ContractRole";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
