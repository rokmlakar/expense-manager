const { prisma } = require('../constants/config.js');
const { DateTime } = require('luxon');

const wallet_get = async (req, res) => {
    if (req.session.userId) {
        let wall;
        try {
            wall = await prisma.wallet
                .findMany()
                .catch(() => console.log('err'));

            if (wall) res.status(200).send(wall);
        } catch {
            res.status(400).send('error');
        }
    } else res.status(401).send('please login')
};