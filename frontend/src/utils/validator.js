export const validateEmptyInput = (value) => {
  return {
    isPass: value.trim().length !== 0,
    defaultErrorMessage: "cannot be blank.",
  };
};

export const validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return {
    isPass: emailRegex.test(email),
    defaultErrorMessage: "is invalid.",
  };
};

export const validateLength = (value, minLength, maxLength) => {
  return {
    isPass: value.length >= minLength && value.length <= maxLength,
    defaultErrorMessage: `length must be between ${minLength}-${maxLength} characters.`,
  };
};

export const validateConfirmPassword = (confirmPassword, password) => {
  return {
    isPass: confirmPassword === password,
    specialErrorMessage: "Password doesn't match.",
  };
};

export const validateMaxLength = (value, maxLength) => {
  return {
    isPass: value.length <= maxLength,
    defaultErrorMessage: `length must not be longer than ${maxLength} characters.`,
  };
};

export const validateEnglishLetter = (value) => {
  const englishLetterRegex = /^[a-zA-Z]*$/;
  return {
    isPass: englishLetterRegex.test(value),
    defaultErrorMessage: "must not contain numbers or special letters.",
  };
};