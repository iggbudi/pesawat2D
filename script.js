const gameArea = document.getElementById('gameArea');
const playerEl = document.getElementById('player');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const messageEl = document.getElementById('message');
const powerUpStatusEl = document.getElementById('powerUpStatus');
const shootAudio = document.getElementById('shootSound');
const explosionAudio = document.getElementById('explosionSound');
const bgmAudio = document.getElementById('bgm');

const gameWidth = 480;
const gameHeight = 640;
const baseBulletSpeed = 8;
const baseEnemySpeed = 2.2;
const baseEnemySpawnInterval = 1200;
const playerWidth = 60;
const enemySize = 56;

// Enemy type definitions
const ENEMY_TYPES = {
    BASIC: {
        name: 'basic',
        health: 1,
        speedMult: 1,
        score: 10,
        size: 56,
        className: 'enemy'
    },
    FAST: {
        name: 'fast',
        health: 1,
        speedMult: 1.8,
        score: 15,
        size: 56,
        className: 'enemy enemy-fast'
    },
    TANK: {
        name: 'tank',
        health: 3,
        speedMult: 0.6,
        score: 30,
        size: 64,
        className: 'enemy enemy-tank'
    },
    BOSS: {
        name: 'boss',
        health: 5,
        speedMult: 0.4,
        score: 50,
        size: 80,
        className: 'enemy enemy-boss'
    }
};

// Power-up type definitions
const POWERUP_TYPES = {
    RAPIDFIRE: {
        name: 'rapidfire',
        duration: 8000,
        icon: '⚡',
        label: 'Rapid Fire',
        className: 'powerup powerup-rapidfire'
    },
    SHIELD: {
        name: 'shield',
        duration: 10000,
        icon: '🛡',
        label: 'Shield',
        className: 'powerup powerup-shield'
    },
    MULTISHOT: {
        name: 'multishot',
        duration: 12000,
        icon: '⚔',
        label: 'Multi Shot',
        className: 'powerup powerup-multishot'
    },
    SLOWMO: {
        name: 'slowmo',
        duration: 8000,
        icon: '⏱',
        label: 'Slow Motion',
        className: 'powerup powerup-slowmo'
    }
};

const state = {
    spacePressed: false,
    playerX: gameWidth / 2 - playerWidth / 2,
    bullets: [],
    enemies: [],
    powerups: [],
    activePowerups: {},
    lastSpawn: 0,
    lastPowerupSpawn: 0,
    lastShot: 0,
    score: 0,
    level: 1,
    lives: 3,
    running: false,
    paused: false,
};

function resetGame() {
    state.playerX = gameWidth / 2 - playerWidth / 2;
    state.bullets.forEach(b => gameArea.removeChild(b.el));
    state.enemies.forEach(e => gameArea.removeChild(e.el));
    state.powerups.forEach(p => gameArea.removeChild(p.el));
    state.bullets = [];
    state.enemies = [];
    state.powerups = [];
    state.activePowerups = {};
    state.score = 0;
    state.level = 1;
    state.lives = 3;
    state.lastSpawn = 0;
    state.lastPowerupSpawn = 0;
    state.lastShot = 0;
    state.paused = false;
    scoreEl.textContent = '0';
    levelEl.textContent = '1';
    livesEl.textContent = '3';
    powerUpStatusEl.innerHTML = '';
    messageEl.textContent = 'Tekan Spasi untuk mulai';
    messageEl.classList.remove('hidden');
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (pauseOverlay) pauseOverlay.classList.add('hidden');
    if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }
}

function togglePause() {
    if (!state.running) return;

    state.paused = !state.paused;
    const pauseOverlay = document.getElementById('pauseOverlay');

    if (state.paused) {
        if (pauseOverlay) pauseOverlay.classList.remove('hidden');
        if (bgmAudio) bgmAudio.pause();
    } else {
        if (pauseOverlay) pauseOverlay.classList.add('hidden');
        if (bgmAudio) bgmAudio.play();
        state.lastSpawn = performance.now();
        state.lastPowerupSpawn = performance.now();
    }
}

// Calculate difficulty modifiers based on level
function getDifficulty() {
    const level = state.level;
    return {
        enemySpeedMult: 1 + (level - 1) * 0.15,
        spawnInterval: Math.max(400, baseEnemySpawnInterval - (level - 1) * 100),
        powerupSpawnInterval: Math.max(8000, 15000 - (level - 1) * 500)
    };
}

// Check and update level based on score
function updateLevel() {
    const newLevel = Math.floor(state.score / 100) + 1;
    if (newLevel > state.level) {
        state.level = newLevel;
        levelEl.textContent = state.level;
        showLevelUpMessage();
    }
}

function showLevelUpMessage() {
    const msg = document.createElement('div');
    msg.className = 'message';
    msg.textContent = `LEVEL ${state.level}!`;
    msg.style.fontSize = '2rem';
    msg.style.color = '#f8d047';
    gameArea.appendChild(msg);
    setTimeout(() => {
        if (msg.parentNode) gameArea.removeChild(msg);
    }, 2000);
}

// Select enemy type based on level
function selectEnemyType() {
    const level = state.level;
    const rand = Math.random();

    if (level >= 5 && rand < 0.05) {
        return ENEMY_TYPES.BOSS;
    } else if (level >= 3 && rand < 0.25) {
        return ENEMY_TYPES.TANK;
    } else if (level >= 2 && rand < 0.35) {
        return ENEMY_TYPES.FAST;
    }
    return ENEMY_TYPES.BASIC;
}

function spawnEnemy() {
    const difficulty = getDifficulty();
    const type = selectEnemyType();
    const enemyEl = document.createElement('div');
    enemyEl.className = type.className;
    const x = Math.random() * (gameWidth - type.size);
    const y = -type.size;
    enemyEl.style.transform = `translate(${x}px, ${y}px)`;
    gameArea.appendChild(enemyEl);

    state.enemies.push({
        el: enemyEl,
        x,
        y,
        type: type,
        health: type.health,
        maxHealth: type.health,
        speed: baseEnemySpeed * type.speedMult * difficulty.enemySpeedMult
    });
}

function selectPowerupType() {
    const types = Object.values(POWERUP_TYPES);
    return types[Math.floor(Math.random() * types.length)];
}

function spawnPowerup() {
    const type = selectPowerupType();
    const powerupEl = document.createElement('div');
    powerupEl.className = type.className;
    powerupEl.textContent = type.icon;
    const x = Math.random() * (gameWidth - 32);
    const y = -32;
    powerupEl.style.transform = `translate(${x}px, ${y}px)`;
    gameArea.appendChild(powerupEl);

    state.powerups.push({
        el: powerupEl,
        x,
        y,
        type: type,
        speed: 1.5
    });
}

function shootBullet() {
    const now = performance.now();
    const shootDelay = state.activePowerups.rapidfire ? 100 : 300;

    if (now - state.lastShot < shootDelay) return;
    state.lastShot = now;

    if (shootAudio) {
        shootAudio.currentTime = 0;
        shootAudio.play();
    }

    if (state.activePowerups.multishot) {
        // Shoot 3 bullets
        createBullet(state.playerX + playerWidth / 2 - 3, gameHeight - 60);
        createBullet(state.playerX + playerWidth / 2 - 15, gameHeight - 60);
        createBullet(state.playerX + playerWidth / 2 + 9, gameHeight - 60);
    } else {
        // Single bullet
        createBullet(state.playerX + playerWidth / 2 - 3, gameHeight - 60);
    }
}

function createBullet(x, y) {
    const bulletEl = document.createElement('div');
    bulletEl.className = 'bullet';
    bulletEl.style.transform = `translate(${x}px, ${y}px)`;
    gameArea.appendChild(bulletEl);
    state.bullets.push({ el: bulletEl, x, y });
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
        bullet.y -= baseBulletSpeed;
        if (bullet.y < -20) {
            gameArea.removeChild(bullet.el);
            return false;
        }
        bullet.el.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;
        return true;
    });
}

function updateEnemies() {
    const difficulty = getDifficulty();
    const slowMult = state.activePowerups.slowmo ? 0.4 : 1.0;

    state.enemies = state.enemies.filter(enemy => {
        enemy.y += enemy.speed * slowMult;
        if (enemy.y > gameHeight) {
            gameArea.removeChild(enemy.el);
            if (!state.activePowerups.shield) {
                state.lives -= 1;
                livesEl.textContent = state.lives;
                if (state.lives <= 0) endGame('Game Over - tekan Spasi untuk main lagi');
            }
            return false;
        }
        enemy.el.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
        return true;
    });

    if (performance.now() - state.lastSpawn > difficulty.spawnInterval) {
        spawnEnemy();
        state.lastSpawn = performance.now();
    }
}

function updatePowerups() {
    const difficulty = getDifficulty();

    state.powerups = state.powerups.filter(powerup => {
        powerup.y += powerup.speed;
        if (powerup.y > gameHeight) {
            gameArea.removeChild(powerup.el);
            return false;
        }
        powerup.el.style.transform = `translate(${powerup.x}px, ${powerup.y}px)`;
        return true;
    });

    if (performance.now() - state.lastPowerupSpawn > difficulty.powerupSpawnInterval) {
        spawnPowerup();
        state.lastPowerupSpawn = performance.now();
    }
}

function checkCollisions() {
    // Bullet-Enemy collisions
    state.bullets = state.bullets.filter(bullet => {
        const bRect = { x: bullet.x, y: bullet.y, w: 6, h: 16 };
        let hit = false;

        state.enemies = state.enemies.filter(enemy => {
            if (hit) return true;
            const eRect = { x: enemy.x, y: enemy.y, w: enemy.type.size, h: enemy.type.size };
            const overlap =
                bRect.x < eRect.x + eRect.w &&
                bRect.x + bRect.w > eRect.x &&
                bRect.y < eRect.y + eRect.h &&
                bRect.y + bRect.h > eRect.y;
            if (overlap) {
                hit = true;
                enemy.health -= 1;

                if (enemy.health <= 0) {
                    gameArea.removeChild(enemy.el);
                    state.score += enemy.type.score;
                    scoreEl.textContent = state.score;
                    updateLevel();
                    if (explosionAudio) {
                        explosionAudio.currentTime = 0;
                        explosionAudio.play();
                    }
                    return false;
                } else {
                    // Show damage indicator
                    const alpha = enemy.health / enemy.maxHealth;
                    enemy.el.style.opacity = 0.3 + (alpha * 0.7);
                }
                return true;
            }
            return true;
        });

        if (hit) {
            gameArea.removeChild(bullet.el);
            return false;
        }
        return true;
    });

    // Player-Powerup collisions
    const pRect = { x: state.playerX, y: gameHeight - 80, w: playerWidth, h: 60 };
    state.powerups = state.powerups.filter(powerup => {
        const puRect = { x: powerup.x, y: powerup.y, w: 32, h: 32 };
        const overlap =
            pRect.x < puRect.x + puRect.w &&
            pRect.x + pRect.w > puRect.x &&
            pRect.y < puRect.y + puRect.h &&
            pRect.y + pRect.h > puRect.y;

        if (overlap) {
            activatePowerup(powerup.type);
            gameArea.removeChild(powerup.el);
            return false;
        }
        return true;
    });
}

function activatePowerup(type) {
    // Clear existing timer if same powerup is picked up
    if (state.activePowerups[type.name]) {
        clearTimeout(state.activePowerups[type.name].timer);
    }

    const timer = setTimeout(() => {
        delete state.activePowerups[type.name];
        updatePowerupDisplay();
    }, type.duration);

    state.activePowerups[type.name] = {
        type: type,
        timer: timer,
        endTime: performance.now() + type.duration
    };

    updatePowerupDisplay();
}

function updatePowerupDisplay() {
    powerUpStatusEl.innerHTML = '';

    Object.values(state.activePowerups).forEach(powerup => {
        const timeLeft = Math.ceil((powerup.endTime - performance.now()) / 1000);
        const el = document.createElement('div');
        el.className = 'power-up-active';
        el.innerHTML = `${powerup.type.icon} ${powerup.type.label} (${timeLeft}s)`;
        powerUpStatusEl.appendChild(el);
    });
}

function endGame(text) {
    state.running = false;
    messageEl.textContent = text;
    messageEl.classList.remove('hidden');
    if (bgmAudio) bgmAudio.pause();

    // Clear all powerup timers
    Object.values(state.activePowerups).forEach(powerup => {
        clearTimeout(powerup.timer);
    });
    state.activePowerups = {};
    powerUpStatusEl.innerHTML = '';
}

function startGameLoop() {
    state.running = true;
    messageEl.classList.add('hidden');
    if (bgmAudio) {
        bgmAudio.currentTime = 0;
        bgmAudio.play();
    }

    let lastTime = performance.now();
    let lastPowerupUpdate = performance.now();

    function loop(time) {
        if (!state.running) return;

        if (!state.paused) {
            lastTime = time;
            updatePlayer();
            updateBullets();
            updateEnemies();
            updatePowerups();
            checkCollisions();

            // Update powerup display every 100ms
            if (time - lastPowerupUpdate > 100) {
                updatePowerupDisplay();
                lastPowerupUpdate = time;
            }
        }

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
        } else if (!state.paused) {
            if (!state.spacePressed) {
                state.spacePressed = true;
            }
            shootBullet();
        }
    }

    if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        togglePause();
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
