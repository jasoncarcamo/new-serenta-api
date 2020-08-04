const express = require("express");
const LivingSpaceRouter = express.Router();
const LivingSpaceService = require("../../services/LivingSpaceService/LivingSpaceService");
const {requireAuth} = require("../../middleware/jwtAuth");

LivingSpaceRouter
    .route("/living-space")
    .get((req, res) => {

    })
    .post(requireAuth, (req, res) => {
        const {
            street_address,
            apt_num,
            city,
            state,
            country,
            zip_code,
            type,
            price,
            deposit,
            bedrooms,
            bathrooms,
            squareft,
            ac,
            wifi,
            cable,
            pets,
            parking,
            washer,
            dryer,
            comments
        } = req.body;

        const newAd = {
            street_address,
            apt_num,
            city,
            state,
            country,
            zip_code,
            type,
            price,
            deposit,
            bedrooms,
            bathrooms,
            squareft,
            ac,
            wifi,
            cable,
            pets,
            parking,
            washer,
            dryer,
            comments
        };

        console.log(newAd)
        
        // checks to make sure keys are provided on body request
        for(const [key, value] of Object.entries(newAd)){
            if(value === undefined){
                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };

        // sets user id ownership
        newAd.user_id = req.user.id;

        LivingSpaceService.createSpace(req.app.get("db"), newAd)
            .then( createdAd => {
                return res.status(200).json({
                    createdAd
                });
            });

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