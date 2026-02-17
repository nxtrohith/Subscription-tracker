import Subscription from "../models/subscription.model.js";

const createSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        })

        res.status(201).json({
            success: true,
            message: `Subscription created succccesfully: ${subscription}`,
        })
    } catch (error) {
        console.log(`Error creating subscription (Subscription Controller): ${error.message}`);
    }
}

export default createSubscription;

export const getAllSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error("Unauthorized access");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions,
        })
    } catch (error) {
        console.log(`Error fetching subscriptions (Subscription Controller): ${error.message}`);
        next(error);
    }
}

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscription,
        })
    } catch (error) {
        console.log(`Error fetching subscription (Subscription Controller): ${error.message}`);
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Verify ownership
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: updatedSubscription,
        })
    } catch (error) {
        console.log(`Error updating subscription (Subscription Controller): ${error.message}`);
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Verify ownership
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Subscription deleted successfully",
        })
    } catch (error) {
        console.log(`Error deleting subscription (Subscription Controller): ${error.message}`);
        next(error);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Verify ownership
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        subscription.status = 'canceled';
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Subscription canceled successfully",
            data: subscription,
        })
    } catch (error) {
        console.log(`Error canceling subscription (Subscription Controller): ${error.message}`);
        next(error);
    }
}

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const daysAhead = parseInt(req.query.days) || 7;
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysAhead);

        const upcomingRenewals = await Subscription.find({
            user: req.user._id,
            renewalDate: {
                $gte: today,
                $lte: futureDate
            },
            status: { $ne: 'canceled' }
        }).sort({ renewalDate: 1 });

        res.status(200).json({
            success: true,
            data: upcomingRenewals,
        })
    } catch (error) {
        console.log(`Error fetching upcoming renewals (Subscription Controller): ${error.message}`);
        next(error);
    }
}