

// snakeServer.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { initSocket } from './socket/snakeSocket.js';
import dotenv from 'dotenv';
import snakeGameRoutes from './routes/snakeGameRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // specify your frontend URL here
      methods: ['GET', 'POST'],
      credentials: true,
}));
app.use(express.json());
app.use('/api/games', snakeGameRoutes);

// MongoDB connection
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        const server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
        initSocket(server);
    })
    .catch((error) => console.error('MongoDB connection error:', error));
