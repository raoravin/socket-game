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

        socket.on('incrementCount', (data) => {
            io.to(data.gameCode).emit('updateCount', data.count);
        });

        // Listen for chat messages
        socket.on('chatMessage', (data) => {
            // Emit the chat message to all players in the game
            io.to(data.gameCode).emit('chatMessage', { message: data.message });
        });

        // Listen for box hover events
    socket.on('hoverBox', ({ gameCode, index, color }) => {
        console.log(`Box ${index} hovered with color ${color} in game: ${gameCode}`);
        // Emit the box color change to all clients in the game room
        socket.to(gameCode).emit('boxColorUpdate', { index, color });
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
