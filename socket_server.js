const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./app/config/passport.config');
const route = require('./app/routes/route');
const formatMessage = require('./utils/message');
require('dotenv').config();

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public')); //Serves resources from public folder


// Passport session setup. 
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
// Sử dụng FacebookStrategy cùng Passport.
passport.use(new FacebookStrategy({
        clientID: config.facebook_key,
        clientSecret: config.facebook_secret,
        callbackURL: config.callback_url
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }
));

app.use(cookieParser()); //Parse cookie
app.use(bodyParser.urlencoded({ extended: false })); //Parse body để get data
app.use(session({ secret: 'keyboard cat', key: 'sid' })); //Save user login
app.use(passport.initialize());
app.use(passport.session());



//}) 

server.listen(parseInt(process.env.SERVER_PORT) || 3000, function() {
    console.log("The Socket.IO server is running on port " + process.env.SERVER_PORT)
})

USTH_arr = []
Family_arr = []
TanMai_arr = []
HSGS_arr = []
io.on('connection', function(socket) {
    console.log("User connected :" + socket.id)
    socket.on('client-register', function(data) {
        socket.join(data.room)
        socket.Room = data.room
        socket.Username = data.username

        // Broadcast when a user connects
        socket
            .to(socket.Room)
            .emit(
                'message',
                formatMessage(data.room, "Chatbot", `${data.username} has joined the chat`)
            );
        if (socket.Room == "TanMai") {
            TanMai_arr.push(data.username)
            io.to(socket.Room).emit('update-userlist', TanMai_arr)
            io.to(socket.Room).emit('pick-room', data.room)
            socket.emit("clearmsg")


        } else if (socket.Room == "HSGS") {
            HSGS_arr.push(data.username)
            io.to(socket.Room).emit('update-userlist', HSGS_arr)
            io.to(socket.Room).emit('pick-room', data.room)
            socket.emit("clearmsg")


        } else if (socket.Room == "USTH") {
            USTH_arr.push(data.username)
            io.to(socket.Room).emit('update-userlist', USTH_arr)
            io.to(socket.Room).emit('pick-room', data.room)
            socket.emit("clearmsg")


        } else if (socket.Room == "Family") {
            Family_arr.push(data.username)
            io.to(socket.Room).emit('update-userlist', Family_arr)
            io.to(socket.Room).emit('pick-room', data.room)
            socket.emit("clearmsg")

        }
        console.log(socket.Username)
        console.log(`socket.Room is ${socket.Room}`)

    })
    socket.on('send-message', function(data) {
        io.in(socket.Room).emit('message-to-room', formatMessage(socket.Room, socket.Username, data))
    })
    socket.on('user-logout', function() {
        if (socket.Room == "TanMai") {
            TanMai_arr.splice(TanMai_arr.indexOf(socket.Username), 1)
            socket.to(socket.Room).emit('update-userlist', TanMai_arr)

        }
        if (socket.Room == "HSGS") {
            HSGS_arr.splice(HSGS_arr.indexOf(socket.Username), 1)
            socket.to(socket.Room).emit('update-userlist', HSGS_arr)

        }
        if (socket.Room = "USTH") {
            USTH_arr.splice(USTH_arr.indexOf(socket.Username), 1)
            socket.to(socket.Room).emit('update-userlist', USTH_arr)

        }
        if (socket.Room = "Family") {
            Family_arr.splice(Family_arr.indexOf(socket.Username), 1)
            socket.to(socket.Room).emit('update-userlist', Family_arr)

        }


    })
    socket.on('is-user-typing', function() {
        socket.broadcast.emit('user-typing-server', data)
    })
    socket.on('user-not-type', function() {
        socket.broadcast.emit('user-nottype-server', data)
    })
    socket.on('disconnect', function() {
        console.log('User with id ' + socket.id + ' disconnect')
    })

})
app.use('/', route)