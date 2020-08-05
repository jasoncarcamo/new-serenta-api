const UserService = {
    getUser(db, email){
 
        return db.select("*").from("users").where({email}).first();
    },
    getUserById(db, id){
        return db.select("*").from("users").where({id}).first();
    },
    createUser(db, newUser){

        return db.insert(newUser).from("users").returning("*").then(([user]) => user);
    },
    updateUser(db, updateUser, id){
        return db.update(updateUser).from("users").where({id}).returning("*").then(([updatedUser]) => updatedUser);
    },
    deleteUser(db, id){
        return db.delete().from("users").where({id});
    }
};

module.exports = UserService;