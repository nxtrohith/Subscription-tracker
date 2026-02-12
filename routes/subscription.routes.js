import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import createSubscription, { getAllSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    // Handle login logic here
    res.send({ title: "GET all subscriptions" });
});
subscriptionRouter.get('/:id', (req, res) => {
    // Handle login logic here
    res.send({ title: "GET subscription details" });
});
subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, (req, res) => {
    // Handle login logic here
    res.send({ title: "PUT update a subscription" });
});
subscriptionRouter.delete('/:id', (req, res) => {
    // Handle login logic here
    res.send({ title: "DELETE a subscription" });
});

subscriptionRouter.get('/user/:id', authorize, getAllSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => {
    // Handle login logic here
    res.send({ title: "PUT cancel a subscription" });
});
subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    // Handle login logic here
    res.send({ title: "GET upcoming renewals" });
});

export default subscriptionRouter;