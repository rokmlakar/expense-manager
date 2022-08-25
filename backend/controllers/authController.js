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
        // if (!user.isVerified) {
        //     res.status(401).send('not verified')
        //     return
        // }
        if (isPasswordCorrect && user.isVerified) {
            req.session.userId = user.id
            res.status(200).send("Authed")
        }
        else {
            if(isPasswordCorrect){
                res.status(401).send("Wrong credidentials");
            }

            if(user.isVerified !== true){
                res.status(401).send("Not verified");
            }
        }
        // else {
        //     //ČE SE NE VRNEMO 401
        //     res.status(401).send("Wrong creds");
        // }
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
    const { username, email, password } = req.body;
    console.log(req.body)
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
                    userName: username,
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
                    res.status(200).send([{message: "Verification email is sent to your gmail account"}])
                    console.log('Verification email is sent to your gmail account')
                }
            })

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
                    color: '#5a92d6'
                },
            });
            res.status(200).send("ok");
        } catch {
            return;
        }
    }
};

const auth_verify = async (req, res) => {
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
        res.redirect('http://localhost:3000/auth')
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
            username: user.userName,
            superAdmin: user.superAdmin
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