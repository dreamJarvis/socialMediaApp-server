//** validating user register input
module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  // stores if there are any error's
  const errors = {};

  // username validator
  if(username.trim() === ''){
	  errors.username = 'username must not be empty';
  }

  // email validator
  if(email.trim() === ''){
  	errors.email = "Emails must not be empty";
  }else{
  	const regEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    if(!email.match(regEx)){
      errors.email = 'Email must be a valid email address';
    }
  }

  // password validator
  if(password === ''){
	  errors.password = 'Password must not be empty';
  }else if(password !== confirmPassword){
	  errors.confirmPassword = 'Password must match';
  }

  return {
	  errors,
	  valid: Object.keys(errors).length < 1
  }
}

//** Valildating user login input
module.exports.validateLoginInput = ( username, password ) => {
  // stores ig there are any error !
  const errors = {};

  // username validator
  if(username.trim() === ''){
    errors.username = 'username must not be empty';
  }

  // password validator
  if(password.trim() === ''){
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}