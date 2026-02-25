class RegisterHandler {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }

    async handle(req, res) {
        try {
            const userData = req.body;
            const newUser = await this.createUserUseCase.execute(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }   
    }
}

module.exports = RegisterHandler;