import { useState } from "react";

const useInput = (field, validators, parameters) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  // iterate through all validators
  let isValueValid = true;
  let errorMessage;

  for (const validator of validators) {
    let validateResult;
    if (validator.name === 'validateLength') {
      validateResult = validator(enteredValue, parameters.minLength, parameters.maxLength)
    } else if (validator.name === 'validateConfirmPassword') {
      validateResult = validator(enteredValue, parameters.password)
    } else {
      validateResult = validator(enteredValue)
    }
    const { isPass: isPass, defaultErrorMessage: defaultErrorMsg, specialErrorMessage: specialErrorMsg } = validateResult

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
  isValueValid = isValueValid && isTouched

  const valueChangeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = (event) => {
    setIsTouched(true)
  }

  const reset = () => {
    setEnteredValue("");
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