import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserIdentityModel } from "./user-identity-model";
import * as bcrypt from 'bcrypt';

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            session: false
        },
        async (username, password, done) => {
            try {
                const identity = await UserIdentityModel.findOne({ 'credentials.username': username });
                if (!identity) {
                    return done(null, false, { message: `Email ${username} non trovata` });
                }
                const match = await bcrypt.compare(password, identity.credentials.hashedPassword);
                if (match) {
                    return done(null, identity.toObject().user)
                }
                done(null, false, { message: 'Password non valida' });
            } catch (err) {
                done(err);
            }
        }
    ))