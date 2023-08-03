const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path'); // Import the 'path' module
require('dotenv').config();

const app = express();

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static(__dirname))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '695501266191-k0nrnoa66973qu1u1jf5vk3c55rvki8k.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            name: req.user.displayName,
            email: req.user.emails[0].value,
        });
    } else {
        res.json({});
    }
});

// Serve the map.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'weather_with_map.html'));
});

app.listen(3000, () => console.log('App listening on port 3000!'));
