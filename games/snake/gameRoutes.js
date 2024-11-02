import { Router } from 'express';
import Game from './gameModel.js';

const router = Router();
const gameInstance = new Game();

// Start game route
router.post('/start', (req, res) => {
    const { players } = req.body;
    players.forEach(player => gameInstance.addPlayer(player));
    req.io.emit('gameStarted', gameInstance.players); // Broadcast to all clients
    res.status(200).send('Game started');
});

// Roll dice route
router.post('/roll', (req, res) => {
    const currentPlayerIndex = gameInstance.currentPlayerIndex;
    const diceRoll = gameInstance.rollDice();
    const moveResult = gameInstance.movePlayer(currentPlayerIndex, diceRoll);

    req.io.emit('diceRolled', { currentPlayerIndex, diceRoll, moveResult });

    if (moveResult.winner) {
        req.io.emit('gameOver', { winner: moveResult.winner });
        res.status(200).send('Game Over');
    } else {
        const nextPlayerName = gameInstance.nextPlayer();
        req.io.emit('turnChanged', { nextPlayer: nextPlayerName });
        res.status(200).send('Dice rolled');
    }
});

export default router;
