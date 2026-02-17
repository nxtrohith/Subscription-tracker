import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()

        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userid = await User.findById(req.params.id).select("-password");

        if (!userid) {
            const error = new Error("User not found")
            error.statusCode = 404;
            throw error
        }

        res.status(200).json({
            success: true,
            data: userid,
        })
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        // Verify user is updating their own profile
        if (req.user._id.toString() !== req.params.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        // Prevent password updates through this endpoint
        const { password, ...updateData } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        })
    } catch (error) {
        next(error);
    }
}

export const syncUser = async (req, res, next) => {
    try {
        // User is already created/fetched by authorize middleware
        // Just return the user data
        res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        // Verify user is deleting their own account
        if (req.user._id.toString() !== req.params.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Also delete all user's subscriptions
        await Subscription.deleteMany({ user: req.params.id });

        res.status(200).json({
            success: true,
            message: "User account deleted successfully",
        })
    } catch (error) {
        next(error);
    }
}