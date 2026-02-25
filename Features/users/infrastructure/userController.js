class UserController {
    constructor(getController, deleteController, getByIdController, putController,getByEmailController, registerController , loginController) {
        //this.createController = createController;
        this.getController = getController;
        this.deleteController = deleteController;
        this.getByIdController = getByIdController;
        this.putController = putController;
        this.getByEmailController = getByEmailController;
        this.registerController = registerController;
        this.loginController = loginController;
    }


    /*

    createUser(req, res) {
        const userData = req.body;
        // delegate to handler's HTTP interface
        return this.createController.handle(req, res);
    }

    */

    getUsers(req, res) {
        return this.getController.handle(req, res);
    }
    putUsers(req, res) {
        return this.putController.handle(req, res);
    }

    deleteUsers(req, res) {
        return this.deleteController.handle(req, res);
    }

    getUsersById(req, res) {
        return this.getByIdController.handle(req, res);
    }
    getUserByEmail(req, res) {
        return this.getByEmailController.handle(req, res);
    }

    loginUser(req, res) {
        return this.loginController.handle(req, res);
    }

    registerUser(req, res) {
        return this.registerController.handle(req, res);
    }
}

module.exports = UserController;