
// socket io
const io = require('socket.io')({
  cors: {
    origin: '*'
  }
})

const { createGameState, gameLoop, getUpdatedVelocity } = require('./game')
const { FRAME_RATE } = require('./constants')

io.on('connection', client => {
  const state = createGameState()

  client.on('keydown', handleKeydown)

  function handleKeydown (keyCode) {
    console.log(keyCode)
    try {
      keyCode = parseInt(keyCode)
    } catch (err) {
      console.log(err)
      return
    }
    console.log(keyCode)

    const vel = getUpdatedVelocity(keyCode)

    // make sure its a velocity and
    // if the opposing velocity of the input velocity is equal to the current velocity then this should
    // be ignored as the snake cannot go back on itself
    if (vel && vel.vel && vel.opposingVel.x === state.player.vel.x && vel.opposingVel.y === state.player.vel.y) {
      console.log('snake cannot move in that direction')
    } else if (vel) {
      state.player.vel = vel.vel
    }
  }

  startGameInterval(client, state)
  // client object allows us to communicate back to client that has just connected
  // send the client back an object with 'init' event
  // client.emit('init', { data: 'hello world' })
})

function startGameInterval (client, state) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state)
    // console.log(state.player.snake)
    if (!winner) {
      client.emit('gameState', JSON.stringify(state))
    } else {
      client.emit('gameOver')
      clearInterval(intervalId)
    }
  }, 1000 / FRAME_RATE // 1000ms(1 second)/frames per second (milliseconds to wait per frame). send updates to client
  )
}

io.listen(3000)
