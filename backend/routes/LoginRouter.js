var express = require('express');
var router = express.Router();

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
// const GithubStrategy = require('passport-github').Strategy
// const GoogleStrategy = require('passport-google').Strategy

var QueryUser = require('../utils/db/QueryUser')

// login passport setup
passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            var result = await QueryUser.authUser(username, password);

            console.log("get user: " + username + " pass: " + password + ", login sucess: " + JSON.stringify(result))
            if (result.success === true) {
                return done(null, { username: username })
                // return {username: username}
            }
            else {
                return done(null, false)
                // return false
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
            callbackURL: process.env.FB_CALLBACK_URL
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ))
    router.get('/fb', passport.authenticate('facebook'));

    router.get('/fb/callback', passport.authenticate('facebook'),
    function (req, res) {
        res.send("success")
    });
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