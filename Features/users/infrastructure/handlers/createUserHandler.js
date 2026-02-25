class CreateUserHandler {
    constructor(createProductUseCase) {
        this.createProductUseCase = createProductUseCase;
    }

    async handle(req, res) {
        try {
            const userData = req.body;
            const created = await this.createProductUseCase.execute(userData);
            res.status(201).json(created);
        } catch (err) {
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
}

module.exports = CreateUserHandler;