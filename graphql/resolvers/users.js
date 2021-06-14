const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const { 
  validateRegisterInput, 
  validateLoginInput 
} = require('../../util/validators');

// helper funct's
function generateToken(user){
	return jwt.sign(
		{
			id: user.id, 
			email: user.email, 
			username: user.username
		}, 
		SECRET_KEY, 
		{ expiresIn: '1h'}  
	);
}

module.exports = {
	Mutation: {	
		//** login inputs validation
		async login(_, {username, password}){
			const { errors, valid } = validateLoginInput(username, password);
			
			if(!valid){
				throw new UserInputError('Wrong Dredentials', { errors });
			}
	
			const user = await User.findOne({ username });
			if(!user){
				errors.general = 'User not found !';
				throw new UserInputError('User not found !', { errors });
			}
	
			const match = await bcrypt.compare(password, user.password);
			if(!match){
				errors.general = 'Wrong Dredentials';
				throw new UserInputError('Wrong Dredentials', { errors });
			}
	
			const token = generateToken(user);
			
			return {
				...user._doc,
				id: user._id,
				token
			};
		},

		//** register input validation
		async register(
			_, 
			{   
				registerInput: { username, email, password, confirmPassword}
			}
		){
			// Vaidate user data
			const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

			if(!valid) {
				throw new UserInputError('Errors', { errors });
			}
			
			// Make sure user doesn't already exists
			const user = await User.findOne({ username });
			if(user){
				throw new UserInputError('User is taken', {
					errors: {
						username: 'This user is taken'
					}
				});
			}

			// hash password and create auth token 
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				username,
				password,
				email, 
				createdAt: new Date().toISOString()
			});

      // saving the new data to the db
			const res = await newUser.save();   // TODO: what does it returns ??   

			const token = generateToken(res);
			
			return {
				...res._doc,
				id: res._id,
				token
			};
		}
	}
}