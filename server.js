// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { nanoid } = require('nanoid');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // allow access from any domain (adjust in production)
    methods: ['GET', 'POST'],
  },
});

const games = {}; // Store game rooms and their state

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a game room
  socket.on('createGame', () => {
    const roomCode = nanoid(6);
    games[roomCode] = { players: [socket.id], gameState: {}, turn: 0 };
    socket.join(roomCode);
    socket.emit('gameCreated', { roomCode });
    console.log(`Game created with code: ${roomCode}`);
  });

  // Join an existing game
  socket.on('joinGame', ({ roomCode }) => {
    const game = games[roomCode];
    if (game && game.players.length < 4) {
      game.players.push(socket.id);
      socket.join(roomCode);
      io.to(roomCode).emit('playerJoined', { playerCount: game.players.length });
      console.log(`User ${socket.id} joined game ${roomCode}`);

      if (game.players.length === 4) {
        io.to(roomCode).emit('startGame', { players: game.players });
      }
    } else {
      socket.emit('error', { message: 'Room is full or does not exist.' });
    }
  });

  // Handle dice roll
  socket.on('rollDice', ({ roomCode }) => {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const game = games[roomCode];
    if (game) {
      const playerIndex = game.turn % game.players.length;
      const playerId = game.players[playerIndex];

      io.to(roomCode).emit('diceRolled', { playerId, diceValue });

      // Update the turn
      game.turn += 1;
      io.to(roomCode).emit('nextTurn', { nextPlayerId: game.players[game.turn % game.players.length] });
    }
  });

  // Disconnect event
  socket.on('disconnect', () => {
    Object.keys(games).forEach((roomCode) => {
      const game = games[roomCode];
      if (game.players.includes(socket.id)) {
        game.players = game.players.filter((id) => id !== socket.id);
        io.to(roomCode).emit('playerLeft', { playerId: socket.id });
        if (game.players.length === 0) delete games[roomCode]; // Clean up empty games
      }
    });
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
