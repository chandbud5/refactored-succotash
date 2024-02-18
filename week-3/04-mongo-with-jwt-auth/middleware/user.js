const jwt = require("jsonwebtoken")
const {User} = require("../db")

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    try{
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, "secret")
        const admin = User.findOne({
            username: payload.username
        })
        if(!admin) {
            throw new Error()
        }
    }
    catch(err) {
        return res.status(401).send("Unauthorized...")
    }
    next();
}

module.exports = userMiddleware;