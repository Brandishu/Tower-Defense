  class Game {
    constructor() {
      this.soldiers = [];
      this.lastTime = 0;
      this.deltaTime = 0;
      this.towers = [];
      this.enemies = new EnemyPool(10);
      this.bullets = [];
      this.isGameOver = false;
    }
  
    update(currentTime) {
      this.deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      for (let i = 0; i < this.enemies.pool.length; i++) {
        let enemy = this.enemies.pool[i];
        enemy.update(this.deltaTime);
        if (!this.isGameOver) {
            requestAnimationFrame((currentTime) => this.update(currentTime));
          }
      }
    }
  }
  export default Game;