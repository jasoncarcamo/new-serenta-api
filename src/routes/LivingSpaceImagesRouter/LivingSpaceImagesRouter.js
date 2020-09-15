const express = require("express");
const LivingSpaceImagesRouter = express.Router();
const {requireAuth} = require("../../middleware/jwtAuth");
const AWS = require("aws-sdk");
const {BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY} = require("../../../config");
const fs = require("fs");
const multer = require("multer");
const LivingSpaceService = require("../../services/LivingSpaceService/LivingSpaceService");
let upload = multer({ dest: "upload/" });
const S3ImageService = require("../../services/S3ImageService/S3ImageService");

LivingSpaceImagesRouter
    .route("/living-space-images/user")
    .get(requireAuth, (req, res)=>{
        S3ImageService.getUserImages(req.app.get("db"), req.user.id)
            .then( userImages => {
                return res.status(200).json({
                    userImages
                });
            });
    });

LivingSpaceImagesRouter
    .route("/living-space-images")
    .get((req, res)=>{

    })
    .post(requireAuth, upload.array("images", Infinity), (req, res)=>{
        const {
            living_space_id,
            image_name
        } = req.body;
        const newImage = {
            image_name,
            user_id: req.user.id,
            living_space_id
        };
        const images = req.files;
        const s3 = new AWS.S3({
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY
        });
        let params;
        const fileContent = fs.readFileSync(images[0].path);
        const fileName = image_name;

        if(images.length === 0 || !images){

            if(images[0].path){
                fs.unlinkSync(images[0].path);
            };

            return res.status(400).json({
                error: "No image attached"
            });
        };

        LivingSpaceService.getSpaceById(req.app.get("db"), newImage.living_space_id)
            .then( livingSpace => {
                const currentLivingSpace = livingSpace;
                let livingSpaceImages = currentLivingSpace.images;

                if(!currentLivingSpace){

                    fs.unlinkSync(images[0].path);
                    console.log("Living space not found")
                    return res.status(404).json({
                        error: "Living space ad not found."
                    });
                };

                S3ImageService.getAdByName(req.app.get("db"), image_name, living_space_id)
                    .then( adImage => {
                        if(adImage){

                            fs.unlinkSync(images[0].path);

                            return res.status(400).json({
                                error: `Living space ad already has a file named ${image_name}`
                            });
                        };

                        params = {
                            Bucket: BUCKET_NAME,
                            Key: `${living_space_id}${fileName}`,
                            Body: fileContent,
                            ACL: "public-read"
                        };

                        s3.upload(params, (err, data)=>{
                            if(err){
        
                                fs.unlinkSync(images[0].path);
        
                                return res.status(400).json({
                                    error: err
                                });
                            };

                            newImage.url = data.Location;

                            S3ImageService.createImage(req.app.get("db"), newImage)
                                .then( createdImage => {
                                    console.log("Line 104:", createdImage)
                                    fs.unlinkSync(images[0].path);

                                    return res.status(200).json({
                                        createdImage
                                    });
                                });
                        });
                });
            });
    });

LivingSpaceImagesRouter
    .route("/living-space-images/:id")
    .get((req, res)=>{

    })
    .delete(requireAuth, upload.array("images", 12), (req, res)=>{
        const {
            image_name
        } = req.body;
        const s3 = new AWS.S3({
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY
        });
        let params;

        S3ImageService.getById(req.app.get("db"), req.params.id)
            .then( dbImage => {

                console.log("line 131:", dbImage)
                if(!dbImage){
                    return res.status(404).json({
                        error: `File ${image_name} not found.`
                    });
                };

                params = {
                    Bucket: BUCKET_NAME,
                    Key: dbImage.url.split(".com/")[1],
                };

                s3.deleteObject(params, (err, data)=>{
                    if(err){

                        return res.status(400).json({
                            error: err
                        });
                    };

                    S3ImageService.deleteImage(req.app.get("db"), req.params.id)
                        .then( deletedImage => {
                            return res.status(200).json({
                                deletedImage
                            });
                        });
                });
            });
    });

module.exports = LivingSpaceImagesRouter;