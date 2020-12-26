var express = require('express');
var router = express.Router();

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GithubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google').Strategy

var QueryUser = require('../utils/db/QueryUser')

// login passport setup
passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            var result = await QueryUser.findUser(username, password);

            console.log("get user: " + username + " pass: " + password + ", login sucess: " + result)
            if (result === true) {
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

passport.serializeUser(function (user, done) {
    done(null, user.username)
})

passport.deserializeUser(function (username, done) {
    done(null, {username: username})
})

router.post('/', passport.authenticate('local', {
    failureMessage: "fail",
    successMessage: "success"
}), function (req, res) {
    res.send("success")    
});

module.exports = {
    router: router,
    passport: passport
};
