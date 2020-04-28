var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
require('dotenv').config();

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public')); //Serves resources from public folder


server.listen(parseInt(process.env.SERVER_PORT), function() {
    console.log("The Socket.IO server is running on port " + process.env.SERVER_PORT)
})
users_arr = []
io.on('connection', function(socket) {
    console.log("User connected :" + socket.id)
        // register feature
    socket.on('client-register', function(data) {
        if (users_arr.indexOf(data) !== -1) {
            return socket.emit('register-fail')
        }
        users_arr.push(data)
        socket.emit('register-success')
        io.sockets.emit('update-userlist', users_arr)

        // message feature
        socket.on('send-message', function(mes) {
                io.sockets.emit('server-msg-all-user', { user: data, content: mes })

            })
            //log out feature
        socket.on('user-logout', function() {
            users_arr.splice(users_arr.indexOf(data), 1)
            socket.broadcast.emit('update-userlist', users_arr)

        })

    })

    socket.on('disconnect', function() {
        console.log('User with id ' + socket.id + ' disconnect')
    })
})

//route

app.get('/', function(req, res) {
    res.render('index.ejs')
})