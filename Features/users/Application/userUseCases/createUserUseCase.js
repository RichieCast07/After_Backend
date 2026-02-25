const User = require('../../Domain/user');

class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    execute(userData) {
        if (!userData || typeof userData.username !== 'string' || userData.username.trim() === '') {
            const err = new Error('`username` is required and must be a non-empty string');
            err.statusCode = 400;
            throw err;
        }

        const user = new User({ username: userData.username.trim(), password: userData.password });

        if (typeof this.userRepository.postUsers === 'function') {
            return this.userRepository.postUsers(user);
        }

        if (typeof this.userRepository.save === 'function') {
            return this.userRepository.save(user.name, user.email);
        }

        throw new Error('Repository does not implement a known save/post method');
    }
}

module.exports = CreateUserUseCase;