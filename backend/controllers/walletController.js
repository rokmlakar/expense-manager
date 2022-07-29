const { prisma } = require('../constants/config.js');

const wallet_post = async (req, res) => {
    if (req.session.userId) {
        console.log('ssss')
        console.log(req.body.color)
        try {
            await prisma.wallet.create({
                data: {
                    name: req.body.title,
                    userId: req.session.userId,
                    money: req.body.money,
                    color: req.body.color
                }
            })
            res.status(200).send('success');
        } catch {
            res.status(400).send([{ instancePath: 'Errddd', message: 'Err' }]);
        }
    } else res.status(401).send('please login');
};

const wallet_edit = async (req,res) => {
    if(req.session.userId){
        console.log(req.body)
        let wallet = parseInt(req.body.wallet);
        let money = parseInt(req.body.money);
        console.log(wallet)
        console.log(money)
        try{

            await prisma.wallet.update({
                where: {
                    id: wallet
                },
                data:{
                    money:{
                        increment: money,
                    },
                },
            })
            res.status(200).send('success');
        } catch{
            res.status(400).send([{ instancePath: 'err', message: 'Error'}]);
        }
    }
}

const wallet_delete = async (req, res) => {
    //KOT REQ PREJMEMO TRANSACTIONID
    if (req.session.userId) {
        console.log(req.params)
        let wallet = parseInt(req.params.walletId);
        let tr;
        let wallets;
        //S FUNKCIJO DELETEMANY() ZBRISEMO TRANSAKCIJO TAKO DA JO NAJDEMO S POMOČJO TRANSACTIONID KATERO DOBIMO OD USERJA
        try {

            tr = await prisma.transaction.deleteMany({
                where: {
                    walletId: wallet,
                    // wallet: {
                    //     userId: req.session.userId, ???????????????????????
                    // },
                },
            })
            console.log('yo')
            wallets = await prisma.wallet.deleteMany({
                where: {
                    id: wallet,
                    userId: req.session.userId,
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

        console.log('hgell')
        //ČE COUNT OBSTAJA POMENI DA SE TRANSAKCIJA USPEŠNO POBRIŠE
        // if (tr?.count) {
        //     res.status(200).send('success');
        //     return;
        // }
        // res.status(400).send('error');
    } else {
        res.status(401).send('please login');
    }
};

const wallet_get = async (req, res) => {
    if (req.session.userId) {
        let wall;
        try {
            wall = await prisma.wallet
                .findMany({
                    where: {
                        userId: req.session.userId
                    }
                })
                .catch(() => console.log('err'));

            if (wall) res.status(200).send(wall);
            // console.log(wall)
        } catch {
            res.status(400).send('error');
        }
    } else res.status(401).send('please login')
};
module.exports = {
    wallet_get, wallet_post, wallet_delete, wallet_edit
};