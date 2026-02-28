import jwt from 'jsonwebtoken';
import { HttpErrors } from "../../Domain/Data/errors.js";
import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

export class LoginUserUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
    
    async execute(username: string, password: string): Promise<{ token: string; user: User }> {
        const user = await this.userRepository.loginUser(username, password);
        
        if (!user) {
            throw HttpErrors.unauthorized('Invalid username or password');
        }
        
        const payload = {
            id: user.id,
            username:  user.username,
        };
        
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw HttpErrors.internalServerError('JWT_SECRET is not defined');
        }
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });
        
        return { token, user };
    }
}
