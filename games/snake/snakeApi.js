// games/snake/snakeApi.js
import express from "express";
import { nanoid } from "nanoid"; // nanoid supports ESM directly

const router = express.Router();
const activeGames = {};

import SnakeLadderGame from './snakeGame.js';

router.post('/create-room', (req, res) => {
  const roomId = nanoid();
  const game = new SnakeLadderGame(roomId);
  activeGames[roomId] = game;
  res.json({ roomId });
});

router.post('/join', (req, res) => {
  const { roomId, playerName } = req.body;
  const game = activeGames[roomId];

  if (!game || game.players.length >= 4) {
    return res.status(404).json({ error: 'Room not found or full' });
  }

  const player = { id: nanoid(), name: playerName };
  game.addPlayer(player);
  res.json({ roomId, player });
});

export default router;
