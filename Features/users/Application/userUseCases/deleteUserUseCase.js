class DeleteUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        const user = await this.userRepository.getUsersById(id);
        if (!user) {
            const err = new Error(`User with ID ${id} not found`);
            err.statusCode = 404;
            throw err;
        }
        return this.userRepository.deleteUsers(id);
    }
}

module.exports = DeleteUserUseCase;