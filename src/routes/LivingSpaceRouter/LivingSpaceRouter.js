const express = require("express");
const LivingSpaceRouter = express.Router();
const LivingSpaceService = require("../../services/LivingSpaceService/LivingSpaceService");
const {requireAuth} = require("../../middleware/jwtAuth");

LivingSpaceRouter
    .route("/living-space")
    .all(requireAuth)
    .get((req, res) => {
        LivingSpaceService.getAllUserSpaces(req.app.get("db"), req.user.id)
            .then( userAds => {
                return res.status(200).json({
                    userAds
                });
            });
    })
    .post((req, res) => {
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
    .route("/living-spaces")
    .get((req, res)=>{
        LivingSpaceService.getAllSpaces(req.app.get("db"))
            .then( ads => {
                return res.status(200).json({
                    ads
                });
            });
    })

LivingSpaceRouter
    .route("/living-space/:id")
    .all(requireAuth)
    .get((req, res) => {

    })
    .patch((req, res) => {
        console.log(req.user)
    })
    .delete((req, res) => {

    });

module.exports = LivingSpaceRouter;