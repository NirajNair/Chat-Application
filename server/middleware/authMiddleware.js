const authenticate = async(req, res, next) => {
    try{
        if(!req.cookies["_sessionId"] || req.sessionID !== req.cookies["_sessionId"].replace("s:", "").split(".")[0]) {
            let err = "User not authenticated.";
            res.status(401).send({msg: "No user authenticated."});
        } else {
            next();
        }
    } catch(e) {
        console.log(e);
    }
};

module.exports = { authenticate };