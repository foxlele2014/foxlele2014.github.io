import { experiences } from "./data/experiences.js";

// 添加音频
const audio = {
  background: new Audio("assets/background.wav"),
  collect: new Audio("assets/collect.mp3"),
  gameOver: new Audio("assets/gameover.wav"),
};

// 设置背景音乐循环播放
audio.background.loop = true;

// 经历球类
class ExperienceBall {
  constructor(title, content, x, y, size) {
    this.title = title;
    this.content = content;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = content.color;
    this.type = content.type;
    this.experience = { title, content };
    // 添加粒子效果属性
    this.particles = [];
  }

  // 创建收集特效
  createCollectEffect() {
    const numParticles = 10;
    for (let i = 0; i < numParticles; i++) {
      this.particles.push({
        x: this.x + this.size / 2,
        y: this.y + this.size / 2,
        radius: Math.random() * 3 + 2,
        angle: (Math.PI * 2 * i) / numParticles,
        speed: Math.random() * 2 + 1,
        alpha: 1,
      });
    }
  }

  // 更新和绘制粒子
  updateParticles(ctx) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.02;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.getRGBFromHex(this.color)},${p.alpha})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 辅助函数：将十六进制颜色转换为RGB
  getRGBFromHex(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  // 检查是否与其他物体碰撞
  checkCollision(other) {
    // 获取两个物体的边界
    const thisBounds = {
      left: this.x,
      right: this.x + this.size,
      top: this.y,
      bottom: this.y + this.size,
    };

    const otherBounds = {
      left: other.x,
      right: other.x + this.size,
      top: other.y,
      bottom: other.y + this.size,
    };

    // 检查边界重叠
    return !(
      thisBounds.left >= otherBounds.right ||
      thisBounds.right <= otherBounds.left ||
      thisBounds.top >= otherBounds.bottom ||
      thisBounds.bottom <= otherBounds.top
    );
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 绘制粒子效果
    this.updateParticles(ctx);
  }
}

// 游戏结束弹窗类
class GameOverModal {
  constructor() {
    this.modal = document.getElementById("gameOverModal");
  }

  show(experiences) {
    this.modal.style.display = "block";
    document.getElementById("experienceCount").textContent = experiences.length;
    // 保存收集的经历到 localStorage
    localStorage.setItem("collectedExperiences", JSON.stringify(experiences));
  }

  hide() {
    this.modal.style.display = "none";
  }
}

// 障碍物类
class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "#34495e";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // 检查碰撞
  checkCollision(object) {
    return !(
      object.x + object.size < this.x ||
      object.x > this.x + this.width ||
      object.y + object.size < this.y ||
      object.y > this.y + this.height
    );
  }
}

class SnakeGame {
  constructor(experiences) {
    this.experiences = experiences;
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.gridSize = 20;

    // 游戏状态
    this.snake = [{ x: 10, y: 10 }];
    this.food = null;
    this.direction = "right";
    this.collectedExperiences = [];
    this.isGameOver = false;
    this.gameLoop = null;

    // 创建游戏结束弹窗实例
    this.gameOverModal = new GameOverModal();

    // 添加障碍物数组
    this.obstacles = [];

    // 添加背景图案
    this.bgPattern = this.createBackgroundPattern();

    this.initGame();
    this.bindEvents();
    this.start();

    // 播放背景音乐
    audio.background.play().catch((e) => console.log("等待用户交互后播放音乐"));
  }

  // 创建背景图案
  createBackgroundPattern() {
    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");
    patternCanvas.width = 50;
    patternCanvas.height = 50;

    // 绘制网格背景
    patternCtx.strokeStyle = "#e0e0e0";
    patternCtx.lineWidth = 1;
    patternCtx.beginPath();
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(50, 0);
    patternCtx.lineTo(50, 50);
    patternCtx.lineTo(0, 50);
    patternCtx.closePath();
    patternCtx.stroke();

    return this.ctx.createPattern(patternCanvas, "repeat");
  }

  // 生成随机障碍物
  generateObstacles() {
    this.obstacles = [];
    const numObstacles = Math.floor(Math.random() * 5) + 3; // 3-7个障碍物

    for (let i = 0; i < numObstacles; i++) {
      const margin = this.gridSize * 2;
      const width = this.gridSize * (Math.floor(Math.random() * 3) + 1);
      const height = this.gridSize * (Math.floor(Math.random() * 3) + 1);

      const x =
        Math.floor(Math.random() * (this.canvas.width - width - 2 * margin)) +
        margin;
      const y =
        Math.floor(Math.random() * (this.canvas.height - height - 2 * margin)) +
        margin;

      // 确保障碍物不会与蛇的初始位置重叠
      if (!this.isPositionValid(x, y, width, height)) {
        continue;
      }

      this.obstacles.push(new Obstacle(x, y, width, height));
    }
  }

  // 检查位置是否有效（不与蛇和其他障碍物重叠）
  isPositionValid(x, y, width, height) {
    // 检查与蛇的碰撞
    const snakeHead = this.snake[0];
    if (
      x < snakeHead.x + this.gridSize * 3 &&
      x + width > snakeHead.x - this.gridSize * 3 &&
      y < snakeHead.y + this.gridSize * 3 &&
      y + height > snakeHead.y - this.gridSize * 3
    ) {
      return false;
    }

    // 检查与其他障碍物的碰撞
    return !this.obstacles.some(
      (obs) =>
        x < obs.x + obs.width + this.gridSize &&
        x + width > obs.x - this.gridSize &&
        y < obs.y + obs.height + this.gridSize &&
        y + height > obs.y - this.gridSize
    );
  }

  initGame() {
    // 设置画布大小
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // 计算网格大小
    this.gridSize = Math.min(
      Math.floor(this.canvas.width / 30),
      Math.floor(this.canvas.height / 20)
    );
    this.gridSize = Math.floor(this.gridSize / 20) * 20;

    this.generateObstacles();
    this.generateFood();
  }

  bindEvents() {
    // 键盘控制
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
    // 窗口大小变化
    window.addEventListener("resize", () => this.initGame());
  }

  handleKeyPress(e) {
    // 如果游戏结束则不处理按键
    if (this.isGameOver) return;

    switch (e.key) {
      case "ArrowUp":
        this.direction = "up";
        break;
      case "ArrowDown":
        this.direction = "down";
        break;
      case "ArrowLeft":
        this.direction = "left";
        break;
      case "ArrowRight":
        this.direction = "right";
        break;
    }
  }

  generateFood() {
    const randomExp =
      this.experiences[Math.floor(Math.random() * this.experiences.length)];
    const margin = this.gridSize;
    this.food = new ExperienceBall(
      randomExp.title,
      randomExp.content,
      Math.floor(
        Math.random() * ((this.canvas.width - 2 * margin) / this.gridSize)
      ) *
        this.gridSize +
        margin,
      Math.floor(
        Math.random() * ((this.canvas.height - 2 * margin) / this.gridSize)
      ) *
        this.gridSize +
        margin,
      this.gridSize
    );
  }

  moveSnake() {
    const head = { ...this.snake[0] };

    switch (this.direction) {
      case "up":
        head.y -= this.gridSize;
        break;
      case "down":
        head.y += this.gridSize;
        break;
      case "left":
        head.x -= this.gridSize;
        break;
      case "right":
        head.x += this.gridSize;
        break;
    }

    // 检查碰撞
    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    // 检查是否吃到食物
    // 创建一个临时的碰撞检测对象
    const headBall = {
      x: head.x,
      y: head.y,
      size: this.gridSize,
    };

    if (this.food && this.food.checkCollision(headBall)) {
      this.collectedExperiences.push({
        title: this.food.title,
        content: this.food.content,
      });
      // 播放收集音效
      audio.collect.play();
      // 创建收集特效
      this.food.createCollectEffect();
      this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  checkCollision(head) {
    const margin = 2;

    // 检查边界碰撞
    if (
      head.x < margin ||
      head.x + this.gridSize > this.canvas.width - margin ||
      head.y < margin ||
      head.y + this.gridSize > this.canvas.height - margin
    ) {
      return true;
    }

    // 检查与障碍物的碰撞
    if (
      this.obstacles.some((obstacle) =>
        obstacle.checkCollision({ x: head.x, y: head.y, size: this.gridSize })
      )
    ) {
      return true;
    }

    // 检查自身碰撞
    return this.snake.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  }

  draw() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制背景
    this.ctx.fillStyle = this.bgPattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制障碍物
    this.obstacles.forEach((obstacle) => obstacle.draw(this.ctx));

    // 画蛇
    this.ctx.fillStyle = "#4CAF50";
    this.snake.forEach((segment) => {
      this.ctx.fillRect(
        segment.x,
        segment.y,
        this.gridSize - 2,
        this.gridSize - 2
      );
    });

    // 画食物
    if (this.food) {
      this.food.draw(this.ctx);
    }
  }

  gameOver() {
    this.isGameOver = true;
    // 停止游戏循环
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    // 停止背景音乐，播放游戏结束音效
    audio.background.pause();
    audio.gameOver.play();
    this.gameOverModal.show(this.collectedExperiences);
  }

  restart() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = "right";
    this.collectedExperiences = [];
    this.isGameOver = false;
    this.generateObstacles();
    this.generateFood();
    document.getElementById("gameOverModal").style.display = "none";
    // 重新播放背景音乐
    audio.background.currentTime = 0;
    audio.background.play();
    // 重新开始游戏循环
    this.start();
  }

  start() {
    // 如果已经有游戏循环在运行，先停止它
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }

    this.gameLoop = setInterval(() => {
      if (!this.isGameOver) {
        this.moveSnake();
        this.draw();
      }
    }, 100);
  }
}

// 导出重启和关闭详情的方法供 HTML 使用
window.restartGame = () => game.restart();
window.closeExperienceDetail = () => {
  document.getElementById("experienceDetailModal").style.display = "none";
};

// 添加查看收集的方法
window.viewExperiences = () => {
  window.location.href = "collection.html";
};

fetch("./data/experiences.json")
  .then((response) => response.json())
  .then((data) => {
    const experiences = data.experiences;
    // 创建游戏实例
    const game = new SnakeGame(experiences);
  });
