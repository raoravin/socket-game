// models/snakeGameModel.js

import mongoose from 'mongoose';

const snakeGameSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    players: [
        {
            name: { type: String, required: true },
            position: { type: Number, default: 1 },
        },
    ],
    winner: { type: String, default: null },
});

// Use export default to export the model
export default mongoose.model('SnakeGame', snakeGameSchema);
