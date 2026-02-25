class GetUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    execute() {
        return this.userRepository.getUsers();
    }
}

module.exports = GetUsersUseCase;
