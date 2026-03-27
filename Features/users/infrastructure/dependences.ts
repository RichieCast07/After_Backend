import type { Application } from "express";
import { LoginUserUseCase } from '../Application/authUseCases/loginUseCase.js';
import { RegisterUserUseCase } from '../Application/authUseCases/registerUserUseCase.js';
import { DeleteUserUseCase } from '../Application/userUseCases/deleteUserUseCase.js';
import { GetUsersByIdUseCase } from '../Application/userUseCases/getUserByIDUseCase.js';
import { GetUsersUseCase } from '../Application/userUseCases/getUsersUseCase.js';
import { PutUsersUseCase } from '../Application/userUseCases/putUserUseCase.js';
import { DeleteUserHandlerWithDTO } from "./handlers/deleteUserHandlerWithDTO.js";
import { GetUserByIDHandlerWithDTO } from "./handlers/getUserByIDHandlerWithDTO.js";
import { GetUsersHandlerWithDTO } from "./handlers/getUsersHandlerWithDTO.js";
import { LoginHandlerWithDTO } from "./handlers/index.js";
import { PutUserHandlerWithDTO } from "./handlers/putUserHandlerWithDTO.js";
import { RegisterHandlerWithDTO } from "./handlers/registerHandlerWithDTO.js";
import { InMemoryUserRepository } from './Repository/inMemory.js';
import { MySQL } from './Repository/mysql.js';
import productRoutes from './Routes/usersRoutes.js';
import { UserController } from './userController.js';
import { GetUsersByRolUseCase } from "../Application/userUseCases/getUsesByRol.js";
import { GetUserByRolHandlerWithDTO } from "./handlers/getUserByRol.js";

export function init_users(app: Application): void {
    // Repository - choose adapter by env (USE_IN_MEMORY=true or NODE_ENV=test to use memory)
    let repository;
    const useInMemory = process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV === 'test';
    
    if (useInMemory) {
        repository = new InMemoryUserRepository();
        console.log('Using InMemory user repository');
    } else {
        repository = new MySQL();
    }

    // Use Cases
    const getUsersUseCase = new GetUsersUseCase(repository);
    const deleteUserUsecase = new DeleteUserUseCase({ userRepository: repository });
    const getUserByIdUsecase = new GetUsersByIdUseCase({ userRepository: repository });
    const putUserUsecase = new PutUsersUseCase({ usersRepository: repository });
    const loginUserUsecase = new LoginUserUseCase(repository);
    const registerUserUseCase = new RegisterUserUseCase(repository);
    const getUsersByRolUseCase = new GetUsersByRolUseCase(repository);

    // Handlers
    const getUsersController = new GetUsersHandlerWithDTO(getUsersUseCase);
    const deleteUserController = new DeleteUserHandlerWithDTO(deleteUserUsecase);
    const getUserByIdController = new GetUserByIDHandlerWithDTO(getUserByIdUsecase);
    const putUserController = new PutUserHandlerWithDTO(putUserUsecase);
    const registerUserController = new RegisterHandlerWithDTO(registerUserUseCase);
    const loginUserController = new LoginHandlerWithDTO(loginUserUsecase);
    const getUserByRolController = new GetUserByRolHandlerWithDTO(getUsersByRolUseCase);

    // Controller
    const userController = new UserController(
        getUsersController,
        deleteUserController,
        getUserByIdController,
        putUserController,
        registerUserController,
        loginUserController,
        getUserByRolController
    );

    // Route
    const routes = productRoutes(userController);
    app.use('/users', routes);
}
