// Create the canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 600;
document.body.appendChild(canvas);

// Game variables
let invaders = [];
let defender;
let missiles = [];
let bombs = [];
let score = 0;
let gameOver = false;
let gameWon = false;
let invaderCount = 0;
// Load images
const invaderImg = new Image();
invaderImg.src = 'invader.png';
const defenderImg = new Image();
defenderImg.src = 'defender.png';
const missileImg = new Image();
missileImg.src = 'missile.png';
const bombImg = new Image();
bombImg.src = 'bomb.png';

// Create the defender
defender = {
	x: canvas.width / 2 - 25,
	y: canvas.height - 50,
	width: 50,
	height: 50,
	image: defenderImg,
	dx: 0,
	missiles: []
};

// Create an invader
function createInvader(column) {
	if (invaderCount++ < 20) {
		const invader = {
			x: column, // Calculate the x position based on the number of existing invaders
			y: 0,
			width: 50,
			height: 50,
			image: invaderImg,
			dx: 2,
			bombs: []
		};
		invaders.push(invader);
	}
}

// Move the invaders
function moveInvaders() {
	invaders.forEach(invader => {
		if (invader.x + invader.width >= canvas.width || invader.x <= 0) {
			invader.y += 100;
			invader.dx *= -1;
			invader.x += invader.dx; // Update the x position after moving down
		} else {
			invader.x += invader.dx;
		}
	});
}

// Drop bombs from invaders
function dropBombs() {
	invaders.forEach(invader => {
		if (Math.random() < 0.01 && invader.bombs.length < 2) {
			const bomb = {
				x: invader.x + invader.width / 2,
				y: invader.y + invader.height,
				width: 10,
				height: 10,
				image: bombImg,
				dy: 2
			};
			invader.bombs.push(bomb);
		}
	});
}

// Update game state
function update() {
	if (!gameOver && !gameWon) {
		moveInvaders();
		dropBombs();
		// Update defender position
		defender.x += defender.dx;
		// Update missiles position
		defender.missiles.forEach(missile => {
			missile.y -= 5;
			// Check collision with invaders
			invaders.forEach(invader => {
				if (
					missile.x < invader.x + invader.width &&
					missile.x + missile.width > invader.x &&
					missile.y < invader.y + invader.height &&
					missile.y + missile.height > invader.y
				) {
					// Missile hit an invader
					score++;
					invader.bombs = [];
					invaders = invaders.filter(i => i !== invader);
					if (invaders.length === 0) {
						gameWon = true;
					}
				}
			});
		});
		// Update bombs position
		invaders.forEach(invader => {
			invader.bombs.forEach(bomb => {
				bomb.y += bomb.dy;
				// Check collision with defender
				if (
					bomb.x < defender.x + defender.width &&
					bomb.x + bomb.width > defender.x &&
					bomb.y < defender.y + defender.height &&
					bomb.y + bomb.height > defender.y
				) {
					// Bomb hit the defender
					gameOver = true;
				}
			});
		});
		// Remove off-screen missiles and bombs
		defender.missiles = defender.missiles.filter(missile => missile.y > 0);
		invaders.forEach(invader => {
			invader.bombs = invader.bombs.filter(bomb => bomb.y < canvas.height);
		});
	}
}

// Draw game objects
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Draw invaders
	invaders.forEach(invader => {
		ctx.drawImage(invader.image, invader.x, invader.y, invader.width, invader.height);
	});
	// Draw defender
	ctx.drawImage(defender.image, defender.x, defender.y, defender.width, defender.height);
	// Draw missiles
	defender.missiles.forEach(missile => {
		ctx.drawImage(missile.image, missile.x, missile.y, missile.width, missile.height);
	});
	// Draw bombs
	invaders.forEach(invader => {
		invader.bombs.forEach(bomb => {
			ctx.drawImage(bomb.image, bomb.x, bomb.y, bomb.width, bomb.height);
		});
	});
	// Draw score
	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText(`Score: ${score}`, 10, 30);
	// Draw game over or game won message
	if (gameOver) {
		ctx.fillStyle = 'red';
		ctx.font = '40px Arial';
		ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
	} else if (gameWon) {
		ctx.fillStyle = 'green';
		ctx.font = '40px Arial';
		ctx.fillText('You Win!', canvas.width / 2 - 80, canvas.height / 2);
	}
}

// Handle keyboard events
document.addEventListener('keydown', event => {
	if (event.key === 'ArrowRight') {
		defender.dx = 10;
	} else if (event.key === 'ArrowLeft') {
		defender.dx = -10;
	} else if (event.key === ' ') {
		if (defender.missiles.length < 2) {
			const missile = {
				x: defender.x + defender.width / 2,
				y: defender.y,
				width: 10,
				height: 20,
				image: missileImg
			};
			defender.missiles.push(missile);
		}
	}
});

document.addEventListener('keyup', event => {
	if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
		defender.dx = 0;
	}
});

// Game loop
function gameLoop() {
	update();
	draw();
	if (!gameOver && !gameWon) {
		requestAnimationFrame(gameLoop);
		let topLineClear = true;
		for (let i = 0; i < invaders.length; i++) {
			if (invaders[i].y === 0) {
				topLineClear = false;
				break;
			}
		}
		if (topLineClear) {
			createFiveInvaders(); // Call createFiveInvaders function to create 5 invaders
		}
	}
}

function createFiveInvaders() {
	for (let i = 0; i < 5; i++) {
		createInvader(i*60+5);
	}
}

// Start the game
createFiveInvaders();
gameLoop();