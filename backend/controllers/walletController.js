const { prisma } = require('../constants/config.js');

const wallet_post = async (req, res) => {
    if (req.session.userId) {
        console.log('ssss')
        console.log(req.body)
        try {
            await prisma.wallet.create({
                data: {
                    name: req.body.title,
                    userId: req.session.userId,
                    money: req.body.money,
                }
            })
            res.status(200).send('success');
        } catch {
            res.status(400).send([{ instancePath: 'Errddd', message: 'Err' }]);
        }
    } else res.status(401).send('please login');
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
    wallet_get, wallet_post
};