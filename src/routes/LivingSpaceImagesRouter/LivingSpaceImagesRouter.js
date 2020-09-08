const express = require("express");
const LivingSpaceImagesRouter = express.Router();
const {requireAuth} = require("../../middleware/jwtAuth");
const AWS = require("aws-sdk");
const {BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY} = require("../../../config");
const fs = require("fs");
const multer = require("multer");
const LivingSpaceImageServices = require("../../services/LivingSpaceImageServices/LivingSpaceImageServices");
const LivingSpaceService = require("../../services/LivingSpaceService/LivingSpaceService");

var storage = multer.memoryStorage();
var upload = multer({ dest: "upload/" });

LivingSpaceImagesRouter
    .route("/living-space-images")
    .get((req, res)=>{

    })
    .post(requireAuth, upload.array("images", Infinity), (req, res)=>{
        const {
            living_space_id
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
        const fileContent = fs.readFileSync(images[0].path);
        const fileName = images[0].originalname;

        console.log("file", fileName);
        console.log("Images", images)

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
                    Key: images[0].originalname,
                    Body: fileContent
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
                                success: `Image ${fileName} saved`
                            });
                        });
                });
            });
    })

module.exports = LivingSpaceImagesRouter;