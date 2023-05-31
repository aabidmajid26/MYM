const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

// Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Verify and create/update user in MongoDB
      const usersCollection = client.db('myapp').collection('users');
      usersCollection.findOneAndUpdate(
        { email: profile.emails[0].value },
        {
          $setOnInsert: { email: profile.emails[0].value },
          $set: {
            name: profile.displayName,
            profilePicture: profile.photos[0].value,
          },
        },
        { upsert: true, returnOriginal: false },
        (err, user) => {
          if (err) {
            console.error('Error creating/updating user:', err);
            return done(err, false);
          } else {
            return done(null, user.value);
          }
        }
      );
    }
  )
);

app.use(passport.initialize());

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to home page or send response
    res.redirect('/');
  }
);

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
});
