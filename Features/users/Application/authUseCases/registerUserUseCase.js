class RegisterUserUseCase {
     constructor ( userRepository) {
        this.userRepository = userRepository;
     }
        async execute (userData) {
        const existingUser = await this.userRepository.getUserByEmail(userData.email);
        if (existingUser) {
            const err = new Error('Email already in use');
            err.statusCode = 409;
            throw err;
        }
        return this.userRepository.registerUser(userData);
    }
}

module.exports = RegisterUserUseCase;