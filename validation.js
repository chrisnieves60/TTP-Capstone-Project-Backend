const emailValidation = (email) => {
    const regEx = //email validation 
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regEx.test(email)) { //test to see if matches regex
      return true;
    }
    return false;
  };
  
  // password validation
  const passwordValidation = (password) => {
    // regex for password
    // minimum 8 characters, at least one Uppercase letter, one number, one special character
    const regEx2 =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regEx2.test(password)) {
      return true;
    }
    return false;
  };
  
  module.exports = { emailValidation, passwordValidation };