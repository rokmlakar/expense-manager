const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken')
const cookie= require('cookie-parser');

const loginRequired = async(req, res, next) =>{
    const token = req.cookies['access-token']
    if(token){
        const validatoken = await jwt.verify(token, JWT_SECRET)
        if(validatoken) {
            res.user = validatoken.id
            next()
        }
        else{
            console.log('token expires')
        }
    }
    else{
        console.log('token not found')
    }
}

module.exports = { prisma, loginRequired };
