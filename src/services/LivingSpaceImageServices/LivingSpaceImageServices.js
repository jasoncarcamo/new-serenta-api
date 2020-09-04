const LivingSpaceImageServices = {
    getAllImages(db){
        return db.select("*").from("living_space_images");
    },
    getById(db, id){
        return db.select("*").from("living_space_images").where({id}).first();
    },
    createImage(db, newImage){
        return db.insert(newImage).into("living_space_images").returning("*").then(([Image]) => Image);
    },
    updateImage(db, updatedImage, id){
        return db.update(updatedImage).from("living_space_images").where({id});
    },
    deleteImage(db, id){
        return db.delete().from("living_space_images").where({id});
    }
};

module.exports = LivingSpaceImageServices;