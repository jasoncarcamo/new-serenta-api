const express = require("express");
const LivingSpaceImagesRouter = express.Router();
const LivingSpaceImageService = require("../../services/LivingSpaceImageServices/LivingSpaceImageServices");
const {requireAuth} = require("../../middleware/jwtAuth");
const AWS = require("aws-sdk");
const {BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY} = require("../../../config");
const fs = require("fs");
const multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({ dest: "upload/" });

LivingSpaceImagesRouter
    .route("/living-space-images")
    .get((req, res)=>{

    })
    .post(requireAuth, upload.array("images", Infinity), (req, res)=>{
        const images = req.files;
        const s3 = new AWS.S3({
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY
        });
        let params;
        let imageKey;

        images.forEach((image, index)=>{
            console.log(image);
            const fileContent = fs.readFileSync(image.path);
            console.log("File content", fileContent);

            params = {
                Bucket: BUCKET_NAME,
                Key: image.originalname,
                Body: fileContent
            };

            console.log(params)
            s3.upload(params, (err, data)=>{
                if(err){
                    console.log(err);
                }

                console.log("Successfully uploaded", data)
                return res.status(200).json({
                    success: "Finished!"
                });
            })

        });
    })

module.exports = LivingSpaceImagesRouter;