export const getEntityPosition = (el) => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

export const getEnemyDirection = (playerEl, enemyEl) => {
  const playerPosition = getEntityPosition(playerEl);
  const enemyPosition = getEntityPosition(enemyEl);
  const horizontalDistance =
    playerPosition.left > enemyPosition.left
      ? { facing: "right", distance: playerPosition.left - enemyPosition.left }
      : { facing: "left", distance: enemyPosition.left - playerPosition.left };
  const verticalDistance =
    playerPosition.top > enemyPosition.top
      ? { facing: "down", distance: playerPosition.top - enemyPosition.top }
      : { facing: "up", distance: enemyPosition.top - playerPosition.top };
  const facing =
    horizontalDistance.distance > verticalDistance.distance
      ? horizontalDistance.facing
      : verticalDistance.facing;
  const distance =
    horizontalDistance.distance > verticalDistance.distance
      ? horizontalDistance.distance
      : verticalDistance.distance;
  return {
    facing,
    distance,
  };
};

export const isCollision = (el1, el2) => {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
};
