import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import gameRoutes from './games/snake/gameRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware to attach io instance to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Use game routes
app.use('/api/game', gameRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A player connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('A player disconnected: ' + socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
