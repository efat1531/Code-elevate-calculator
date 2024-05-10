// Getting the display element from the DOM
let display = document.getElementById("display");

display.value = "0";
// Calculated means if there was a calculation done now
let calculated = false;
// previousValue is the value that was calculated before
let previousValue;
// fullDisplayValue is the value that is shown on the display and if the displayt value is too long, it is stored here
let fullDisplayValue = "0";

// clearDisplay() clears the display
function clearDisplay() {
  display.value = "0";
  calculated = false;
  previousValue = null;
  fullDisplayValue = "0";
}

// deleteChar() deletes the last character from the display
function deleteChar() {
  if (
    !calculated &&
    display.value.length > 0 &&
    display.value !== previousValue
  ) {
    display.value = display.value.slice(0, -1);
    fullDisplayValue = fullDisplayValue.slice(0, -1);
    if (fullDisplayValue.length === 20) {
      display.value = fullDisplayValue;
    }
    if (display.value === "") {
      display.value = "0";
      fullDisplayValue = "0";
    }
  } else if (display.value === "Infinity" || display.value.includes("ERROR")) {
    clearDisplay();
  }
}

// appendChar() appends a character to the display
function appendChar(char) {
  if (display.value !== "Infinity" && !display.value.includes("ERROR")) {
    if (
      display.value === "0" &&
      fullDisplayValue === "0" &&
      char >= "1" &&
      char <= "9" &&
      !calculated
    ) {
      display.value = "";
      fullDisplayValue = "";
    }
    if (
      (char === "00" || char === "0") &&
      display.value === "0" &&
      fullDisplayValue === "0"
    ) {
      return;
    }
    display.value += char;
    fullDisplayValue += char;
    calculated = false;
    if (display.value.length > 20) {
      display.value = "..." + display.value.slice(-18);
    }
  }
}

// appendOperator() appends an operator to the display
function appendOperator(char) {
  if (display.value !== "Infinity" && !display.value.includes("ERROR")) {
    const lastChar = display.value.slice(-1);
    const operators = ["+", "-", "*", "/", "."];
    if (!operators.includes(lastChar)) {
      appendChar(char);
    } else if (
      operators.includes(lastChar) &&
      char !== lastChar &&
      char === "-"
    ) {
      appendChar(char);
    }
  }
}

// calculate() calculates the value on the display
function calculate() {
  try {
    console.log(fullDisplayValue);
    if (/[+\-*/]$/g.test(fullDisplayValue)) {
      throw new Error("Syntax ERROR");
    }
    let result = math.evaluate(fullDisplayValue);
    console.log(result);
    if (isNaN(result)) {
      throw new Error("Math ERROR");
    }
    let resultStr = result.toString();
    let val;
    if (resultStr.length > 20) {
      if (Number.isInteger(result)) {
        val = result.toExponential();
      } else {
        let precision = 20 - (resultStr.split(".")[0].length + 1);
        if (precision < 0) {
          val = val = Number(result.toPrecision(20));
        } else {
          val = result.toFixed(precision);
        }
      }
    } else {
      val = resultStr;
    }
    display.value = val;
    calculated = true;
    previousValue = display.value;
    fullDisplayValue = display.value;
  } catch (error) {
    if (error.message === "Math ERROR") {
      display.value = error.message;
      previousValue = error.message;
    } else {
      display.value = "Syntax ERROR";
      previousValue = "Syntax ERROR";
    }
  }
}
