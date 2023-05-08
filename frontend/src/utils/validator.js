export default class Validator {
  constructor(validatorName, parameters) {
    /* validatorName list
      - validateEmptyInput
      - validateNoBlankValue
      - validateEmail
      - validateLength
      - validateOldandNewPassword
      - validateConfirmPassword
      - validateMaxLength
      - validateEnglishLetter
      - validateIllegalFileNameCharacters
    */
    this.validatorName = validatorName

    switch (validatorName) {
      case "validateLength":
        this.minLength = parameters.minLength
        this.maxLength = parameters.maxLength
        break
      case "validateMaxLength":
        this.maxLength = parameters.maxLength
        break
      default:
    }
  }

  validate(value, data) {
    switch (this.validatorName) {
      case "validateEmptyInput":
        return {
          isPass: value.trim().length !== 0,
          defaultErrorMessage: "cannot be blank.",
        };
      case "validateNoBlankValue":
        return {
          isPass: !(/\s/.test(value)),
          defaultErrorMessage: "cannot contain blank space(s)."
        }
      case "validateEmail":
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return {
          isPass: emailRegex.test(value),
          defaultErrorMessage: "is invalid.",
        };
      case "validateLength":
        return {
          isPass: value.length >= this.minLength && value.length <= this.maxLength,
          defaultErrorMessage: `length must be between ${this.minLength}-${this.maxLength} characters.`,
        };
      case "validateMaxLength":
        return {
          isPass: value.length <= this.maxLength,
          defaultErrorMessage: `length must not be longer than ${this.maxLength} characters.`,
        };
      case "validateOldandNewPassword":
        return {
          isPass: value !== data.password,
          specialErrorMessage: "New password should not be same as old password."
        }
      case "validateConfirmPassword":
        return {
          isPass: value === data.password,
          specialErrorMessage: "Password doesn't match.",
        };
      case "validateEnglishLetter":
        const englishLetterRegex = /^[a-zA-Z]*$/;
        return {
          isPass: englishLetterRegex.test(value),
          defaultErrorMessage: "must not contain numbers or special letters.",
        };
      case "validateIllegalFileNameCharacters":
        const illegalFilenameCharacters = ["#", "%", "&", "{", "}", "\\", "<", ">",
          "*", "?", "/", "$", "!", "'", '"', ";", ":", "@", "+", "`", "|", "="];
        let isPass = true;
        let illegalCharacters = "";
        for (let i = 0; i < value.length; i++) {
          let s = value.charAt(i)
          if (illegalFilenameCharacters.findIndex((c) => c === s) !== -1) {
            isPass = false;
            if (illegalCharacters.indexOf(s) === -1) {
              illegalCharacters += s;
            }
          }
        }
        return {
          isPass: isPass,
          defaultErrorMessage: `cannot contain special characters: ${illegalCharacters}`
        }
      default:
        return {
          isPass: false,
          specialErrorMessage: "something wrong!"
        }
    }
  }
}

// export const validateEmptyInput = (value) => {
//   return {
//     isPass: value.trim().length !== 0,
//     defaultErrorMessage: "cannot be blank.",
//   };
// };

// export const validateNoBlankValue = (value) => {
//   return {
//     isPass: !(/\s/.test(value)),
//     defaultErrorMessage: "cannot contain blank space(s)."
//   }
// }

// export const validateEmail = (email) => {
//   const emailRegex =
//     /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return {
//     isPass: emailRegex.test(email),
//     defaultErrorMessage: "is invalid.",
//   };
// };

// export const validateLength = (value, minLength, maxLength) => {
//   return {
//     isPass: value.length >= minLength && value.length <= maxLength,
//     defaultErrorMessage: `length must be between ${minLength}-${maxLength} characters.`,
//   };
// };

// export const validateOldandNewPassword = (newPassword, oldPassword) => {
//   return {
//     isPass: newPassword !== oldPassword,
//     specialErrorMessage: "New password should not be same as old password."
//   }
// }

// export const validateConfirmPassword = (confirmPassword, password) => {
//   return {
//     isPass: confirmPassword === password,
//     specialErrorMessage: "Password doesn't match.",
//   };
// };

// export const validateMaxLength = (value, maxLength) => {
//   console.log("hello", maxLength);
//   return {
//     isPass: value.length <= maxLength,
//     defaultErrorMessage: `length must not be longer than ${maxLength} characters.`,
//   };
// };

// export const validateEnglishLetter = (value) => {
//   const englishLetterRegex = /^[a-zA-Z]*$/;
//   return {
//     isPass: englishLetterRegex.test(value),
//     defaultErrorMessage: "must not contain numbers or special letters.",
//   };
// };

// export const validateIllegalFileNameCharacters = (value) => {
//   const illegalFilenameCharacters = ["#", "%", "&", "{", "}", "\\", "<", ">",
//     "*", "?", "/", "$", "!", "'", '"', ";", ":", "@", "+", "`", "|", "="];
//   let isPass = true;
//   let illegalCharacters = "";
//   for (let i = 0; i < value.length; i++) {
//     let s = value.charAt(i)
//     if (illegalFilenameCharacters.findIndex((c) => c === s) !== -1) {
//       isPass = false;
//       if (illegalCharacters.indexOf(s) === -1) {
//         illegalCharacters += s;
//       }
//     }
//   }
//   return {
//     isPass: isPass,
//     defaultErrorMessage: `cannot contain special characters: ${illegalCharacters}`
//   }
// }