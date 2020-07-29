const express = require("express");
const LoginRouter = express.Router();
const JWT = require("../../services/JWT/JWT");
const Bcrypt = require("../../services/Bcrypt/Bcrypt");
const UserService = require("../../services/UserService/UserService");

LoginRouter
    .route("/login")
    .post((req, res) => {
        const {
            email,
            password
        } = req.body;

        const user = {
            email,
            password
        };

        for(const [key, value] of Object.entries(user)){
            if(value === undefined){

                return  res.status(400).json({
                    error: `Missing ${key} in body request.`
                });
            };
        };

        UserService.getUser(req.app.get("db"), user.email)
            .then( dbUser => {
                if(!dbUser){
                    console.lofg(dbUser)
                    return res.status(400).json({
                        error: `${user.email} is not registered.`
                    });
                };

                Bcrypt.comparePassword(user.password, dbUser.password)
                    .then( passwordMatches => {
                        if(!passwordMatches){

                            return res.status(400).json({
                                error: "Incorrect password"
                            });
                        };

                        const subject = dbUser.email;
                        const payload = {
                            user: dbUser.email
                        };

                        console.log(dbUser)

                        console.log(payload)

                        return res.status(200).json({
                            token: JWT.createJwt(subject, payload)
                        });
                    });
            });

    });

module.exports = LoginRouter;