-- DropForeignKey
ALTER TABLE "TransactionCategory" DROP CONSTRAINT "TransactionCategory_userId_fkey";

-- CreateTable
CREATE TABLE "_TransactionCategoryToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TransactionCategoryToUser_AB_unique" ON "_TransactionCategoryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TransactionCategoryToUser_B_index" ON "_TransactionCategoryToUser"("B");

-- AddForeignKey
ALTER TABLE "_TransactionCategoryToUser" ADD CONSTRAINT "_TransactionCategoryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "TransactionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransactionCategoryToUser" ADD CONSTRAINT "_TransactionCategoryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
