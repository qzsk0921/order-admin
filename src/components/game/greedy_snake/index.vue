<template>
  <div class="greedy-snake-container">
    <canvas id="greedySnake" ref="greedySnake"></canvas>
    <el-button :class="['btn-play',{'hide':hide}]" type="primary" @click="handlePlay">{{btnText}}</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      snake: {
        x: 0,
        y: 0,
        w: 6,
        h: 6,
        lastDir: 0,
        offsetX: 6,
        offsetY: 6
      },
      food: {
        x: 0,
        y: 0,
        w: 6,
        h: 6
      },
      snakeBody: [],
      animationId: null,
      speed: 2,
      direction: 39, //37 38 39 40
      hide: false,
      btnText: "开始游戏"
    };
  },
  mounted() {
    this.canvas = this.$refs.greedySnake;
    const ctx = (this.ctx = this.canvas.getContext("2d"));
    // ctx.fillStyle = "green";
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px arial";
    ctx.textAlign = "center";
    ctx.fillText("贪吃蛇", this.canvas.width / 2, this.canvas.height / 2);
  },
  methods: {
    draw() {
      this.ctx.fillStyle = "red";
      let snake = this.snake;
      for (let i = 0; i < 5; i++) {
        snake.x += +snake.w;
        this.snakeBody.unshift({ ...snake });
      }
      for (const item of this.snakeBody) {
        this.ctx.fillRect(item.x, item.y, item.w - 1, item.h - 1);
      }

      const { x, y } = this.getRandomFood();
      this.food.x = x;
      this.food.y = y;

      this.drawFood();

      // 执行动画
      // const snakeMove =this.snakeMove
      this.animationId = requestAnimationFrame(timestamp =>
        this.snakeMove(timestamp, 0)
      );

      document.addEventListener("keydown", e => {
        //   left 37 up 38 right 39 down 40
        // 禁止相反方向
        if (Math.abs(snake.lastDir - e.which) === 2) return;
        snake.lastDir = e.which;

        // switch (e.which) {
        //   case 37:
        //     snake.x -= snake.w;
        //     break;
        //   case 38:
        //     snake.y -= snake.h;
        //     break;
        //   case 39:
        //     snake.x += snake.w;
        //     break;
        //   case 40:
        //     snake.y += snake.h;
        //     break;
        //   default:
        //     return;
        // }
      });
    },
    drawFood() {
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(
        this.food.x,
        this.food.y,
        this.food.w - 1,
        this.food.h - 1
      );
    },
    getRandomFood() {
      //   食物
      const getRandom = (max, min) => {
        return Math.floor(Math.random() * (max - min)) + min;
      };
      const x = getRandom(25, 0) * this.food.w;
      const y = getRandom(25, 0) * this.food.h;
      if (this.snakeBody.findIndex(item => item.x === x && item.y === y) != -1)
        return this.getRandomFood();

      return { x, y };
    },
    snakeMove(timestamp, elapsed) {
      // elapsed: 控制帧数
      // 取消回调
      cancelAnimationFrame(this.animationId);

      if (elapsed > 1000 / this.speed) {
        elapsed = 0;
        switch (this.snake.lastDir) {
          case 37:
            this.snake.x -= this.snake.offsetX;
            break;
          case 38:
            this.snake.y -= this.snake.offsetY;
            break;
          case 39:
            this.snake.x += this.snake.offsetX;
            break;
          case 40:
            this.snake.y += this.snake.offsetY;
            break;
          default:
            this.lastDir = 39;
            this.snake.x += this.snake.offsetX;
        }
        if (this.snake.x < 0 || this.snake.x >= this.canvas.width) {
          this.gameOver();
          return;
        }
        if (this.snake.y < 0 || this.snake.y >= this.canvas.height) {
          this.gameOver();
          return;
        }
        if (
          this.snakeBody.findIndex(
            item => item.x === this.snake.x && item.y === this.snake.y
          ) != -1
        ) {
          this.gameOver();
          return;
        }
        // this.ctx.clearRect(0, 0, 1000, 1000);
        // this.ctx.clearRect([...this.snakeBody].pop().x, [...this.snakeBody].pop().y, this.snake.w, this.snake.h);
        this.ctx.clearRect(
          this.snakeBody.slice(-1)[0].x,
          this.snakeBody.slice(-1)[0].y,
          this.snake.w,
          this.snake.h
        );

        this.snakeBody.unshift({ ...this.snake });

        if (this.food.x === this.snake.x && this.food.y === this.snake.y) {
          //   food.x = getRandom(0, 25) * food.w;
          //   food.y = getRandom(0, 25) * food.h;
          const { x, y } = this.getRandomFood();
          this.food.x = x;
          this.food.y = y;

          this.drawFood();
          this.speed++;
        } else {
          this.snakeBody.pop();
        }

        this.ctx.fillStyle = "red";
        for (const iterator of this.snakeBody) {
          this.ctx.fillRect(
            iterator.x,
            iterator.y,
            iterator.w - 1,
            iterator.h - 1
          );
        }
      }
      this.animationId = window.requestAnimationFrame(_timestamp =>
        this.snakeMove(_timestamp, elapsed + _timestamp - timestamp)
      );
    },
    gameOver() {
      window.cancelAnimationFrame(this.animationId);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "30px arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "GAME OVER!!!",
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      this.btnText = "重新开始";
      this.hide = false;
      this.reset();
    },
    reset() {
      this.snake.x = 0;
      this.snake.y = 0;
      this.snake.lastDir = 0;
      this.snakeBody = [];
      this.speed = 2;
    },
    handlePlay() {
      if (this.ctx)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.hide = true;
      this.draw();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.greedy-snake-container {
  position: relative;
  height: calc(100vh - 146px);
  canvas {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
  .btn-play {
    width: 250px;
    height: 80px;
    position: absolute;
    left: 50%;
    bottom: 10%;
    transform: translate(-50%, 0);
    font-size: 30px;
  }
}
.hide {
  visibility: hidden;
}
</style>