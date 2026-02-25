const MySQLAdapter = require('./Repository/mysql');
const CreateUserUseCase = require('../Application/userUseCases/createUserUseCase');
const GetUsersUseCase = require('../Application/userUseCases/getUsersUseCase');
const productRoutes = require('./Routes/usersRoutes');
const UserController = require('./userController');
const CreateUserController = require('./handlers/createUserHandler');
const GetUsersController = require('./handlers/getUserHandler');
const DeleteUserUseCase = require('../Application/userUseCases/deleteUserUseCase');
const GetUsersByIdUseCase = require('../Application/userUseCases/getUserByIDUsecase');
const PutUsersUseCase = require('../Application/userUseCases/putUserUseCase');
const LoginUserUseCase = require('../Application/authUseCases/loginUseCase');
const GetUserByEmailUseCase = require('../Application/userUseCases/getUserByEmailUseCase');
const RegisterUserUseCase = require('../Application/authUseCases/registerUserUseCase');
const DeleteUserHandler = require('./handlers/deleteUserHandler');
const GetUserByIDHandler = require('./handlers/getUserByIDHandler');
const PutUserHandler = require('./handlers/putUserHandler');
const GetUserByEmailHandler = require('./handlers/getUserByEmailHandler');
const RegisterHandler = require('./handlers/registerhandler');
const LoginHandler = require('./handlers/loginHandler');


function init_users(app) {
    //repository - choose adapter by env (USE_IN_MEMORY=true or NODE_ENV=test to use memory)
    let repository;
    const useInMemory = process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV === 'test';
    if (useInMemory) {
        const InMemory = require('./Repository/inMemory');
        repository = new InMemory();
        console.log('Using InMemory user repository');
    } else {
        repository = new MySQLAdapter();
    }

    //use cases
    //const createUserUseCase = new CreateUserUseCase(repository);
    const getUsersUseCase = new GetUsersUseCase(repository);
    const deleteUserUsecase = new DeleteUserUseCase({ userRepository: repository });
    const getUserByIdUsecase = new GetUsersByIdUseCase({ userRepository: repository });
    const putUserUsecase = new PutUsersUseCase({ usersRepository: repository });
    const getUserByEmailUsecase = new GetUserByEmailUseCase(repository);
    const loginUserUsecase = new LoginUserUseCase(repository);
    const registerUserUseCase = new RegisterUserUseCase(repository);

    //handlers
    //const createUserController = new CreateUserController(createUserUseCase);
    const getUsersController = new GetUsersController(getUsersUseCase);
    const deleteUserController = new DeleteUserHandler(deleteUserUsecase);
    const getUserByIdController = new GetUserByIDHandler(getUserByIdUsecase);
    const putUserController = new PutUserHandler(putUserUsecase);
    const getUserByEmailController = new GetUserByEmailHandler(getUserByEmailUsecase);   
    const registerUserController = new RegisterHandler(registerUserUseCase);
    const loginUserController = new LoginHandler(loginUserUsecase);

    //controlador
    const userController = new UserController(
        getUsersController,
        deleteUserController,
        getUserByIdController,
        putUserController,
        getUserByEmailController,
        registerUserController,
        loginUserController
    );

    const routes = productRoutes(userController);
    app.use('/users', routes);

}

module.exports = { init_users };