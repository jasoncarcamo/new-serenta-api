const S3ImageService = {
    getUserImages(db, user_id){
        return db.select("*").from("images").where({user_id});
    },
    getById(db, id){
        return db.select("*").from("images").where({id}).first();
    },
    getByAdInfo(db, user_id, living_space_id){
        return db.select("*").from("images").where({user_id, living_space_id}).first();
    },
    getAdByName(db, image_name, living_space_id){
        return db.select("*").from("images").where({image_name, living_space_id}).first();
    },
    createImage(db, newImage){
        return db.insert(newImage).from("images").returning("*").then(([image]) => image);
    },
    updateImage(db, updatedImage, id){
        return db.update(updatedImage).from("images").where({id}).returning("*").then(([image]) => image);
    },
    deleteImage(db, id){
        return db.delete().from("images").where({id}).returning("*").then(([image]) => image);
    }
}; 

module.exports = S3ImageService;