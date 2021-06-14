// const { AuthenticationError } = require('apollo-server');

// const jwt = require('jsonwebtoken');
// const { SECRET_KEY } = require('../config');

// module.exports = (context) => {
//   // context = { ... headers }
//   const authHeader = context.req.headers.authorization;
//   if (authHeader) {
//     // Bearer ....
//     const token = authHeader.split('Bearer ')[1];
//     if (token) {
//       try {
//         const user = jwt.verify(token, SECRET_KEY);
//         return user;
//       } catch (err) {
//         throw new AuthenticationError('Invalid/Expired token');
//       }
//     }
//     throw new Error("Authentication token must be 'Bearer [token]");
//   }
//   throw new Error('Authorization header must be provided');
// };

const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/*
  it checks if the user is logged in or not.
  user authentication is done via matching if the SECRET_KEY in the machine, is same as the SECRET_KEY in the Header's of the auth response.
*/
module.exports = (context) => {
  // context  = { ...headers }
  const authHeader  = context.req.headers.authorization;
  if(authHeader){
    // Bearer...
    const token = authHeader.split('Bearer ')[1];
    if(token){
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      }catch(err){
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error('Authentication token must be \'Bearer [token]');
  }
  throw new Error('Authentication header must be provided');
}