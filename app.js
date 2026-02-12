import express from "express";
import cookieParser from "cookie-parser";

import {PORT} from "./config/env.js";

import userRouter  from "./routes/user.routes.js";
import authRouter  from "./routes/auth.router.js";
import subscriptionRouter  from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";

import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(express.json()); //helps to parse JSON bodies in requests
app.use(express.urlencoded({ extended: false })); //helps to parse URL-encoded bodies in requests
app.use(cookieParser()); //helps to parse cookies in requests
app.use(arcjetMiddleware); // Apply Arcjet middleware globally to all routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectToDatabase();
})

export default app;