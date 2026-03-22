import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', "https://after.mangelg.space/"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

export default cors(corsOptions);