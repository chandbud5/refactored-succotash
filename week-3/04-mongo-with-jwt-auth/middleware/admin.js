// Middleware for handling auth
const jwt = require("jsonwebtoken")
const {Admin} = require("../db")

function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    try{
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, "secret")
        const admin = Admin.findOne({
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

module.exports = adminMiddleware;