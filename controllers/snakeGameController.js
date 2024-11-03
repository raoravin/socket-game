import SnakeGame from '../models/snakeGameModel.js';

// Generate a unique game code
const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};

// Create a new game
export const createGame = async (req, res) => {
    const { players } = req.body;
    const gameCode = generateGameCode();

    try {
        const newGame = new SnakeGame({
            code: gameCode,
            players: players || [],
        });
        await newGame.save();
        res.status(201).json({ code: gameCode });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(400).json({ error: 'Failed to create game' });
    }
};

// Join an existing game
export const joinGame = async (req, res) => {
    const { code, name } = req.body;

    try {
        const game = await SnakeGame.findOne({ code });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.players.length >= 4) {
            return res.status(400).json({ message: 'Game is full' });
        }

        const newPlayerPosition = game.players.length + 1;

        game.players.push({ name, position: newPlayerPosition });
        await game.save();

        res.status(200).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Roll the dice
export const rollDice = async (req, res) => {
    const { code } = req.params;

    try {
        const game = await SnakeGame.findOne({ code });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const diceRoll = Math.floor(Math.random() * 6) + 1;

        // Move the player (first player for simplicity)
        if (game.players.length > 0) {
            const player = game.players[0]; // Assume first player for simplicity
            player.position += diceRoll;

            // Check for winning condition
            if (player.position >= 100) {
                game.winner = player.name;
            }

            await game.save();
        }

        res.status(200).json({ diceRoll });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get game state
export const getGameState = async (req, res) => {
    const { code } = req.params;

    try {
        const game = await SnakeGame.findOne({ code });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.status(200).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
