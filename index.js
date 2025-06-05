// Requiring module
const bcrypt = require('bcryptjs');




 function hashing(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}





function unhashing(databasepassword, inputpassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(inputpassword, databasepassword, (err, isMatch) => {
            if (err) {
                reject(err);
            } else {
                resolve(isMatch);
            }
        });
    });
}


module.exports = {
    hashing,
    unhashing
};


// Async/Await:
// Modern JavaScript has introduced async/await, which can make 
// asynchronous code like this more readable. You can rewrite your functions 
// like this:

// const bcrypt = require('bcryptjs');

// async function hashing(password) {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     return hash;
// }

// async function unhashing(databasepassword, inputpassword) {
//     const isMatch = await bcrypt.compare(inputpassword, databasepassword);
//     return isMatch;
// }




//generating salt value
// const saltRounds = 10; // You can adjust the number of salting rounds as needed (e.g., 10 rounds).

// bcrypt.genSalt(saltRounds, (err, salt) => {
//   if (err) {
//     // Handle error
//     console.error(err);
//   } else {
//     // Use the generated salt as needed
//     console.log('Generated salt:', salt);
//   }
// });





//hashing password without salt value
// const password = 'mypassword';

// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) {
//     // Handle error
//     console.error(err);
//   } else {
//     // Use the generated hash as needed
//     console.log('Hashed password:', hash);
//   }
// });





// hashing password with salt value
// const password = 'mypassword';

// // Generate a salt with 10 salting rounds
// bcrypt.genSalt(10, (err, salt) => {
//   if (err) {
//     // Handle error
//     console.error(err);
//   } else {
//     // Combine the salt with the password and hash it
//     bcrypt.hash(password, salt, (err, hash) => {
//       if (err) {
//         // Handle error
//         console.error(err);
//       } else {
//         // Use the generated hash as needed
//         console.log('Hashed password with salt:', hash);
//       }
//     });
//   }
// });



//unhashing password using bcrypt.compare 
// A hashed password retrieved from your database (you would store this value)
// const hashedPassword = '$2a$10$P0iVV6g8gBdTnCv98U2.7O/uM.A1m/2oBEel03QRsX4MwHK1x.2kC';

// // Password entered by the user during login
// const userEnteredPassword = 'mypassword';

// // Compare the entered password with the hashed password
// bcrypt.compare(userEnteredPassword, hashedPassword, (err, isMatch) => {
//   if (err) {
//     // Handle error
//     console.error(err);
//   } else if (isMatch) {
//     // Passwords match, authentication successful
//     console.log('Password is correct');
//   } else {
//     // Passwords do not match, authentication failed
//     console.log('Password is incorrect');
//   }
// });