import {app} from './src/express.js'
import 'dotenv/config.js';
import DatabaseService from './src/service/databaseService.js';

DatabaseService.connect();

// Start Server
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down');
    DatabaseService.disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

