import { Router } from "express";

const userRouter = Router();

userRouter.get('/', (req, res) => res.send({title : "GET all users"}));
userRouter.get('/:id', (req, res) => res.send({title : "GET user by ID"}));
userRouter.post('/', (req, res) => res.send({title : "Create new user"}));
userRouter.put('/:id', (req, res) => res.send({title : "Update user by ID"}));
userRouter.delete('/:id', (req, res) => res.send({title : "Delete user by ID"}));

export default userRouter;