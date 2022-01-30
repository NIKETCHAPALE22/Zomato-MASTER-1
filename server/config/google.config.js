import passport from "passport";
import googleOAuth from "passport-google-oauth20";

import { UserModel } from "../database/allModels";

const GoogleStrategy = googleOAuth.Strategy;

export default (passport) => {
  passport.use(
    new GoogleStrategy({
      clientID: "get_ID",
      clientSecret: "get_Secret",
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
async(accessToken, refreshToken, profile, done) => {
  //creating new user
    const newUser = {
      fullname: profile.displayName,
      email: profile.emails[0].value,
      profilePic: profile.photos[0].value
    };
    try{
      //check whether the user exists or not
      const user = await UserModel.findOne({email: newUser.email});
      if(user) {

        //generating jwt token
        const token = user.generateJwtToken();
        //return user
        done(null, {user, token});
      } else {
        //creating a new user if it not present
        const user = await UserModel.create(newUser);

        //generating jwt token
        const token = user.generateJwtToken();
        //return user
        done(null , {user, token});
      }
    } catch(error) {
      done(error, null);
    }
}
  )
);

passport.serializeUser((userData,done) => done(null, {...userData}));
passport.deserializeUser((id, done) => done(null, id));

}
