import { useState } from "react";

const useInput = (field, validators, parameters) => {
  // console.log("field", field)
  // console.log("parameters", parameters)

  let defaultValue = "";
  if (parameters.defaultValue) {
    defaultValue = parameters.defaultValue
  }

  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  // iterate through all validators
  let isValueValid = true;
  let errorMessage;

  // console.log(field)
  for (const validator of validators) {
    let validateResult;
    // console.log(validator.validatorName)
    if (validator.validatorName === 'validateConfirmPassword' || validator.validatorName === 'validateOldandNewPassword') {
      validateResult = validator.validate(enteredValue, { password: parameters.password })
    } else {
      validateResult = validator.validate(enteredValue, {})
    }

    const { isPass, defaultErrorMessage: defaultErrorMsg, specialErrorMessage: specialErrorMsg } = validateResult

    if (!isPass) {
      isValueValid = false;
      if (!!!specialErrorMsg)
        errorMessage = field + " " + defaultErrorMsg;
      else
        errorMessage = specialErrorMsg;
      break;
    }
  }
  const hasError = !isValueValid && isTouched

  const setEnterValue = (event) => {
    setEnteredValue(event.target.value);
  }

  const valueChangeHandler = (event) => {
    setEnterValue(event);
    // for email
    if (parameters.removeEmailDuplicated) {
      parameters.removeEmailDuplicated(false);
    }
  };

  const inputBlurHandler = (event) => {
    setIsTouched(true)
  }

  const reset = () => {
    setEnteredValue(defaultValue);
    setIsTouched(false);
  }

  return {
    value: enteredValue,
    isValueValid: isValueValid,
    hasError: hasError,
    errorMessage: errorMessage,
    valueChangeHandler: valueChangeHandler,
    inputBlurHandler: inputBlurHandler,
    reset: reset
  }
}

export default useInput;