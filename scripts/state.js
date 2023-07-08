import { getEnemyDirection, isCollision, getEntityPosition } from "./helpers.js";
export const player = document.querySelector("[data-player]");

export const characterData = {
  devon: {
    damage: 2,
    movementSpeed: 4,
    shootingRate: 500,
    knockback: 40,
    health: 3,
  },
  dave: {
    damage: 1,
    movementSpeed: 3,
    shootingRate: 700,
    knockback: 60,
    health: 6,
  },
  ling: {
    damage: 3,
    movementSpeed: 6,
    shootingRate: 300,
    knockback: 30,
    health: 2,
  },
};
export const enemyData = {
  bunnio: {
    health: 1,
    movementSpeed: 10,
  },
  catio: {
    health: 2,
    movementSpeed: 7,
  },
  doggio: {
    health: 3,
    movementSpeed: 3,
  },
};
export const playerData = {
  xPos: window.innerWidth / 2,
  yPos: window.innerHeight / 2,
  enemiesKilled: 0,
  isShooting: false,
  selectedCharacter: characterData[player.getAttribute("character")],
  fireRate: null,
  resetPlayer: function () {
    this.selectedCharacter = characterData[player.getAttribute("character")];
    this.enemiesKilled = 0;
    this.xPos = window.innerWidth / 2;
    this.yPos = window.innerHeight / 2;
    this.isShooting = false;
    clearInterval(levelData.renderEngine);
    clearInterval(levelData.shootingEngine);
    clearInterval(levelData.enemyMovementInterval);
    clearInterval(levelData.enemySpawnInterval);
    levelData.renderEngine = null;
    levelData.shootingEngine = null;
    levelData.enemyMovementInterval = null;
    levelData.enemySpawnInterval = null;
    document
      .querySelector("[character-selection-screen]")
      .toggleAttribute("open");
    window.removeEventListener("keydown", levelData.handleKeyDown);
    window.removeEventListener("keyup", levelData.handleKeyUp);
    document
      .querySelector("[data-character-health]")
      .setAttribute(
        "data-character-health",
        playerData.selectedCharacter.health
      );
    document
      .querySelector("[data-character-kills]")
      .setAttribute("data-character-kills", 0);
    document
      .querySelector("[data-character-level]")
      .setAttribute("data-character-level", 1);
  },
  shoot: function () {
    if (this.isShooting) {
      const bullet = document.createElement("div");
      const direction = Object.keys(shootingKeys)
        .filter((key) => {
          return shootingKeys[key] === true;
        })[0]
        .replace("Arrow", "")
        .toLowerCase();
      bullet.toggleAttribute("data-tear");
      bullet.setAttribute(
        "style",
        `top: ${this.yPos}px; left: ${this.xPos}px;`
      );
      bullet.setAttribute("direction", direction);
      bullet.innerHTML = `
    <svg width="30%" viewbox="0 0 30 42">
      <path 
        fill="#000" 
        stroke="#000" 
        stroke-width="1.5"
        d="M15 3
             Q16.5 6.8 25 18
             A12.8 12.8 0 1 1 5 18
             Q13.5 6.8 15 3z" />
    </svg>
    `;
      player.setAttribute("facing", direction);
      player.parentNode.insertBefore(bullet, player.nextSibling);
      setTimeout(() => bullet.remove(), 1500);
    }
  },
  move: function () {
    if (movementKeys.w && this.yPos > levelData.screenPadding) {
      this.yPos -= this.selectedCharacter.movementSpeed; // Move up
      if (!this.isShooting) player.setAttribute("facing", "up");
    }
    if (movementKeys.a && this.xPos > levelData.screenPadding) {
      this.xPos -= this.selectedCharacter.movementSpeed; // Move left
      if (!this.isShooting) player.setAttribute("facing", "left");
    }
    if (
      movementKeys.s &&
      this.yPos < window.innerHeight - levelData.screenPadding
    ) {
      this.yPos += this.selectedCharacter.movementSpeed; // Move down
      if (!this.isShooting) player.setAttribute("facing", "down");
    }
    if (
      movementKeys.d &&
      this.xPos < window.innerWidth - levelData.screenPadding
    ) {
      this.xPos += this.selectedCharacter.movementSpeed; // Move right
      if (!this.isShooting) player.setAttribute("facing", "right");
    }
    this.updatePosition();
  },
  updatePosition: function () {
    player.style.left = this.xPos + "px";
    player.style.top = this.yPos + "px";
  },
};
let movementKeys = {
  w: false,
  a: false,
  s: false,
  d: false,
};
let shootingKeys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};
export const levelData = {
  level: 1,
  screenPadding: 50,
  spawnRate: 2000,
  renderEngine: null,
  shootingEngine: null,
  increaseDifficultyInterval: null,
  enemySpawnInterval: null,
  enemyMovementInterval: null,
  handleKeyDown: function (event) {
    event.preventDefault();
    const key = event.key;
    if (key in movementKeys) {
      movementKeys[key] = true;
      player.setAttribute("running", true);
    }
    if (key in shootingKeys) {
      playerData.isShooting = true;
      shootingKeys[key] = true;
    }
  },
  handleKeyUp: function (event) {
    event.preventDefault();
    const key = event.key;

    if (key in movementKeys) {
      movementKeys[key] = false;
      player.setAttribute("running", false);
    }
    if (key in shootingKeys) {
      playerData.isShooting = false;
      shootingKeys[key] = false;
    }
  },
  detectTearHittingEnemy: function () {
    const dataTearElements = document.querySelectorAll("[data-tear]");
    const dataEnemyElements = document.querySelectorAll("[data-enemy]");
    dataTearElements.forEach((tearElement) => {
      dataEnemyElements.forEach((enemyElement) => {
        if (isCollision(tearElement, enemyElement)) {
          const enemyHealth =
            parseInt(enemyElement.getAttribute("health")) -
            playerData.selectedCharacter.damage;
          const enemyDirection = getEnemyDirection(player, enemyElement);
          switch (enemyDirection.facing) {
            case "right":
              enemyElement.style.left = `${
                parseFloat(enemyElement.style.left.replace("px", "")) -
                playerData.selectedCharacter.knockback
              }px`;
              break;
            case "left":
              enemyElement.style.left = `${
                parseFloat(enemyElement.style.left.replace("px", "")) +
                playerData.selectedCharacter.knockback
              }px`;
              break;
            case "up":
              enemyElement.style.top = `${
                parseFloat(enemyElement.style.top.replace("px", "")) +
                playerData.selectedCharacter.knockback
              }px`;
              break;
            case "down":
              enemyElement.style.top = `${
                parseFloat(enemyElement.style.top.replace("px", "")) -
                playerData.selectedCharacter.knockback
              }px`;
              break;

            default:
              break;
          }
          if (enemyHealth <= 0) {
            playerData.enemiesKilled = playerData.enemiesKilled + 1;
            document
              .querySelector("[data-character-kills]")
              .setAttribute("data-character-kills", playerData.enemiesKilled);
            enemyElement.remove();
            tearElement.remove();
            return;
          }
          tearElement.remove();
          enemyElement.setAttribute("health", enemyHealth);
        }
      });
    });
  },
  detectEnemyTouchingPlayer: function () {
    const dataEnemyElements = document.querySelectorAll("[data-enemy]");
    dataEnemyElements.forEach((enemyElement) => {
      if (isCollision(player, enemyElement)) {
        playerData.selectedCharacter.health -= 1;
        document
          .querySelector("[data-character-health]")
          .setAttribute(
            "data-character-health",
            playerData.selectedCharacter.health
          );
        if (playerData.selectedCharacter.health <= 0) {
          dataEnemyElements.forEach((enemy) => enemy.remove());
          movementKeys = {
            w: false,
            a: false,
            s: false,
            d: false,
          };
          shootingKeys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
          };
          alert(`Well done! You killed ${playerData.enemiesKilled} enemies!`);
          playerData.resetPlayer();
        } else {
          enemyElement.remove();
        }
      }
    });
  },
  createEnemy: function () {
    const enemyList = Object.keys(enemyData);
    const selectedEnemy =
      enemyList[Math.floor(Math.random() * enemyList.length)];
    const enemy = document.createElement("div");
    const enemyPosY = Math.floor(Math.random() * window.innerHeight) + 1;
    const enemyPosX = Math.floor(Math.random() * window.innerWidth) + 1;
    const horizontalDistance =
      enemyPosX < playerData.xPos
        ? { facing: "left", distance: enemyPosX - playerData.xPos }
        : { facing: "right", distance: playerData.xPos - enemyPosX };
    const verticalDistance =
      enemyPosY < playerData.yPos
        ? { facing: "down", distance: enemyPosY - playerData.yPos }
        : { facing: "up", distance: playerData.yPos - enemyPosY };
    const facing =
      horizontalDistance.distance < verticalDistance.distance
        ? horizontalDistance.facing
        : verticalDistance.facing;
    enemy.setAttribute("data-enemy", true);
    enemy.setAttribute(
      "style",
      `top: ${
        verticalDistance.distance < 150 ? enemyPosY + 150 : enemyPosY
      }px; left: ${
        horizontalDistance.distance < 150 ? enemyPosX + 150 : enemyPosX
      }px`
    );
    enemy.setAttribute("enemy", selectedEnemy);
    enemy.setAttribute("health", enemyData[selectedEnemy].health);
    enemy.setAttribute("facing", facing);
    document.body.appendChild(enemy);
  },
  moveEnemiesTowardsPlayer: function () {
    const playerPosition = getEntityPosition(player);
    document.querySelectorAll("[data-enemy]").forEach((enemy) => {
      const enemyStats = enemyData[enemy.getAttribute("enemy")];
      const enemyPosition = getEntityPosition(enemy);
      const horizontalDistance =
        playerPosition.left > enemyPosition.left
          ? {
              facing: "right",
              distance: playerPosition.left - enemyPosition.left,
            }
          : {
              facing: "left",
              distance: enemyPosition.left - playerPosition.left,
            };
      const verticalDistance =
        playerPosition.top > enemyPosition.top
          ? { facing: "down", distance: playerPosition.top - enemyPosition.top }
          : { facing: "up", distance: enemyPosition.top - playerPosition.top };
      const facing =
        horizontalDistance.distance > verticalDistance.distance
          ? horizontalDistance.facing
          : verticalDistance.facing;
      enemy.setAttribute("facing", facing);
      const currentXPos = parseFloat(enemy.style.left.replace("px", ""));
      const currentYPos = parseFloat(enemy.style.top.replace("px", ""));
      enemy.setAttribute(
        "style",
        `top: ${
          playerPosition.top > currentYPos
            ? currentYPos + enemyStats.movementSpeed
            : currentYPos - enemyStats.movementSpeed
        }px; left: ${
          playerPosition.left > currentXPos
            ? currentXPos + enemyStats.movementSpeed
            : currentXPos - enemyStats.movementSpeed
        }px`
      );
    });
  },
  increaseDifficulty: function () {
    this.spawnRate -= 300;
    this.level += 1;
    document
      .querySelector("[data-character-level]")
      .setAttribute("data-character-level", this.level);
    this.enemySpawnInterval = setInterval(this.createEnemy, this.spawnRate);
    if (this.spawnRate <= 500) {
      clearInterval(this.increaseDifficultyInterval);
      this.increaseDifficultyInterval = null;
    }
  },
  initializeLevel: function () {
    playerData.selectedCharacter = characterData[player.getAttribute("character")];
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.shootingEngine = setInterval(
      () => playerData.shoot(),
      playerData.selectedCharacter.shootingRate
    );
    this.increaseDifficultyInterval = setInterval(
      () => this.increaseDifficulty(),
      10000
    );
    this.enemySpawnInterval = setInterval(
      () => this.createEnemy(),
      this.spawnRate
    );
    this.enemyMovementInterval = setInterval(
      () => this.moveEnemiesTowardsPlayer(),
      100
    );
    this.renderEngine = setInterval(() => {
      playerData.move();
      this.detectTearHittingEnemy();
      this.detectEnemyTouchingPlayer();
    }, 10);
  },
};
export const consumableData = {
  healthPotion: () => (playerData.selectedCharacter.health += 1),
  bigHealthPotion: () => (playerData.selectedCharacter.health += 3),
  coffee: () => (playerData.selectedCharacter.movementSpeed += 2),
  onion: () => {
    clearInterval(playerData.fireRate);
    playerData.selectedCharacter.shootingRate -= 50;
    playerData.fireRate = setInterval(
      shootBasedOnKeys,
      this.selectedCharacter.shootingRate
    );
  },
};
