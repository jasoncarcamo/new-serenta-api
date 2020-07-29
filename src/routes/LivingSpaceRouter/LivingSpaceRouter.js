const express = require("express");
const LivingSpaceRouter = express.Router();
const LivingSpaceService = require("../../services/LivingSpaceService/LivingSpaceService");
const {requireAuth} = require("../../middleware/jwtAuth");
const { patch } = require("../../app/app");

LivingSpaceRouter
    .route("/living-space")
    .get((req, res) => {

    })
    .post((req, res) => {
        
    })

LivingSpaceRouter
    .route("/living-space/:id")
    .all(requireAuth)
    .get((req, res) => {

    })
    .post((req, res) => {
        console.log(req.user)

        return res.status(200).json({
            user: req.user
        })
    })
    .patch((req, res) => {
        console.log(req.user)
    })
    .delete((req, res) => {

    });

module.exports = LivingSpaceRouter;