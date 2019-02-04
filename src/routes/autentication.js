const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggenIn,isNotLoggenIn } = require('../lib/auth');


router.get('/signup', isNotLoggenIn, (req, res) => {
    res.render('auth/signup')
})

router.post('/signup',isNotLoggenIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin',isNotLoggenIn, (req, res) => {
    res.render('auth/signin')
});

router.post('/signin', isNotLoggenIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
})


router.get('/profile', isLoggenIn, (req, res) => {
    res.render('profile');
});
router.get('/logout', isLoggenIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
})
module.exports = router;
