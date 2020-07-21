const moment = require('moment');

module.exports = function formatMessage(room, username, text) {
    return {
        room,
        username,
        text,
        time: moment().format('h:mm a')
    }
}