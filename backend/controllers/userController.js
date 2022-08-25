const { prisma } = require('../constants/config.js');
const bcrypt = require('bcrypt');

const user_update_meta = async (req, res) => {
    const { username } = req.body;
    //IF USER IS LOGGED IN
    if (req.session.userId) {
        try {
            await prisma.user.update({
                where: {
                    id: req.session.userId,
                },
                data: {
                    userName: username
                },
            });
            res.status(200).send('Updated');
        } catch (e) {
            res.status(500).send('Error {Update meta}')
        }
    } else {
        //IF NOT
        res.status(401).send('Please Login');
    }
};

//UPDATE PW
const user_update_password = async (req, res) => {
    const { password, oldPassword } = req.body;
    //PASSWORD NOVI PASS KI GA USER HOČE, OLDPASS TRENUTEN PASS OD USERJA
    let user;
    if (req.session.userId) {
        //FIND USER
        try {
            //NAJDE USERJA Z PRISMA FINDUNIQUE KI IMA USTREZEN USERID
            user = await prisma.user.findUnique({
                where: {
                    id: req.session.userId,
                },
            });
        } catch {
            res.status(500).send('err');
            return;
        }
    } else {
        res.status(401).send('Please Login');
    }

    //IF USER IS FOUND
    if (user) {

        //ČE GA NAJDE PREVERI DA JE TRENUTEN PASSWORD ENAK OLDPASSWORD KI GA PODA UPORABNIK
        const isPassCorrect = await bcrypt.compare(oldPassword, user.password);
        //ČE JE PASSWORD KATEREGA JE UPORABNIK PRAV TAKO POSLAL HAŠIRAMO IN ENKRIPTAMO, MU DAMO SALTROUND IN GA NASTAVIMO KOT NOVO GESLO
        if (isPassCorrect) {
            //HASH AND SALT NEW PW
            const saltRounds = 10;
            let newPassword = await bcrypt.hash(password, saltRounds);
            try {
                await prisma.user.update({
                    where: {
                        id: req.session.userId,
                    },
                    data: {
                        password: newPassword,
                    },
                });
                //DELETE ALL SESSIONS (LOGOUT EVERYONE)
                try {
                    // req.session.destroy();
                    await prisma.session.deleteMany({
                        where: {
                            data: {
                                endsWith: `, 'userId:${req.session.userId}}`,
                            },
                        },
                    });
                    res.clearCookie('sess').status(200).send('Updated');
                } catch {
                    res.status(500).send('err deleting sessions');
                }
            } catch { res.status(500).send('Cannot update pw') }
        }
        else {
            //IF PW IS INCORRECT
            res.status(403).send('wrong pw');
        }
    } else {
        //USER NOT FOUND 
        res.status(401).send('please log in')
    }
};


const users_get = async (req, res) => {
    if (req.session.userId) {

        const users = await prisma.user.findMany({
            where:{
                isVerified: true
            },
            select:{
                userName: true,
                email: true,
                Wallet: {
                    select:{
                        name:true,
                        money:true,
                        color:true,
                        id:true,
                        description:true,
                        transactions:{
                            select:{
                                title:true,
                                money:true,
                                date:true,
                                info:true
                            }
                        }
                    }
                } 
            }

        })
        res.json(users);
        console.log('test')

    } else res.status(401).send('please login');
};


module.exports = { user_update_meta, user_update_password, users_get };
