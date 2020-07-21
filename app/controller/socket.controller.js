// module.exports.socketserver = (socket) => {
//     users_arr = []

//     socket.on('client-register', function(data) {
//         if (users_arr.indexOf(data) !== -1) {
//             return socket.emit('register-fail')
//         }
//         users_arr.push(data)
//         socket.emit('register-success')
//         io.sockets.emit('update-userlist', users_arr)

//     })
// }