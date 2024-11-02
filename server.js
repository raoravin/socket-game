// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import gameRoutes from './games/snake/gameRoutes.js';
// import dotenv from 'dotenv'; // Import dotenv

// // Load environment variables from .env file
// dotenv.config(); // Call config() to load the variables



// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000', // specify your frontend URL here
//         methods: ['GET', 'POST'],
//         credentials: true,
//     }
// });
// const PORT = 5000;

// // Allow requests from your frontend
// app.use(cors({
//     origin: 'http://localhost:3000', // specify your frontend URL here
//     methods: ['GET', 'POST'],
//     credentials: true,
// }));

// app.use(express.json()); // Middleware to parse JSON requests
// // Middleware to attach io instance to request
// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });

// // Use game routes
// app.use('/api/game', gameRoutes);

// // Socket.IO connection
// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log(`A player connected: ${socket.id}`);

//   socket.on('joinGame', (data) => {
//       if (!data || !data.gameCode) {
//           console.error('Game code is required to join the game.');
//           return;
//       }
//       socket.join(data.gameCode);
//       console.log(`Socket ${socket.id} joined game ${data.gameCode}`);
//   });

//   socket.on('rollDice', (data) => {
//       if (!data || !data.gameCode) {
//           console.error('Game code is required to roll the dice.');
//           return;
//       }

//       const diceRoll = Math.floor(Math.random() * 6) + 1; // Example dice roll
//       io.to(data.gameCode).emit('diceRolled', { diceRoll });
//   });

//   socket.on('disconnect', () => {
//       console.log(`A player disconnected: ${socket.id}`);
//   });
// });


// // Start the server
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

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
