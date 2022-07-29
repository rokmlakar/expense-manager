const { prisma } = require('../constants/config.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'roky.mlakar@gmail.com', // generated ethereal user
        pass: 'gtmwkghxfljrjiul', // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});



const walletViewer_post = async (req, res) => {
    if (req.session.userId) {
        console.log(req.body);
        let wallet = parseInt(req.body.wallet)
        let viewerEmail = req.body.viewer
        let newViewer
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: viewerEmail
                },
            })
            if (user) {
                newViewer = await prisma.walletViewer.create({
                    data: {
                        userId: user.id,
                        walletId: wallet,
                        emailToken: crypto.randomBytes(64).toString('hex'),
                        isVerified: false
                    },
                });
                console.log(newViewer)
                //SEND VERIFICATION TO USR
                var mailOptions = {
                    from: ' "Verify your email" <roky.mlakar@gmail.com> ',
                    to: viewerEmail,
                    subject: 'verify your email',
                    html: `<h2> "${newViewer.name}! Thanks for registering </h2>
                        <h4> Please verify your mail to continue...</h4>
                        <a href="http://localhost:5000/api/verify-wallet-viewer?token=${newViewer.emailToken}">Verify Your Email</a>`
                }
                //SENDING
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log('Verification email is sent to your gmail account')
                    }
                })
                res.status(200).send([{ message: 'Email Verification Sent' }])
            }
            else {
                res.status(400).send([{ message: 'User not found' }])
            }
            console.log(user)
        }
        catch {

        }

    }
}

const wallet_verify = async (req, res) => {
    console.log('test verify')
    try {
        const token = req.query.token;
        console.log(token)

        await prisma.walletViewer.updateMany({
            where: {
                emailToken: token
            },
            data: {
                isVerified: true,
                emailToken: null
            }
        });
        res.redirect('http://localhost:3000/wallet')
    }
    catch (err) {
        console.log(err)
    }
}


const walletViewer_get = async (req, res) => {
    if (req.session.userId) {
        let user = req.session.userId;
        console.log(user)
        try {
            const walletView = await prisma.walletViewer.
                findMany({
                    where: {
                        userId: user
                    }
                })
                .catch(() => console.log('err'));

            if (walletView) {
                const wallId = walletView[0].walletId
                console.log(walletView)
                console.log('wallllll', wallId)
                const wallet = await prisma.wallet.
                    findMany({
                        where: {
                            id: wallId
                        }
                    })
                console.log(wallet)
                res.status(200).send(wallet);
            }
        } catch {
            res.status(400).send('error');
        }
    }
}



const wallet_edit = async (req, res) => {
    if (req.session.userId) {
        console.log(req.body)
        let wallet = parseInt(req.body.wallet);
        let money = parseInt(req.body.money);
        console.log(wallet)
        console.log(money)
        try {

            await prisma.wallet.update({
                where: {
                    id: wallet
                },
                data: {
                    money: {
                        increment: money,
                    },
                },
            })
            res.status(200).send('success');
        } catch {
            res.status(400).send([{ instancePath: 'err', message: 'Error' }]);
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
    wallet_get,
    wallet_post,
    wallet_delete,
    wallet_edit,
    walletViewer_post,
    walletViewer_get,
    wallet_verify
};