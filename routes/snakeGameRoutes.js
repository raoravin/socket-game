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
router.post('/create',createGame );

router.post('/join', joinGame);
router.post('/:code/roll', rollDice);
router.get('/:code', getGameState);

export default router;
