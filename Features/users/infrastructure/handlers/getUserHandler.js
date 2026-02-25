class GetProductController {
    constructor(getProductUseCase) {
        this.getProductUseCase = getProductUseCase;
    }

    async handle(req, res) {
        try {
            const users = await this.getProductUseCase.execute();
            res.status(200).json(users);
        } catch (err) {
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
}
module.exports = GetProductController;
