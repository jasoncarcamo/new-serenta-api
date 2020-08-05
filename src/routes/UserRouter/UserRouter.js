const express = require("express");
const UserRouter = express.Router();
const {requireAuth} = require("../../middleware/jwtAuth");
const UserService = require("../../services/UserService/UserService");

UserRouter
    .route("/user")
    .all(requireAuth)
    .get((req,res)=>{
        UserService.getUserById(req.app.get("db"), req.user.id)
            .then( user => {

                // removes password from user object before sending response
                delete user.password;

                return res.status(200).json({
                    user
                });
            })
    })
    .patch((req, res)=>{
        UserService.updateUser(req.app.app("db"), req.body, req.user.id)    
        then( updatedUser => {
            return res.status(200).json({
                updatedUser
            })
        })
    })
    .delete((req, res)=>{
        UserService.deleteUser(req.app.get("db"), req.user.id)
            .then( deletedUser => {
                return res.status(200).json({
                    success: "User has been deleted."
                });
            });
    })

module.exports = UserRouter;