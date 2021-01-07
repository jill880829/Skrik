var express = require('express');
var router = express.Router();

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
// const GithubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy

var QueryUser = require('../utils/db/QueryUser')

// login passport setup
passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            var result = await QueryUser.authUser(username, password);

            console.log("get user: " + username + " pass: " + password + ", login sucess: " + JSON.stringify(result))
            if (result.success === true) {
                return done(null, { username: username })
            }
            else {
                return done(null, false)
            }
        }
        catch (err) {
            console.error("[/api/login] unknown error: " + err)
        }
    }
))

if (process.env.FB_APP_ID !== undefined) {
    passport.use(new FacebookStrategy({
            clientID: process.env.FB_APP_ID,
            clientSecret: process.env.FB_APP_SECRET,
            callbackURL: process.env.LOGIN_URL + "/callback/fb"
    },
        async function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            try {
                let user = await QueryUser.authFB(profile.id, profile.displayName);
                return done(null, user);
            }
            catch (err) {
                console.log("[fb] unexpected error: " + err)
                return done(null, false)
            }
        }
    ))
    router.get('/fb', passport.authenticate('facebook'));

    router.get('/callback/fb', passport.authenticate('facebook', { successRedirect: 'Menu', failureRedirect: '/Login' }));
}


if (process.env.GOOGLE_APP_ID !== undefined) {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_APP_ID,
            clientSecret: process.env.GOOGLE_APP_SECRET,
            callbackURL: process.env.LOGIN_URL + "/callback/google",
            passReqToCallback   : true
    },
        async function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            try {
                let user = await QueryUser.authFB(profile.id, profile.displayName);
                return done(null, user);
            }
            catch (err) {
                console.log("[fb] unexpected error: " + err)
                return done(null, false)
            }
        }
    ))
    router.get('/fb', passport.authenticate('facebook'));

    router.get('/callback/fb', passport.authenticate('facebook', { successRedirect: 'Menu', failureRedirect: '/Login' }));
}

passport.serializeUser(function (user, done) {
    console.log(user)
    done(null, user.username)
})

passport.deserializeUser(function (username, done) {
    done(null, { username: username })
})

router.post('/', passport.authenticate('local'), 
function (req, res) {
    res.send("success")
});



module.exports = {
    router: router,
    passport: passport
};