//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mysql2 = require('mysql2');
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { hashing, unhashing } = require('./index.js'); // Assuming both files are in the same directory

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended : true
}));



app.use(session({
    secret: 'Our Little Secret.',
    resave: false,
    saveUninitialized: false,
  }));


app.use(passport.initialize());
app.use(passport.session());


const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME // This is your database name
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
  



app.get('/', (req, res) => {
res.render("home");
});


app.get('/users', (req, res) => {


    let sql = `SELECT * FROM us_er`;
    let query = db.query(sql, (err, results) => 
    {

if(err) throw err;
res.send(results);
    });
    });


app.get('/login', (req, res) => {
    res.render("login");
    });

    app.get('/register', (req, res) => {
        res.render("register");
        });
        app.get('/secrets', (req, res) => {
          res.render("secrets");
          });
      




        app.post('/register', async (req, res) => {
          let { username, password } = req.body; // Assuming you have form fields for email and password
        
          // const user = {
          //   email: username,
          //   password: password
          // };
          // password = hashing(password);
        
          // const insertUserQuery = 'INSERT INTO us_er (email ,password) VALUES (?, ?)';
        
          // db.query(insertUserQuery, [username, password], (err, results) => {
          //   if (err) {
          //     console.error('Error inserting user:', err);
          //     res.redirect('/register'); // Redirect to registration page on error
          //   } else {
          //     // console.log('User inserted:', results);
          //     res.redirect('/secrets'); // Redirect to login page on success
          //   }
          // });
        
        
    try {
        password = await hashing(password);

        const insertUserQuery = 'INSERT INTO us_er (email, password) VALUES (?, ?)';

        db.query(insertUserQuery, [username, password], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                res.redirect('/register');
            } else {
                res.redirect('/secrets');
            }
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.redirect('/register');
    }
        });
    




//         app.post('/login' , (req, res) => {
//           const username = req.body.username;
//           const password = req.body.password;

//          const selectUserQuery = 'SELECT * FROM us_er WHERE email = ? LIMIT 1';

//   db.query(selectUserQuery, username, (err, results) => {
//     if (err) {
//       console.error('Error querying the database:', err);
//       res.redirect('/login'); // Redirect to login page on error
//     } else {
//       if (results.length > 0) {
//         const foundUser = results[0];
//         let checkk = unhashing(foundUser.password, password);
//         if (checkk) {
//           res.render('secrets');
//         } else {
//           // Password doesn't match
//           res.redirect('/login'); // Redirect to login page with an error message
//         }
//       } else {
//         // User not found
//         res.redirect('/login'); // Redirect to login page with an error message
//       }
//     }
//   });
// });


app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const selectUserQuery = 'SELECT * FROM us_er WHERE email = ? LIMIT 1';

  db.query(selectUserQuery, username, async (err, results) => {
      if (err) {
          console.error('Error querying the database:', err);
          res.redirect('/login');
      } else {
          if (results.length > 0) {
              const foundUser = results[0];

              try {
                  const isMatch = await unhashing(foundUser.password, password);

                  if (isMatch) {
                      res.render('secrets');
                  } else {
                      // Password doesn't match
                      res.redirect('/login');
                  }
              } catch (error) {
                  console.error('Error comparing passwords:', error);
                  res.redirect('/login');
              }
          } else {
              // User not found
              res.redirect('/login');
          }
      }
  });
});





app.listen(3000, function() {
    console.log(`Server started on port 3000...`);
});