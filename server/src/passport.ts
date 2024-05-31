const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
        ) => {;
            console.log('profile', profile);
            done(null, profile);
        }
    )
);

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: '/auth/github/callback',
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
        ) => {
            console.log('profile', profile);
            done(null, profile);
        }
    )
);

passport.serializeUser((user:any, done:any) => {
    done(null, user);
});

passport.deserializeUser((user:any, done:any) => {
    done(null, user);
});





