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
            comments,
            lat,
            lng,
            email,
            mobile_number
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
            comments,
            lat,
            lng,
            date_created: new Date(),
            posted: false,
            email: email || req.user.email,
            mobile_number: mobile_number || req.user.mobile_number
        };
        
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
        const{
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
            comments,
            lat,
            lng,
            posted,
            email,
            mobile_number
        } = req.body;

        const updateAd = {
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
            comments,
            lat,
            lng,
            posted,
            date_last_modified: new Date(),
            email,
            mobile_number
        };

        for(const [key, value] of Object.entries(updateAd)){
            if(value === undefined || value === null){
                return res.status(400).json({
                    error: `Missing ${key} in body request.`
                });
            };
        };

        LivingSpaceService.getSpaceById(req.app.get("db"), req.params.id)
            .then( ad => {
                if(!ad){
                    return res.status(404).json({
                        error: "Living space ad was not found."
                    });
                };

                LivingSpaceService.updateSpace(req.app.get('db'), updateAd, req.params.id)
                    .then( updatedAd => {
                        return res.status(200).json({
                            updatedAd
                        });
                    });
            });
    })
    .delete((req, res) => {
        LivingSpaceService.getSpaceById(req.app.get("db"), req.params.id)
            .then( ad => {
                
                if(!ad){
                    return res.status(404).json({
                        error: "Ad was not found."
                    });
                };

                LivingSpaceService.deleteSpace(req.app.get("db"), req.params.id)
                    .then( deletedAd => {

                        return res.status(200).json({
                            deletedAd: ad
                        });
                })
            })
    });

module.exports = LivingSpaceRouter;