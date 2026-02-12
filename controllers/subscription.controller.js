import Subscription from "../models/subscription.model.js";

const createSubscription = async (req, res) => {
    try{
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        })

        res.status(201).json({
            success: true,
            message: `Subscription created succccesfully: ${subscription}`,
        })
    }catch(error){
        console.log(`Error creating subscription (Subscription Controller): ${error.message}`);
    }
}

export default createSubscription;

export const getAllSubscriptions = async (req, res, next) => {
    try{
        if(req.user.id !== req.params.id){
            const error = new Error("Unauthorized access");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id});
        
        res.status(200).json({
            success: true,
            data: subscriptions,
        })
    }catch(error){
        console.log(`Error fetching subscriptions (Subscription Controller): ${error.message}`);
        next(error);
    }
}