// routes/snakeGameRoutes.js
import express from 'express';
import {
    createGame,
    joinGame,
    rollDice,
    getGameState,
} from '../controllers/snakeGameController.js';
import snakeGameModel from '../models/snakeGameModel.js';

const router = express.Router();

// Function to generate a unique game code
const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};


// Create a new game
router.post('/create', async (req, res) => {
    const { players } = req.body; // Expecting players from request body
    const gameCode = generateGameCode();

    try {
        const newGame = new snakeGameModel({
            code: gameCode,
            players: players || [],
        });
        await newGame.save();
        res.status(201).json({ code: gameCode });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(400).json({ error: 'Failed to create game' });
    }
});

router.post('/join', joinGame);
router.post('/:code/roll', rollDice);
router.get('/:code', getGameState);

export default router;
