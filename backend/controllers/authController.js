const { prisma } = require("../constants/config");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

//GET ReQ FROM USER(LOGIN INFO) AND CHECK IF IT MATCHES THE INFO MATCHES THE INFO ON THE SERVER/DB
const auth_login = async (req, res) => {
    if (req.session.userId) {
        res.status(500).send("Logged in");
        console.log('loggd')
        return;
    }
    let user; // V SPREMENLJIVKO USER ZAPIŠEMO USERJA IZ DB KATERI EMAIL SE UJEMA Z NAVEDENIM
    const { email, password } = req.body;
    try {
        user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        //CHECK PW ČE SE UJEMA Z NAVEDENO
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            req.session.userId = user.id
            res.status(200).send("Authed")
        } else {
            //ČE SE NE VRNEMO 401
            res.status(401).send("Wrong creds");
        }
    } catch {
        if (!user) {
            //ČE NE NAJDEMO USERJA Z NAVEDENIM EMAILOM VRNEMO 401
            res.status(401).send("Wrong creds");
            return;
        }
    }

}

const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET)
}


let testAccount = nodemailer.createTestAccount();
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



const auth_register = async (req, res) => {
    const { email, password } = req.body;
    let emailCheck;
    //PREVERIMO ALI UPORABNIK S TEM EMAILOM ŽE OBSTAJA
    try {
        emailCheck = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    } catch {
        res.status(400)
            .send([{ instancePath: "Email Availability", message: "Error" }]);
    }
    //ČE OBSTAJA VRNEMO ERROR DA JE EMAIL ŽE ZASEDEN
    if (emailCheck)
        res
            .status(500)
            .send([{ instancePath: "Email", message: "Email is already taken" }])
    //DRUGAČE UPORABNIKA REGISTRIRAMO
    else {
        //ENKRIPTAMO PASSWORD KI GA PODA USER Z BCRYPT.HASH
        const saltRounds = 10;
        let salted_password = await bcrypt.hash(password, saltRounds);
        let newUser;

        //NATO USTVARIMO NOVEGA UPORABNIKA Z PRISMA.USER.CReATE KJER MU NASTAVIMO EMAIL KATEREGA JE VNESEL, GESLO KATERO SMO
        //ENKRIPTALI IN PA FIRST/LAST NAME KI JE NA ZACETKU ZAENKRAT PRAZEN
        try {
            newUser = await prisma.user.create({
                data: {
                    email: email,
                    password: salted_password,
                    firstName: "ss",
                    lastName: "ss",
                    emailToken: crypto.randomBytes(64).toString('hex'),
                    isVerified: false
                },
            });
            console.log(newUser)

            //SEND VERIFICATION TO USR
            var mailOptions = {
                from: ' "Verify your email" <roky.mlakar@gmail.com> ',
                to: newUser.email,
                subject: 'verify your email',
                html: `<h2> "${newUser.name}! Thanks for registering </h2>
                        <h4> Please verify your mail to continue...</h4>
                        <a href="http://localhost:5000/api/verify-email?token=${newUser.emailToken}">Verify Your Email</a>`
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
            res.redirect('/auth')

            //ČE PRIDE DO ERRORJA VRNEMO ERR MESSAGE
        } catch {
            res.status(500).send([{ instancePath: "Err", message: "Err" }]);
            return;
        }
        //KO USTVARIMO USERJA MU USTVARIMO ŠE WALLET GLEDE NA NJEGOV ID

        try {
            await prisma.wallet.create({
                data: {
                    name: 'Wallet 1',
                    userId: newUser?.id,
                },
            });
            res.status(200).send("ok");
        } catch {
            return;
        }
    }
};

const auth_verify = async (req, res) => {
    console.log('test')
    try {
        const token = req.query.token;
        console.log(token)
       
        await prisma.user.updateMany({
            where: {
                emailToken: token
            },
            data: {
                isVerified: true,
                emailToken: null
            }
        });
        // console.log(user)
       
        // const user = await prisma.user.findMany({
        //     where: {
        //         emailToken: token
        //     }
        // })
        // if (user) {
        //     user.emailToken = null
        //     user.isVerified = true
        //     res.redirect('/auth')
        //     console.log('verfied')
        //     console.log(user)
        //     await user.prisma.save()
        // }
        // else {
        //     res.redirect('/auth')
        //     console.log('not verified')
        // }


        

        //await user.save()
        // if (user) {

        //     console.log(user)
        //     user.emailToken = null
        //     user.isVerified = true
        //     await user.save()
        //     res.redirect('/auth')
        // }
        // else {
        //     res.redirect('/rip')
        //     console.log('email is not verified')
        // }
    }
    catch (err) {
        console.log(err)
    }
}

//PRI LOGOUTU PREJMEMO PODATKE SESSIONA KJER VIDIMO USER ID, SESSION PA UNIČIMO Z session.prisma.destroy() TAKO DA NAM POBRIŠE
//PIŠKOTKE
const auth_logout = async (req, res) => {
    if (req.session.userId) {
        req.session.destroy();
        res.clearCookie("sess").status(200).send("cleared cookie");
    } else {
        res.status(401).send("You are not logged in");
    }

}


//AUTHUSER DOBI REQ IZ KATEREGA VZAMEMO USERID KJER PREVERIMO ALI USER S TEM IDJOM OBSTAJA
const auth_user = async (req, res) => {
    //NAJPREJ PREVERIMO ALI JE USER LOGGAN IN
    // if (req.session.userId) {
    try {
        //POIŠČE USERJA Z PREJETIM IDJOM
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });
        //ČE NE OBSTAJA VRNEMO 401
        if (!user) res.status(401).json("User Not Found");
        //DRUGAČE ZAPIŠEMO PODATKE V KONST DATA IN JIH POŠLJEMO NA FRONTEND
        const data = {
            email: user.email,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        //VRNEMO DATA V JSON OBLIKI
        res.status(200).json(data);
    } catch {
        res.status(500).json("Something Went Wrong {auth}");
    }
    // } else {
    //     res.status(401).send("please login");
    // }
};

module.exports = {
    auth_register,
    auth_login,
    auth_logout,
    auth_user,
    auth_verify
};