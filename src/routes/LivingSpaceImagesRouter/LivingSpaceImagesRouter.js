const express = require("express");
const LivingSpaceImagesRouter = express.Router();
const {requireAuth} = require("../../middleware/jwtAuth");
const AWS = require("aws-sdk");
const {BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY} = require("../../../config");
const fs = require("fs");
const multer = require("multer");
const LivingSpaceService = require("../../services/LivingSpaceService/LivingSpaceService");
let upload = multer({ dest: "upload/" });

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
            living_space_id
        };
        const images = req.files;
        const s3 = new AWS.S3({
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY
        });
        let params;
        console.log(images, req.body);
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

                    return res.status(404).json({
                        error: "Living space ad not found."
                    });
                };

                if(!livingSpaceImages){
                    livingSpaceImages = [];
                };

                for(let i = 0; i < livingSpaceImages.length; i++){
                    if(livingSpaceImages[i].split(".com/")[1] === fileName){

                        fs.unlinkSync(images[0].path);

                        return res.status(400).json({
                            error: `Living space ad already has a file named ${fileName}`
                        });
                    };
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

                    livingSpaceImages.push(data.Location);

                    currentLivingSpace.images = livingSpaceImages;

                    LivingSpaceService.updateSpace(req.app.get("db"), currentLivingSpace, newImage.living_space_id)
                        .then( updatedLivingSpace => {

                            // delete uploaded file from storage disk
                            fs.unlinkSync(images[0].path);

                            return res.status(200).json({
                                images: currentLivingSpace.images
                            });
                        });
                });
            });
    })

LivingSpaceImagesRouter
    .route("/living-space-images/:living_space_id")
    .delete(requireAuth, upload.array("images", Infinity), (req, res)=>{
        const {
            image
        } = req.body;
        const s3 = new AWS.S3({
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY
        });
        let params;

        LivingSpaceService.getSpaceById(req.app.get("db"), req.params.living_space_id)
            .then( livingSpace => {
                const currentLivingSpace = livingSpace;
                let livingSpaceImages = currentLivingSpace.images;

                if(!currentLivingSpace){

                    return res.status(404).json({
                        error: "Living space ad not found."
                    });
                };

                if(!livingSpaceImages.includes(image)){
                    return res.status(404).json({
                        error: `Living space ad does not have a file named ${image}`
                    });
                }

                for(let i = 0; i < livingSpaceImages.length; i++){
                    if(livingSpaceImages[i] === image){
                        livingSpaceImages.splice(i, 1);
                    };
                };

                params = {
                    Bucket: BUCKET_NAME,
                    Key: image.split(".com/")[1],
                };

                currentLivingSpace.images = livingSpaceImages;

                s3.deleteObject(params, (err, data)=>{
                    if(err){

                        return res.status(400).json({
                            error: err
                        });
                    };

                    LivingSpaceService.updateSpace(req.app.get("db"), currentLivingSpace, req.params.living_space_id)
                    .then( updatedSpace => {
                        
                        return res.status(200).json({
                            success: `Deleted ${image}`,
                            updatedSpace
                         });
                    });
                });
            });
    })

module.exports = LivingSpaceImagesRouter;