const authenticate = async(req, res, next) => {
    try{
        if(req.sessionID !== req.cookies["_sessionId"].replace("s:", "").split(".")[0]) {
            let err = "User not authenticated.";
            res.status(401).send({msg: err});
        } else {
            console.log("user authenticated");
            next();
        }
    } catch(e) {
        console.log(e);
    }
    // console.log(req.sessionID, req.cookies["_sessionId"].replace("s:", "").split(".")[0]);
};

module.exports = { authenticate };