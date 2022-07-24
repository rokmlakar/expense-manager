const { prisma } = require('../constants/config.js');
const { DateTime } = require('luxon');


const category_post = async (req, res) => {
    if (req.session.userId) {
        console.log(req.body)
        try {
            await prisma.TransactionCategory.create({
                data: {
                    name: req.body.title,
                    userId: req.session.userId,
                    Transaction: {},
                    info: req.body.info,
                    color:req.body.color
                }
            })
            res.status(200).send('success');
        } catch {
            res.status(400).send([{ instancePath: 'Errddd', message: 'Err' }]);
        }
    } else res.status(401).send('please login');
};

const categories_get = async (req, res) => {
    if (req.session.userId) {
        //KLIC ZA VSE KATEGORIJE, SHRANIJO SE V ctgs
        let ctgs;
        try {
            ctgs = await prisma.transactionCategory
                .findMany({
                    where: {
                        OR: [
                            {
                                userId: req.session.userId
                            },
                            {
                                userId: null
                            }
                        ]

                    }
                })
                .catch(() => console.log('err'));

            //ČE JIH NAJDE JIH POŠLE UPORABNIKU 
            if (ctgs) res.status(200).send(ctgs);
        } catch {
            res.status(400).send('error');
        }
    } else res.status(401).send('please login');
};


const categories_transaction_sum = async (req, res) => {
    if (req.session.userId) {
        //ZAPOMNE SI DATUM USTVARJENE TRANSAKCIJE IN TRENUTNI DATUN
        let firstDate = req.query.first;
        let lastDate = DateTime.now().toISO();

        if (!firstDate) {
            firstDate = DateTime.now().minus({ month: 1 }).toISO();
        }

        try {
            //V TRANSACTIONS ZAPIŠEMO TRANSAKCIJE KATERE GRUPIRAMO PO IDJU TRANSAKCIJ KJER JE WALLET ENAK WALLETIDU OD USERJA 
            // IN DATUM USTREZA ČASU MED VREDNOSTIMA V FIRST/LAST DATE
            const transactions = await prisma.transaction.groupBy({
                by: ['transactionCategoryId'],
                _sum: {
                    money: true,
                },
                where: {
                    wallet: {
                        userId: req.session.userId,
                    },
                    date: {
                        gte: firstDate,
                        lt: lastDate,
                    }
                },
            });
            //POŠLE NAZAJ TRANSAKCIJE KOT RESPONSE
            res.send(transactions);
        } catch {
            res.status(400).send('Err');
        }
    }
};

module.exports = {
    categories_get,
    categories_transaction_sum,
    category_post
};