const gameArea = document.getElementById('gameArea');
const playerEl = document.getElementById('player');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const messageEl = document.getElementById('message');
const shootAudio = document.getElementById('shootSound');
const explosionAudio = document.getElementById('explosionSound');
const bgmAudio = document.getElementById('bgm');

const gameWidth = 480;
const gameHeight = 640;
const bulletSpeed = 8;
const enemySpeed = 2.2;
const enemySpawnInterval = 1200;
const playerWidth = 60;
const enemySize = 56;

const state = {
    spacePressed: false,
    playerX: gameWidth / 2 - playerWidth / 2,
    bullets: [],
    enemies: [],
    lastSpawn: 0,
    score: 0,
    lives: 3,
    running: false,
};

function resetGame() {
    state.playerX = gameWidth / 2 - playerWidth / 2;
    state.bullets.forEach(b => gameArea.removeChild(b.el));
    state.enemies.forEach(e => gameArea.removeChild(e.el));
    state.bullets = [];
    state.enemies = [];
    state.score = 0;
    state.lives = 3;
    state.lastSpawn = 0;
    scoreEl.textContent = '0';
    livesEl.textContent = '3';
    messageEl.textContent = 'Tekan Spasi untuk mulai';
    messageEl.classList.remove('hidden');
    if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }
}

function spawnEnemy() {
    const enemyEl = document.createElement('div');
    enemyEl.className = 'enemy';
    const x = Math.random() * (gameWidth - enemySize);
    const y = -enemySize;
    enemyEl.style.transform = `translate(${x}px, ${y}px)`;
    gameArea.appendChild(enemyEl);
    state.enemies.push({ el: enemyEl, x, y });
}

function shootBullet() {
    if (shootAudio) {
        shootAudio.currentTime = 0;
        shootAudio.play();
    }
    const bulletEl = document.createElement('div');
    bulletEl.className = 'bullet';
    const bulletX = state.playerX + playerWidth / 2 - 3;
    const bulletY = gameHeight - 60;
    bulletEl.style.transform = `translate(${bulletX}px, ${bulletY}px)`;
    gameArea.appendChild(bulletEl);
    state.bullets.push({ el: bulletEl, x: bulletX, y: bulletY });
}

function updatePlayer() {
    playerEl.style.transform = `translateX(${state.playerX}px)`;
}

function setPlayerXFromMouse(clientX) {
    const rect = gameArea.getBoundingClientRect();
    const within = Math.min(Math.max(clientX - rect.left - playerWidth / 2, 0), gameWidth - playerWidth);
    state.playerX = within;
}

function updateBullets() {
    state.bullets = state.bullets.filter(bullet => {
        bullet.y -= bulletSpeed;
        if (bullet.y < -20) {
            gameArea.removeChild(bullet.el);
            return false;
        }
        bullet.el.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;
        return true;
    });
}

function updateEnemies() {
    state.enemies = state.enemies.filter(enemy => {
        enemy.y += enemySpeed;
        if (enemy.y > gameHeight) {
            gameArea.removeChild(enemy.el);
            state.lives -= 1;
            livesEl.textContent = state.lives;
            if (state.lives <= 0) endGame('Game Over - tekan Spasi untuk main lagi');
            return false;
        }
        enemy.el.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
        return true;
    });

    if (performance.now() - state.lastSpawn > enemySpawnInterval) {
        spawnEnemy();
        state.lastSpawn = performance.now();
    }
}

function checkCollisions() {
    state.bullets = state.bullets.filter(bullet => {
        const bRect = { x: bullet.x, y: bullet.y, w: 6, h: 16 };
        let hit = false;

        state.enemies = state.enemies.filter(enemy => {
            if (hit) return true;
            const eRect = { x: enemy.x, y: enemy.y, w: enemySize, h: enemySize };
            const overlap =
                bRect.x < eRect.x + eRect.w &&
                bRect.x + bRect.w > eRect.x &&
                bRect.y < eRect.y + eRect.h &&
                bRect.y + bRect.h > eRect.y;
            if (overlap) {
                hit = true;
                gameArea.removeChild(enemy.el);
                state.score += 10;
                scoreEl.textContent = state.score;
                if (explosionAudio) {
                    explosionAudio.currentTime = 0;
                    explosionAudio.play();
                }
                return false;
            }
            return true;
        });

        if (hit) {
            gameArea.removeChild(bullet.el);
            return false;
        }
        return true;
    });
}

function endGame(text) {
    state.running = false;
    messageEl.textContent = text;
    messageEl.classList.remove('hidden');
    if (bgmAudio) bgmAudio.pause();
}

function startGameLoop() {
    state.running = true;
    messageEl.classList.add('hidden');
    if (bgmAudio) {
        bgmAudio.currentTime = 0;
        bgmAudio.play();
    }

    let lastTime = performance.now();
    function loop(time) {
        if (!state.running) return;
        lastTime = time;
        updatePlayer();
        updateBullets();
        updateEnemies();
        checkCollisions();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

function handleKeyDown(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!state.running) {
            resetGame();
            startGameLoop();
        }
        if (!state.spacePressed) {
            shootBullet();
            state.spacePressed = true;
        }
    }
}

function handleKeyUp(e) {
    if (e.code === 'Space') state.spacePressed = false;
}

function handleMouseMove(e) {
    setPlayerXFromMouse(e.clientX);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('mousemove', handleMouseMove);

resetGame();
