require('dotenv').config();
module.exports = {
    "facebook_key": process.env.FACEBOOK_API_KEY, //Điền App ID của bạn vào đây
    "facebook_secret": process.env.FACEBOOK_API_SECRET, //Điền App Secret ở đây
    "callback_url": process.env.FACEBOOK_CALLBACK_URL
}