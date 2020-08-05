const SpaceService = {
    getSpaceById(db, id){

        return db.select("*").from("living_space").where({id}).first();
    },
    getAllUserSpaces(db, id){
        return db.select("*").from("living_space").where({user_id: id});
    },
    getAllSpaces(db){

        return db.select("*").from("living_space");
    },
    createSpace(db, newSpace){

        return db.insert(newSpace).into("living_space").returning("*").then(([space]) => space);
    },
    updateSpace(db, updatedSpace, id){

        return db.update(updatedSpace).from("living_space").where({id});
    },
    deleteSpace(db, id){

        return db.delete().from("living_space").where({id});
    }
};

module.exports = SpaceService;