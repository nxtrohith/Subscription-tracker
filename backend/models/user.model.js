import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: [true, "Clerk ID is required"],
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        match: [/.+@.+\..+/, "Please fill a valid email address"]
    },
}, { timestamps: true });

const user = mongoose.model('User', userSchema);

export default user;
