import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import truckStopRoutes from './routes/truckStop.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS with specific options
app.use(cors({
  origin: '*', // In production, you might want to restrict this to specific domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// User routes
app.use('/api/users', userRoutes);
// Truck stop routes
app.use('/api/truck-stops', truckStopRoutes);

// Basic health check endpoint
app.get('/', (_req, res) => {
  res.json({ status: 'API is running' });
});

const numericPort = parseInt(port.toString(), 10);
app.listen(numericPort, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${numericPort}`);
});
