class GetUserByEmailHandler {
    constructor(getUserByEmailUseCase) {
        this.getUserByEmailUseCase = getUserByEmailUseCase;
    }
    
    async handle(req, res) {
        const { email } = req.params;
        try {
            const user = await this.getUserByEmailUseCase.execute(email);
            res.status(200).json(user);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}

module.exports = GetUserByEmailHandler;