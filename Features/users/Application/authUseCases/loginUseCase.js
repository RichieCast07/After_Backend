const jwt = require('jsonwebtoken');

class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    
    async execute(email, password) {
        const user = await this.userRepository.loginUser(email, password);
        if (!user) {
            const err = new Error('Invalid email or password');
            err.statusCode = 401;
            throw err;
        }
        const payload = {
            id: user.id_usuario || user.id,
            email: user.email || user.username,
        };
        const secret = process.env.JWT_SECRET || 'dev-secret';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        return { token, user };
    }
}

module.exports = LoginUserUseCase;