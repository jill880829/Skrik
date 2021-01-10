var express = require('express');
var router = express.Router();

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const GithubStrategy = require('passport-github2').Strategy
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
            try {
                let user = await QueryUser.authFB(profile.id, profile.displayName);
                if(user.username === undefined) {
                    console.log("[fb] authFB missing user: undefined.")
                    return done(null, false);
                }
                return done(null, user);
            }
            catch (err) {
                console.log("[fb] unexpected error: " + err)
                return done(null, false)
            }
        }
    ))
    router.get('/fb', passport.authenticate('facebook'));

    router.get('/callback/fb', passport.authenticate('facebook', { successRedirect: '/Menu', failureRedirect: '/Login' }));
}



if (process.env.GOOGLE_APP_ID !== undefined) {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_APP_ID,
            clientSecret: process.env.GOOGLE_APP_SECRET,
            callbackURL: process.env.LOGIN_URL + "/callback/google",
            passReqToCallback: true
    },
        async function(req, accessToken, refreshToken, profile, done) {
            try {
                let user = await QueryUser.authGoogle(profile.id, profile.displayName);
                if(user.username === undefined) {
                    console.log("[google] authGoogle missing user: undefined.")
                    return done(null, false);
                }
                return done(null, user);
            }
            catch (err) {
                console.log("[google] unexpected error: " + err)
                return done(null, false)
            }
        }
    ))
    router.get('/google', passport.authenticate('google', { scope:[ 'profile' ] }));

    router.get('/callback/google', passport.authenticate('google', { successRedirect: '/Menu', failureRedirect: '/Login' }));
}

if (process.env.GITHUB_APP_ID !== undefined) {
    passport.use(new GithubStrategy({
            clientID: process.env.GITHUB_APP_ID,
            clientSecret: process.env.GITHUB_APP_SECRET,
            callbackURL: process.env.LOGIN_URL + "/callback/github",
    },
        async function(accessToken, refreshToken, profile, done) {
            try {
                let user = await QueryUser.authGithub(profile.id, profile.username);
                if(user.username === undefined) {
                    console.log("[github] authGithub missing user: undefined.")
                    return done(null, false);
                }
                return done(null, user);
                // return done(null, {username: "123aaa"});
            }
            catch (err) {
                console.log("[ggithub] unexpected error: " + err)
                return done(null, false)
            }
        }
    ))
    router.get('/github', passport.authenticate('github', { scope:[ 'profile' ] }));

    router.get('/callback/github', passport.authenticate('github', { successRedirect: '/Menu', failureRedirect: '/Login' }));
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