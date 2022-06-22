const { prisma } = require("../constants/config.js");
//ADD CATEGORIES AS SEED DATA
const seed = async () => {
    try {
        let ctgs = await prisma.transactionCategory.findMany();
        if (!ctgs.length) {
            //CREATE THE FOUR CATEGORIES
            console.log("CREATING THE FOUR CATEGORIES");
            await prisma.transactionCategory
                .createMany({
                    data: [
                        { name: "Products" },
                        { name: "Entertainment" },
                        { name: "Bills" },
                        { name: "Other" },
                    ],
                    skipDuplicates: true,
                })
                .catch(() => {
                    console.log("error seeding {prisma Client}");
                });
        }
    } catch {
        console.log("error seeding");
    }
};

seed();