import { Router } from "express";
import { getUsers, getUser, updateUser, deleteUser, syncUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/sync', authorize, syncUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.put('/:id', authorize, updateUser);
userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;