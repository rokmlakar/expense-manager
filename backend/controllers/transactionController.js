const { prisma } = require('../constants/config.js');
const { DateTime } = require('luxon');

const transaction_post = async (req, res) => {
    if (req.session.userId) {
        const date = new Date(req.body.date).toISOString();
        // const date = req.body.date
        const timestamp = new Date().getTime()
        try {
            await prisma.transaction.create({
                data: {
                    title: req.body.title,
                    money: req.body.money,
                    date: date,
                    info: req.body.info,
                    transactionCategoryId: req.body.transactionCategoryId,
                    walletId: req.body.walletId,
                    timestamp: timestamp,
                }
            })
            res.status(200).send('success');
        } catch {
            res.status(400).send([{ instancePath: 'Err', message: 'Err' }]);
        }
    } else res.status(401).send('please login');
};

const transaction_count_category = async (req, res) => {
    if (req.session.userId) {
        let { category } = req.query
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            transactionCategoryId: {
                equals: category != undefined ? parseInt(category) : undefined,
            },
        }
    }).count()

    console.log(transactions)
}

const viewer_transactions = async (req, res) => {
    if (req.session.userId) {
        let user = req.session.userId;
        let trnsArray = [];
        let wallId = req.query.walletId

        try {
            const viewedTrans = await prisma.transaction.
                findMany({
                    where: {
                        walletId: wallId
                    }
                })
            console.log(viewedTrans)
            // res.status(200).send(viewedTrans);
        }
        catch {
            res.status(400).send('error');
        }

    }
}

const transaction_edit_get = async (req, res) => {
    console.log('ssss', req)
    if (req.session.userId) {
        console.log(req.query)
        let trId = req.transactionId
        if (req.transactionId) {
            try {

                const editTr = await prisma.transaction.findUnique({
                    where: {
                        trId: id,
                    }
                })
                res.status(200).send(editTr)
            }
            catch {
                res.status(400).send('error');
                console.log('err')
            }
        }
    }
}

const transactions_get = async (req, res) => {
    if (req.session.userId) {
        console.log('reqqqqq')
        //ZAPIŠE SI PODANE PARAMETRE TO SO LAHKO KATERIKOLI OD NAVEDENIH SPODAJ (1 ali več)
        let { firstDate, lastDate, category, dateSort, priceSort, skip, take, walletId } =
            req.query;

        console.log(walletId)


        // if (walletId) {
        //     // console.log('waaaaa')
        //     try {

        //         const viewedTransactions = await prisma.transaction.findUnique({
        //             where: {
        //                 walletId: walletId
        //             }
        //         })
        //     } catch {
        //         res.status(400).send('error');
        //     }
        // }
        // else {


            //ČE SKIP NI PODAN JE DEFAULT 0
            if (!Number(skip)) {
                skip = 0;
            }
            //ČE TAKE NI PODAN JE DEFAULT 5
            if (!Number(take)) {
                take = 1000;
            }

            //NAJDE TRANSAKCIJE KI USTREZAJO PARAMETROM, 
            const transactions = await prisma.transaction.findMany({
                where: {
                    //WALLET USERID MORA USTREZATI USERIDJU SESSIONA
                    walletId: walletId ? parseInt(walletId) : undefined,
                    //DATUM MORA USTREZATI MED DANAŠNJIM IN 30 DNI NAZAJ (NPR ZA BRISANJE TRANSAKCIJ DEFINIRAMO DATUMA MED KATERIM IŠČEMO TRANSAKCIJE)
                    date: {
                        gte: firstDate != undefined
                            ? DateTime.fromISO(firstDate).toISO()
                            : DateTime.now().minus({ days: 30 }).toISO(),
                        lt: lastDate != undefined
                            ? DateTime.fromISO(lastDate).toISO()
                            : DateTime.now().toISO(),
                    },
                    //PREVERIMO DA TRANSAKCIJA KATERO PODAJAMO KATEGORIJI KI NAM JO UPORABNIK POŠLJE, ČE JO POŠLJE
                    transactionCategoryId: {
                        equals: category != undefined ? parseInt(category) : undefined,
                    },
                },
                //SKIP IN TAKE SE PODATA ČE STA DEFINIRANA, SKIP ZA KOLIKO TRANSAKCIJ PRESKOČI, TAKE ZA KOLIKO JIH POŠLJE
                skip: parseInt(skip),
                take: parseInt(take),
                orderBy: {
                     timestamp: 'desc',
                    //  date: dateSort != undefined ? dateSort : undefined,
                    //  money: priceSort != undefined ? priceSort : undefined,
                },
                //IZBERE KATERE PODATKE PODA UPORABNIKU KOT RESPONSE
                select: {
                    title: true,
                    money: true,
                    date: true,
                    info: true,
                    id: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    wallet:{
                        select:{
                            color:true
                        }
                    }
                },
            })
                .catch((e) => {
                    res.status(400).send('error');
                });
            res.json(transactions);
        // }
    } else res.status(401).send('please login');
};

const transaction_delete = async (req, res) => {
    //KOT REQ PREJMEMO TRANSACTIONID
    if (req.session.userId) {
        let transactionId = parseInt(req.params.transactionId);
        let tr;
        //S FUNKCIJO DELETEMANY() ZBRISEMO TRANSAKCIJO TAKO DA JO NAJDEMO S POMOČJO TRANSACTIONID KATERO DOBIMO OD USERJA
        try {
            tr = await prisma.transaction.deleteMany({
                where: {
                    id: transactionId,
                    wallet: {
                        userId: req.session.userId,
                    },
                },
            })
        } catch (e) {
            res
                .status(500)
                .send(
                    'something went wrong when deleting this transaction'
                );
            return;
        }

        //ČE COUNT OBSTAJA POMENI DA SE TRANSAKCIJA USPEŠNO POBRIŠE
        if (tr?.count) {
            res.status(200).send('success');
            return;
        }
        res.status(400).send('error');
    } else {
        res.status(401).send('please login');
    }
};

const transaction_edit = async (req, res) => {
    if (req.session.userId) {
        let transactionId = req.body.transactionId
        let title = req.body.title;
        let money = parseFloat(req.body.money);
        let info = req.body.info;
        try {

            await prisma.transaction.update({
                where: {
                    id: transactionId
                },
                data: {
                    title: title,
                    money: money,
                    info: info
                },
            })
            res.status(200).send('success');
        } catch {
            res.status(400).send([{ instancePath: 'err', message: 'Error' }]);
        }
    }
}

module.exports = {
    transaction_post,
    transactions_get,
    transaction_delete,
    transaction_count_category,
    viewer_transactions,
    transaction_edit_get,
    transaction_edit
};