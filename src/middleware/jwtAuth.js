const UserService = require("../services/UserService/UserService");
const JWT = require("../services/JWT/JWT");

function requireAuth( req, res, next){
    const authToken = req.get("authorization") || "";
    let bearerToken;

    if(!authToken.toLowerCase().startsWith("bearer ")){
        return res.status(401).json({ error: "Missing bearer token" });
    } else {
        bearerToken = authToken.slice( 7, authToken.length);
    };

    try{
        const payload = JWT.verifyToken(bearerToken);
        
        UserService.getUser( req.app.get("db"), payload.sub)
            .then( user => {
                if(!user){

                    return res.status(401).json({
                        error: "Unauthorized request"
                    });
                };

                req.user = user;
                next();
            })
            .catch( err => {
                next(err)
            })

    } catch( error){
        res.status(401).json({ error: "Unauthorized request"});
    };
};

module.exports = {
    requireAuth
};