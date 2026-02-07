import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
import User from "../models/user.model.js";


const authorize = async (req, res, next) => {
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]; // Extract the token from the "Bearer" scheme
        }

        if(!token){
            return res.status(401).json({
                message: "Unauthorized",
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);
        console.log(user);

        if(!user){
            return res.status(401).json({
                message: "Unauthorized",
            })
        }
    }catch(error){
        res.status(401).json({
            message: "Unauthorized",
            error: error.message
        })
    }
}