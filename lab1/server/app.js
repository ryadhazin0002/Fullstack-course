import {app} from './src/express.js'
import 'dotenv/config.js';
import DatabaseService from './src/service/databaseService.js';

// Connect to Database
DatabaseService.connect();


const port = process.env.PORT;

// Start Server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Close server and disconnect from database on shutdown
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down');
    DatabaseService.disconnect();
    process.exit(0);
  });
}

// Handle shutdown signals
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

