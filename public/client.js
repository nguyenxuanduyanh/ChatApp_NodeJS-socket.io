    const messages = document.querySelector('.chat-messages')
    var socket = io('http://localhost:3000')
    socket.on('update-userlist', function(data) {
        $(".join-container").hide()
        $(".chat-container").show(2000)
        $("#users").html("")
        data.forEach(user => {
            $("#users").append('<li>' + user + '</li>')
        });
    })
    socket.on('clearmsg', function(data) {
        $(".chat-messages").html("")
    })
    socket.on('message', function(data) {
        outputMessage(data)
    })
    socket.on('pick-room', function(data) {
        $('#room-name').html("")
        $('#room-name').append(data)
    })

    socket.on('message-to-room', function(data) {
        outputMessage(data)
        messages.scrollTop = messages.scrollHeight

    })
    socket.on('user-typing-server', function(data) {
        $("#typing").html(data + " is typing " + "<span><img src='/images/typing2.gif' width='40px' height='20px' alt=''></span>")
    })
    socket.on('user-nottype-server', function(data) {
        $("#typing").html(" ")
    })


    $(document).ready(function() {
        $(".join-container ").show()
        $(".chat-container ").hide()

        $("#btn-register ").click(function() {

            socket.emit('client-register', {
                username: $('#username').val(),
                room: $('#room').val()
            })
        })
        $('#btn-logout').click(function() {
            socket.emit('user-logout')
            $(".join-container").show()
            $(".chat-container").hide()
        })
        $('#btn-msg').click(function() {
            socket.emit('send-message', $('#input-msg').val())
            $('#input-msg').val("")

        })

        var input = document.getElementById("input-msg");
        // Execute a function when the user releases a key on the keyboard
        input.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                $('#btn-msg').click();
            }
        });
        $("#msg").focusin(function() {
            socket.emit('is-user-typing')
        })
        $("#msg").focusout(function() {
            socket.emit('user-not-type')
        })


    })

    function outputMessage(message) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
          ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    }