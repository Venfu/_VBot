import { startServer } from './backend/server.js';

const portArg = process.argv[2];
const port = portArg ? Number(portArg) : process.env.PORT ? Number(process.env.PORT) : 3000;

startServer(port);
