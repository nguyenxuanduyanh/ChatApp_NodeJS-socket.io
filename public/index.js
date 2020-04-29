var socket = io('http://localhost:8080')
socket.on('update-userlist', function(data) {
    $("#users").html("")
    data.forEach(function(item) {
        $("#users").append('<li>' + item + '</li>')
    })
})
socket.on('register-fail', function() {
    alert('The user name is already exists')

})
socket.on('register-success', function() {
    $(".join-container").show(2000)
    $(".chat-container").show(1000)
})

socket.on('server-msg-all-user', function(message) {
    $(".chat-messages").append("<div class='message'>" + "<p class='meta'>" + message.user + "</p>" + "<p class='text'>" + message.content + "</p>" + "</div>")
})
socket.on('user-typing', function(data) {
    $("#typing").html(data + " is typing " + "<span><img src='/images/typing2.gif' width='40px' height='20px' alt=''></span>")
})
socket.on('user-nottype-server', function(data) {
    $("#typing").html(" ")
})

$(document).ready(function() {
    $(".join-container").show()
    $(".chat-container").hide()
    $("#btn-register").click(function() {
        socket.emit('client-register', $("#username").val())
    })
    $("#btn-msg").click(function() {
        socket.emit('send-message', $("#msg").val())
    })
    $("#btn-logout").click(function() {
        socket.emit('user-logout')
        $(".join-container").show()
        $(".chat-container").hide()

    })
    $("#msg").focusin(function() {
        socket.emit('is-user-typing')
    })
    $("#msg").focusout(function() {
        socket.emit('user-not-type')
    })
})