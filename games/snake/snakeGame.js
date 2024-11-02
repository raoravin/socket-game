// games/snake/snakeGame.js
class SnakeLadderGame {
    constructor(roomId) {
      this.roomId = roomId;
      this.players = [];
      this.boardSize = 100;
      this.snakes = { 14: 7, 31: 26, 78: 25, 99: 9 };
      this.ladders = { 3: 22, 5: 8, 11: 26, 20: 29 };
      this.currentTurn = 0;
      this.gameActive = true;
    }
  
    addPlayer(player) {
      if (this.players.length < 4) {
        this.players.push({ ...player, position: 0 });
        return true;
      }
      return false;
    }
  
    rollDice() {
      return Math.floor(Math.random() * 6) + 1;
    }
  
    movePlayer(playerId, diceValue) {
      const player = this.players.find(p => p.id === playerId);
      if (!player || !this.gameActive) return null;
  
      let newPosition = player.position + diceValue;
  
      if (newPosition >= this.boardSize) {
        player.position = this.boardSize;
        this.gameActive = false;
        return { ...player, won: true };
      }
  
      player.position = this.snakes[newPosition] || this.ladders[newPosition] || newPosition;
      return { ...player, won: false };
    }
  
    getNextTurn() {
      this.currentTurn = (this.currentTurn + 1) % this.players.length;
      return this.players[this.currentTurn];
    }
  }
  
  export default SnakeLadderGame;
  