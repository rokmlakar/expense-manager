-- CreateTable
CREATE TABLE "WalletViewer" (
    "userId" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "WalletViewer_pkey" PRIMARY KEY ("userId","walletId")
);

-- AddForeignKey
ALTER TABLE "WalletViewer" ADD CONSTRAINT "WalletViewer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletViewer" ADD CONSTRAINT "WalletViewer_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
