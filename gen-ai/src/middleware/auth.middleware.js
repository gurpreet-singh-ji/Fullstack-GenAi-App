import jwt from "jsonwebtoken"
import Blacklist from "../models/blacklist.model.js"

const authMiddleware = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "no token provided. please login first"
        })
    }

    const isBlacklisted = await Blacklist.findOne({token})

    if (isBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "invalid token. please login again"
            })
        }
        req.user = decoded
        next()
    })
}

export default authMiddleware