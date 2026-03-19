import passport from "passport";
import {
  Strategy as GooleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const isUserExists = await User.findOne({ email });

        if (!isUserExists) {
          done(null, false, { message: "User Does not Exits" });
        }

        const isGoogleAuthenticated = await isUserExists?.auths.some(providerobject => providerobject.provider === 'google')

        if(isGoogleAuthenticated){
            return done(null,false, {message : 'you have authenticated through google . so you want to login with credentials , then at first login with google and set a password you gmail and then you can login with email and password'});
        }

        const isPasswordMatch = await bcryptjs.compare(
          password as string,
          isUserExists?.password as string,
        );

        if (!isPasswordMatch) {
          done(null,false, {message : "InCorrect Password"});
        }

        return done(null,isUserExists)

      } catch (error) {
        console.log(error);
        done(error);
      }
    },
  ),
);

passport.use(
  new GooleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email Not found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerID: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (err) {
        console.log("Goole Strategy Error", err);
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user: any, done: (err: any, id: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
