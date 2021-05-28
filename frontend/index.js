const BG_COLOUR = '#231f20'
const SNAKE_COLOUR = '#c2c2c2'
const FOOD_COLOUR = '#e66916'

// socket io pulled in by html tag
const socket = io('http://localhost:3000')
socket.on('init', handleInit)
// send and repaint new gamestate when state changes on server
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)

const gameScreen = document.getElementById('gameScreen')

let canvas, ctx

function init () {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  canvas.width = canvas.height = 600
  ctx.fillStyle = BG_COLOUR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  document.addEventListener('keydown', keydown)
}

function keydown (event) {
  // send key to server
  socket.emit('keydown', event.keyCode)
}

function paintGame (state) {
  ctx.fillStyle = BG_COLOUR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const food = state.food
  const gridSize = state.gridSize // how many cells in grid
  const cellSize = canvas.width / gridSize // pixels per cell/square

  // place food
  ctx.fillStyle = FOOD_COLOUR
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize)

  paintPlayer(state.player, cellSize, SNAKE_COLOUR)
}

function paintPlayer (playerState, cellSize, colour) {
  const snake = playerState.snake
  // paint each snake cell
  ctx.fillStyle = SNAKE_COLOUR
  for (const cell of snake) {
    ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize)
  }
}

function handleInit (message) {
  console.log(message)
}

function handleGameState (gameState) {
  gameState = JSON.parse(gameState)
  window.requestAnimationFrame(() => paintGame(gameState))
}

function handleGameOver () {
  alert('YOU LOSE')
}
init()
