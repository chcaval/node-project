const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const express = require('express')

const app = express()

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection.')

    socket.emit('message', 'Hello world') 
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')

        }
        io.emit('message', message )
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps/?q=${coords.latitude},${coords.longitude}`   )
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message','Client has left')
    })
})

server.listen(port, () => {
    console.log(`Server is running on ${ port }`)
})
