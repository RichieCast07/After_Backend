import cors from 'cors';

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '');
}

function buildAllowedOrigins(): string[] {
  const defaults = [
    'http://localhost:5173',
    'https://after.mangelg.space',
    'https://www.after.mangelg.space'
  ];

  const fromEnv = String(process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allOrigins = [...defaults, ...fromEnv].map(normalizeOrigin);
  return Array.from(new Set(allOrigins));
}

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const allowedOrigins = buildAllowedOrigins();
    const isAllowed = allowedOrigins.includes(normalizedOrigin);

    if (isAllowed) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

export default cors(corsOptions);