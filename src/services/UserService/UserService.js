const UserService = {
    getUser(db, email){
 
        return db.select("*").from("users").where({email}).first();
    },
    createUser(db, newUser){

        return db.insert(newUser).from("users").returning("*").then(([user]) => user);
    },

};

module.exports = UserService;