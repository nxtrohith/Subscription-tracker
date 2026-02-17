import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js"
import User from "../models/user.model.js"

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic to create user
        const { name, email, password } = req.body;

        //check is user already exists
        const exisitingUser = await User.findOne({ email })

        if (exisitingUser) {
            const error = new Error("User already exists with this email");
            error.statusCode = 400;
            throw error;
        }

        //Hash Password if user is new
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{ name, email, password: hashedPassword }], session);

        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: newUser[0],
                token: token
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error("User not found with this email");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }


        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                user: user,
                token: token
            }
        })

    } catch (error) {
        return next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: "User signed out successfully"
        });
    } catch (error) {
        next(error);
    }
}