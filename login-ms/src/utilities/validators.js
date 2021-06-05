const mobileCheck = (mobile) => {
  mobileRegX = new RegExp("^[6-9]{1}[0-9]{9}$");
  if (mobileRegX.test(mobile)) {
    return true;
  } else false;
};

const passwordCheck = (password) => {
  passwordRegX = new RegExp("^[a-zA-Z0-9]{8,12}$");
  if (passwordRegX.test(password)) {
    return true;
  } else false;
};
module.exports = { mobileCheck, passwordCheck };
