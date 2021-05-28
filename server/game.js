const { GRID_SIZE } = require('./constants')

function createGameState () {
  return {
    player: {
      pos: {
        x: 1,
        y: 1
      },
      vel: {
        x: 0,
        y: 1
      },
      snake: [
        { x: 1, y: 1 }
      ]
    },
    food: {
      x: 7,
      y: 10
    },
    gridSize: GRID_SIZE
  }
}

function gameLoop (state) {
  // defensive guard
  if (!state) {
    return
  }

  const playerOne = state.player
  // is the snake moving?
  if (playerOne.vel.x || playerOne.vel.y) {
    // move the head of the snake in line with the velocity of the snake
    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    // has the snake bumped into itself?
    for (const cell of playerOne.snake) {
      if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
        return 2 // player 1 loses, player 2 wins the game
      }
    }
  }

  // has the snake hit a wall?
  if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
    return 2 // player 1 loses, player 2 wins the game
  }

  // has player eaten food?
  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    playerOne.snake.push({ ...playerOne.pos }) // add one new cell (the new position cell) to the body object to snake array
    // increment the position of the snake head (grow by one)
    // playerOne.pos.x += playerOne.vel.x
    // playerOne.pos.y += playerOne.vel.y
    // place new food
    randomFood(state)
  } else {
    // move snake body forward
    playerOne.snake.push({ ...playerOne.pos })
    playerOne.snake.shift()
  }

  return false // no winner
}

function randomFood (state) {
  const food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  }

  for (const cell of state.player.snake) {
    if (cell.x === food.x && cell.y === food.y) {
      randomFood() // recursively call randomFood until the food is not on the snake
    }
  }
  state.food = food
}

function getUpdatedVelocity (keyCode) {
  const left = { x: -1, y: 0 }
  const right = { x: 1, y: 0 }
  const downward = { x: 0, y: 1 }
  const upward = { x: 0, y: -1 }
  console.log(keyCode)
  switch (keyCode) {
    case 37:
      return {
        vel: left,
        opposingVel: right
      }

    case 38:
      return {
        vel: upward,
        opposingVel: downward
      }

    case 39:
      return {
        vel: right,
        opposingVel: left
      }

    case 40:
      return {
        vel: downward,
        opposingVel: upward
      }
    default:
      return null
  }
}

module.exports = {
  createGameState,
  gameLoop,
  getUpdatedVelocity
}
