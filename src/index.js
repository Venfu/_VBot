import { startServer } from './server.js';

startServer(process.env.PORT ? Number(process.env.PORT) : 3000);
