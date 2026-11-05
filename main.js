function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// 1. Setup Canvas and Context
const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');

// 2. Define Player Variables
const player = {
    x: 50,
    y: 50,
    size: 30,
    color: '#000000',
    speed: 5,
    cooldown: 10
};

const enemy = {
    x: 650,
    y: 50,
    size: 20,
    color: '#cc0000',
    speed: 5
};

const bullet = {
    x: 50,
    y: 50,
    size: 0,
    color: '#aa0000',
    speed: 10,
    shot: false
};

const bullet2 = {
    x: 50,
    y: 50,
    size: 0,
    color: '#aa0000',
    speed: 10,
    shot: false
};

const startButton = {
    x: 300,
    y: 250,
    width: 150,
    height: 50,
    color: "#000000"
}

var yv = 0;
var jump = 0;
var screen = 0;
var cooldown = 0;
var score = 0;
var flash = 0;

// 3. Track Keyboard Input
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 4. Update Game State (Logic)
function update() {
    if (screen == 1) {
        if ((keys['ArrowUp'] || keys['w']) && jump == 0) { 
            yv = 12; 
            jump = 10;
        }
        if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

        if (keys[' ']) {
            if (bullet2.shot) {
                bullet.x = player.x;
                bullet.y = player.y;
                bullet.size = 10;   
                bullet.shot = true;
            } else if (bullet.shot) {
                bullet2.x = player.x;
                bullet2.y = player.y;
                bullet2.size = 10;   
                bullet2.shot = true;
            } else {
                bullet.x = player.x;
                bullet.y = player.y;
                bullet.size = 10;   
                bullet.shot = true;
            }
            
            cooldown = player.cooldown;
            
        }
        
        // Prevent player from leaving canvas boundaries
        if (player.x < 0) player.x = 0;
        if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
        if (player.y < 0) player.y = 0;
        if (player.y + player.size > canvas.height) {
            screen = 0;
            yv = 0;
            jumps = 0;
            player.x = 50;
            player.y = 50;
            enemy.x = 50;
            enemy.y = 50;
            score = 0;
        }

        if (bullet.x > canvas.width || bullet.x < 0) bullet.shot = false;
        if (bullet2.x > canvas.width || bullet2.x < 0) bullet2.shot = false;


        /* 
        Collision For...
        Enemy/Player
        Enemy/Bullet
        */

        if (
            bullet.x + bullet.size >= enemy.x &&
            bullet.x <= enemy.x + (enemy.size + 10) &&
            bullet.y + bullet.size >= enemy.y &&
            bullet.y <= enemy.y + (enemy.size + 10)
        ) {
            enemy.x = canvas.width;
            enemy.y = rand(40, canvas.height - 40);
            score++;
        }

        if (
            player.x + player.size >= enemy.x &&
            player.x <= enemy.x + enemy.size &&
            player.y + player.size >= enemy.y &&
            player.y <= enemy.y + enemy.size
        ) {
            enemy.x = canvas.width;
            enemy.y = rand(40, canvas.height - 40);

            player.x = 50;
            player.y = 50;

            if (score > 0) {
                score--;
            }
        }


        //**********************************************************************************************************8
        

        if (enemy.x < -20) { 
            enemy.x = canvas.width;
            enemy.y = rand(40, canvas.height - 40);
        }
        
        player.y -= yv;
        yv--;
        enemy.x -= enemy.speed;
        
        if (jump > 0) {
            jump -= 1;
        }

        if (cooldown > 0) {
            cooldown -= 1;
        }

        if (bullet.shot) {
            bullet.x += bullet.speed;
        }

        if (bullet2.shot) {
            bullet2.x += bullet2.speed;
        }
        
    } else {
        if (keys[' ']) screen = 1;
        score=0;

        flash++;
        
        if (flash == 30) {
            flash = 0;
        }
    }
}

// 5. Draw Everything on Screen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (screen == 1) {
        // Draw Player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.size, player.size);

        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
        
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);

        ctx.fillStyle = bullet2.color;
        ctx.fillRect(bullet2.x, bullet2.y, bullet2.size, bullet2.size);

        ctx.font = 'bold 26px Courier';
        ctx.fillStyle = "#000000";
        ctx.fillText(score, 300, 20);
        
    } else {
        
        if (flash <= 15) {
            ctx.font = 'bold 26px Courier';
            ctx.fillStyle = "#000000";
            ctx.fillText("flap_", 100, 100);
        } else {
            ctx.font = 'bold 26px Courier';
            ctx.fillStyle = "#000000";
            ctx.fillText("flap ", 100, 100);
        }

        ctx.font = 'bold 18px Courier';
        ctx.fillStyle = "#555555";
        ctx.fillText("press SPACE to start.", 100, 150);
    }
}

// 6. The Core Game Loop
function gameLoop() {
    update();
    draw();
    // Tells the browser to run gameLoop again right before the next repaint (approx. 60 FPS)
    requestAnimationFrame(gameLoop);
}

// Start the game!
gameLoop();
