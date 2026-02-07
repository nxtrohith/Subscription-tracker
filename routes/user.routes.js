import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', (req, res) => res.send({title : "Create new user"}));
userRouter.put('/:id', (req, res) => res.send({title : "Update user by ID"}));
userRouter.delete('/:id', (req, res) => res.send({title : "Delete user by ID"}));

export default userRouter;