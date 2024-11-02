// controllers/snakeGameController.js
import SnakeGame from '../models/snakeGameModel.js';

// Create a new game
export const createGame = async (req, res) => {

    console.log("hello");
    
    const { code } = req.body;
    const game = new SnakeGame({ code });

    try {
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ message: error.message });
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

        // Check if the game is full (more than 4 players)
        if (game.players.length >= 4) {
            return res.status(400).json({ message: 'Game is full' });
        }

        // Assign position based on the current number of players
        const newPlayerPosition = game.players.length + 1; // 1-based index for positions

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

        // Example logic for moving the player (you'll need to customize this)
        if (game.players.length > 0) {
            const player = game.players[0]; // Assume first player for simplicity
            player.position += diceRoll;

            // Check for winning condition (you'll need to adjust according to your game rules)
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
