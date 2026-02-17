import { clerkClient } from '@clerk/express';
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try {
        // Clerk attaches auth to req.auth after clerkMiddleware runs
        const { userId } = req.auth || {};

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized - No valid session",
            });
        }

        // Find or create user in our database
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            // Fetch user details from Clerk
            const clerkUser = await clerkClient.users.getUser(userId);

            // Create user in our database
            user = await User.create({
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || clerkUser.primaryEmailAddress?.emailAddress,
                name: clerkUser.firstName || clerkUser.username || "User",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            error: error.message
        });
    }
};

export default authorize;
