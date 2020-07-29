const express = require("express");
const RegisterRouter = express.Router();
const UserService = require("../../services/UserService/UserService");
const Bcrypt = require("../../services/Bcrypt/Bcrypt");
const JWT = require("../../services/JWT/JWT");

RegisterRouter
    .route("/register")
    .post((req, res)=>{
        const {
            first_name,
            last_name,
            email,
            password,
            mobile_number
        } = req.body;

        const newUser = {
            first_name,
            last_name,
            email,
            password,
            mobile_number
        };

        console.log(newUser)

        for(const [key, value] of Object.entries(newUser)){
            if(value === undefined){

                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };

        UserService.getUser(req.app.get("db"), newUser.email)
            .then( dbUser => {
                if(dbUser){

                    return res.status(400).json({
                        error: `${newUser.email} is already registered`
                    });
                };

                Bcrypt.hashPassword(newUser.password)
                    .then( hashedPassword => {
                        newUser.password = hashedPassword;

                        UserService.createUser(req.app.get("db"), newUser)
                            .then( createdUser => {
                                console.log(createdUser)
                                const subject = createdUser.email;
                                const payload = {
                                    user: createdUser.email
                                };

                                return res.status(200).json({
                                    token: JWT.createJwt(subject, payload)
                                });
                            });
                    });
            });
    });

module.exports = RegisterRouter;