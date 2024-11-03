// socket/snakeSocket.js
import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000', // Your frontend origin
            methods: ['GET', 'POST'],
            credentials: true, // Allows credentials to be included
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinGame', (data) => {
            socket.join(data.gameCode);
            io.to(data.gameCode).emit('playerJoined', data.playerName);
        });

        socket.on('rollDice', (data) => {
            io.to(data.gameCode).emit('diceRolled', { roll: data.roll });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
