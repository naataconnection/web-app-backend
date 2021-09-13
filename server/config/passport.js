const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "emailId" },
      (emailId, password, done) => {
        // Match User
        User.findOne({
          emailId: emailId,
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: "The email is not registered",
            });
          }

          // Match Password (uncomment if using bcrypt for saving password)
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Password incorrect",
              });
            }
          });

          return done(null, user);
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
