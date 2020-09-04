const express = require("express");
const LivingSpaceImagesRouter = express.Router();
const LivingSpaceImageService = require("../../services/LivingSpaceImageServices/LivingSpaceImageServices");
const {requireAuth} = require("../../middleware/jwtAuth");
const AWS = require("aws-sdk");
const {BucketName, AccessKeyId, SecretAccessKey} = require("../../../config");
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"upload/"});

LivingSpaceImagesRouter
    .route("/living-space-images")
    .get((req, res)=>{

    })
    .post(requireAuth, upload.array("images", 12), (req, res)=>{
        const {
            images
        } = req.body;

        const newImages = {
            images
        };

        const s3 = new AWS.S3({
            accessKeyId: AccessKeyId,
            secretAccessKey: SecretAccessKey
        });
        let params;
        let imageKey;

        console.log(newImages);
        console.log(req.file)

        for( const [key, value] of Object.entries(newImages)){
            console.log("Value", value[0]);
            if(!value){
                return res.status(400).json({
                    error: `Missing ${key} in body request`
                });
            };
        };

        for(let i = 0; i < newImages.images.length; i++){
    

            ImageData = fs.readFileSync(newImages.images);

            console.log(ImageData)

            params = {
                Bucket: BucketName,
                Key: newImages.images[i].name,
                Body: ImageData
            };
        };

        return res.status(200).json({
            success: "Finished!"
        });
    })

module.exports = LivingSpaceImagesRouter;