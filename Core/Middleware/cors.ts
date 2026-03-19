import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5000', 'http://localhost:8100', "https://qlqk7bmz-5173.usw3.devtunnels.ms/"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

export default cors(corsOptions);