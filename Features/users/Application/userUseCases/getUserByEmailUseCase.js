class GetUserByEmailUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(email) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            const err = new Error(`User with email ${email} not found`);
            err.statusCode = 404;
            throw err;
        }
        return user;
    }
}

module.exports = GetUserByEmailUseCase;