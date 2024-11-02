// games/snake/snakeSocket.js
import SnakeLadderGame from './snakeGame.js';

const activeGames = {};

export default (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinRoom', ({ roomId, playerId }) => {
      const game = activeGames[roomId];
      if (!game) return;

      socket.join(roomId);
      io.to(roomId).emit('updatePlayers', game.players);

      if (game.players[game.currentTurn].id === playerId) {
        io.to(roomId).emit('startTurn', playerId);
      }
    });

    socket.on('rollDice', ({ roomId, playerId }) => {
      const game = activeGames[roomId];
      if (!game || game.players[game.currentTurn].id !== playerId) return;

      const diceValue = game.rollDice();
      const result = game.movePlayer(playerId, diceValue);

      io.to(roomId).emit('updatePlayer', result);

      if (result.won) {
        io.to(roomId).emit('gameOver', { winner: result.name });
      } else {
        const nextPlayer = game.getNextTurn();
        io.to(roomId).emit('startTurn', nextPlayer.id);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
