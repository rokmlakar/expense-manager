/*
  Warnings:

  - You are about to drop the `_TransactionCategoryToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `TransactionCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_TransactionCategoryToUser" DROP CONSTRAINT "_TransactionCategoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TransactionCategoryToUser" DROP CONSTRAINT "_TransactionCategoryToUser_B_fkey";

-- DropTable
DROP TABLE "_TransactionCategoryToUser";

-- CreateIndex
CREATE UNIQUE INDEX "TransactionCategory_userId_key" ON "TransactionCategory"("userId");
