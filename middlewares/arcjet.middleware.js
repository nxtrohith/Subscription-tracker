import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try{
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()) return res.status(429).json({message: "Too many requests. Please try again later."});
            if(decision.reason.isBot()) return res.status(403).json({message: "Access denied for bots."});
            return res.status(403).json({message: "Access denied."});
        }

        next(); // Proceed to the next middleware or route handler if the request is allowed
    }catch (error){
        console.log(`Error in Arcjet middleware: ${error.message}`);
        next(error)
    }
}

export default arcjetMiddleware;