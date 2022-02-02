const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');


// Register routes
router.get('/register', (req, res)=> {
    res.render('users/register')
});

router.post('/register', catchAsync( async (req,res) => {
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
        req.flash('success','Welcome to Yelp-Camp!');
        res.redirect('/campgrounds');
        } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    };
}));

//Login Routes
router.get('/login', (req, res)=> {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req,res) => {
req.flash('success', "Welcome back! We've missed you!");
res.redirect('/campgrounds');
});

//Logout Routes
router.get('/logout', (req, res)=> {
    req.logout();
    req.flash('success', "We're sorry to see you go :( ");
    res.redirect('/campgrounds');
});

module.exports = router;