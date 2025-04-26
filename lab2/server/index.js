import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { seedDatabase } from './seed.js';
import employeeRoutes from './routes/employees.js';
import projectRoutes from './routes/projects.js';
import projectAssignmentRoutes from './routes/projectAssignments.js';

const app = express();

// Middleware
app.use(logger('dev'));
app.use(cors({
  origin: '*',
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Database connection and seeding
const initializeDatabase = async () => {
  try {
    await seedDatabase(); // Now using the exported function directly
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-assignments', projectAssignmentRoutes);

// Health check endpoints
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, async (error) => {
  console.log(error);
  console.log(`Server is running on port ${PORT}...`);
  await initializeDatabase();
});