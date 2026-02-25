const express = require('express');
const authMiddleware = require('../../../../core/middleware/authMiddleware');

module.exports = function productRoutes(controller) {
    const router = express.Router();

    // Public auth routes
    router.post('/auth/login', (req, res) => controller.loginUser(req, res));
    router.post('/auth/register', (req, res) => controller.registerUser(req, res));

    // Protected routes
    router.use(authMiddleware);
    router.get('/', (req, res) => controller.getUsers(req, res));
    router.get('/:id', (req, res) => controller.getUsersById(req, res));
    router.get('/email/:email', (req, res) => controller.getUserByEmail(req, res));
    router.put('/:id', (req, res) => controller.putUsers(req, res));
    router.delete('/:id', (req, res) => controller.deleteUsers(req, res));

    return router;
};