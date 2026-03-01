import express, { type Request, type Response, type Router } from "express";
import authMiddleware from '../../../../Core/Middleware/authMiddleware.js';
import type { UserController } from "../userController.js";

export default function productRoutes(controller: UserController): Router {
    const router = express.Router();

    // Public auth routes
    router.post('/auth/login', (req: Request, res: Response) => controller.loginUser(req, res));
    router.post('/auth/register', (req: Request, res: Response) => controller.registerUser(req, res));

    // Protected routes
    router.use(authMiddleware);
    router.get('/', (req: Request, res: Response) => controller.getUsers(req, res));
    router.get('/:id', (req: Request, res: Response) => controller.getUsersById(req, res));
    router.get('/role/:rolid', (req: Request, res: Response) => controller.getUsersByRole(req, res));
    router.put('/:id', (req: Request, res: Response) => controller.putUsers(req, res));
    router.delete('/:id', (req: Request, res: Response) => controller.deleteUsers(req, res));

    return router;
};