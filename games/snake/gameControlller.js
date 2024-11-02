// gameModel.js
class Game {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.board = this.createBoard();
    }

    createBoard() {
        const board = Array.from({ length: 100 }, (_, index) => index + 1);
        // Define snakes and ladders
        const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
        const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 72: 91, 80: 100 };

        // Apply snakes and ladders to the board
        for (const [key, value] of Object.entries(snakes)) {
            board[key - 1] = value;
        }
        for (const [key, value] of Object.entries(ladders)) {
            board[key - 1] = value;
        }
        return board;
    }

    addPlayer(name) {
        this.players.push({ name, position: 0 });
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    movePlayer(playerIndex, diceRoll) {
        const player = this.players[playerIndex];
        player.position += diceRoll;

        // If player goes past 100, don't move
        if (player.position > 100) {
            player.position = 100;
        }

        // Check for snakes or ladders
        const newPosition = this.board[player.position - 1];
        player.position = newPosition;

        // Check for win
        if (player.position === 100) {
            return { winner: player.name };
        }

        return { winner: null };
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        return this.players[this.currentPlayerIndex].name;
    }
}

export default Game;
