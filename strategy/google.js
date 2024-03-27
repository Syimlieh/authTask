require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const Users = require("../schemas/user");
const UserToken = require("../schemas/user.token");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      accessType: "offline"
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        let user = await Users.findOne({ email: profile.email });

        if (user) {
          // If the user exists, update profile with the latest info
          user.name = profile.displayName;
          user.profile = profile.photos[0].value;
          user = await user.save();
        } else {
          // If the user doesn't exist, create a new user
          user = new Users({
            email: profile.email,
            name: profile.displayName,
            profile: profile.photos[0].value,
          });
          user = await user.save();
        }

        let userToken = await UserToken.findOne({ email: profile.email });
        if (userToken) {
          userToken.refreshToken = refreshToken;
        } else {
          userToken = new UserToken({
            email: profile.email,
            refreshToken,
          });
        }
        await userToken.save();
        return done(null, { ...user.toObject(), tokens: { accessToken, refreshToken } });
      } catch (error) {
        return done(error);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})