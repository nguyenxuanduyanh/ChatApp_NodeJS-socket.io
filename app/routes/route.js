const express = require('express')
let router = express.Router()
const passport = require('passport');


router.get('/', ensureAuthenticated, function(req, res) {
    res.render('chat', { user: req.user })
});
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }))
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}
module.exports = router;