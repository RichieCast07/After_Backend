import type { NextFunction, Request, Response } from "express";
import type { DeleteUserHandlerWithDTO } from "./handlers/deleteUserHandlerWithDTO.js";
import type { GetUserByIDHandlerWithDTO } from "./handlers/getUserByIDHandlerWithDTO.js";
import type { GetUsersHandlerWithDTO } from "./handlers/getUsersHandlerWithDTO.js";
import type { LoginHandlerWithDTO } from "./handlers/loginHandlerWithDTO.js";
import type { PutUserHandlerWithDTO } from "./handlers/putUserHandlerWithDTO.js";
import type { RegisterHandlerWithDTO } from "./handlers/registerHandlerWithDTO.js";
import type { GetUserByRolHandlerWithDTO } from "./handlers/getUserByRol.js";

export class UserController {
    private readonly getController: GetUsersHandlerWithDTO;
    private readonly deleteController: DeleteUserHandlerWithDTO;
    private readonly getByIdController: GetUserByIDHandlerWithDTO;
    private readonly putController: PutUserHandlerWithDTO;
    private readonly registerController: RegisterHandlerWithDTO;
    private readonly loginController: LoginHandlerWithDTO;
    private readonly getByRolController: GetUserByRolHandlerWithDTO;

    constructor(
        getController: GetUsersHandlerWithDTO,
        deleteController: DeleteUserHandlerWithDTO,
        getByIdController: GetUserByIDHandlerWithDTO,
        putController: PutUserHandlerWithDTO,
        registerController: RegisterHandlerWithDTO,
        loginController: LoginHandlerWithDTO,
        getByRolController: GetUserByRolHandlerWithDTO
    ) {
        this.getController = getController;
        this.deleteController = deleteController;
        this.getByIdController = getByIdController;
        this.putController = putController;
        this.registerController = registerController;
        this.loginController = loginController;
        this.getByRolController = getByRolController;
    }

    getUsers(req: Request, res: Response): Promise<void> {
        return this.getController.handle(req, res);
    }

    getUsersByRole(req: Request, res: Response): Promise<void> {
        return this.getByRolController.handle(req, res);
    }

    putUsers(req: Request, res: Response): Promise<void> {
        return this.putController.handle(req, res);
    }

    deleteUsers(req: Request, res: Response): Promise<void> {
        return this.deleteController.handle(req, res);
    }

    getUsersById(req: Request, res: Response, next?: NextFunction): Promise<void> {
        return this.getByIdController.handle(req, res);
    }

    
    loginUser(req: Request, res: Response): Promise<void> {
        return this.loginController.handle(req, res);
    }

    registerUser(req: Request, res: Response): Promise<void> {
        return this.registerController.handle(req, res);
    }
}