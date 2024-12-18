const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('current-score');
const messageDisplay = document.getElementById('message-container');
const startButton = document.getElementById('start-button');
const playerNameInput = document.getElementById('player-name');
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardList = document.getElementById('leaderboard');
const restartButton = document.getElementById('restart-button');
const touchControls = document.getElementById('touch-controls');
const container = document.querySelector('.container');
const gameContainer = document.getElementById('game-container');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let gameInterval;
let playerName = '';
let leaderboard = [];

// 初始化遊戲
function init() {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('請輸入你的名字!');
        return;
    }
    startButton.classList.add('hidden');
    playerNameInput.classList.add('hidden');

    gameInterval = setInterval(gameLoop, 100);
    generateFood();
    document.addEventListener('keydown', handleKeyDown);

    if (window.innerWidth <= 768) {
        touchControls.classList.remove('hidden');
    }

    touchControls.addEventListener('click', (e) => {
        const dir = e.target.dataset.direction;
        if (dir) {
            changeDirection(dir);
        }
    });
    container.classList.remove('hidden');
    gameContainer.classList.remove('hidden');
}

// 產生食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

// 遊戲主循環
function gameLoop() {
    update();
    draw();
}

// 更新遊戲狀態
function update() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // 檢查是否撞到牆壁或自身
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || checkCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // 吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
        showMessage('張清翔 有夠帥！！');
    } else {
        snake.pop();
    }
}

// 檢查是否與自身碰撞
function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// 繪製遊戲畫面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製蛇
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // 繪製食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// 處理鍵盤輸入
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            changeDirection('up');
            break;
        case 'ArrowDown':
            changeDirection('down');
            break;
        case 'ArrowLeft':
            changeDirection('left');
            break;
        case 'ArrowRight':
            changeDirection('right');
            break;
    }
}

// 改變蛇的移動方向
function changeDirection(newDirection) {
    if (
        (direction === 'up' && newDirection === 'down') ||
        (direction === 'down' && newDirection === 'up') ||
        (direction === 'left' && newDirection === 'right') ||
        (direction === 'right' && newDirection === 'left')
    ) {
        return; // 防止反方向移動
    }
    direction = newDirection;
}

// 顯示訊息
function showMessage(msg) {
    messageDisplay.textContent = msg;
    messageDisplay.classList.remove('hidden');
    setTimeout(() => {
        messageDisplay.classList.add('hidden');
    }, 1000);
}


// 遊戲結束
function gameOver() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', handleKeyDown);
    touchControls.classList.add('hidden');

    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    updateLeaderboard();
    leaderboardContainer.classList.remove('hidden');
    restartButton.classList.remove('hidden');
}

// 更新排行榜
function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}


// 重新開始遊戲
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = score;
    leaderboardContainer.classList.add('hidden');
    restartButton.classList.add('hidden');
    init();
}

startButton.addEventListener('click', init);
restartButton.addEventListener('click', restartGame);