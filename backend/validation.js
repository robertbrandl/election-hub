import { ObjectId } from "mongodb";

export function checkString(str) {
  if (!str || str === undefined) {
    throw "The argument is not supplied, null, undefined, 0, false, '', or NaN";
  }
  if (typeof str !== "string") {
    throw `${str} is not a string`;
  }
  let trimStr = str.trim();
  if (trimStr.length === 0) {
    throw "The argument cannot be empty";
  }
  return trimStr;
}

export const validateDate = async (dateInput) => {
  if (!dateInput || typeof dateInput !== "string") {
    throw { code: 400, error: "Invalid Date Provided" };
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateInput)) {
    throw {
      code: 400,
      error: "Invalid Date format as the correct format is YYYY-MM-DD",
    };
  }

  const parts = dateInput.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const currentYear = new Date().getFullYear();
  if (year < currentYear) {
    throw {
      code: 400,
      error: `Year must be ${currentYear} or only Future year`,
    };
  }
  if (month < 0 || month > 11) {
    throw { code: 400, error: "Month must be between 1 to 12" };
  }
  const date = new Date(year, month, day);
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return dateInput;
  } else {
    throw { code: 400, error: "Invalid date" };
  }
};
export function checkstring(string) {
  if (typeof string != "string") throw "ERROR : input is not a string";
}

export function checknum(num) {
  if (typeof num !== "number" || num == Infinity || isNaN(num))
    throw "ERROR : input is not a number";
}

export function justSpaces(string) {
  if (/^\s*$/.test(string)) {
    throw "ERROR : String cannot be only spaces";
  }
}

export function checkundefined(input) {
  if (input === undefined)
    throw "ERROR : input cannot be undefined or not enough inputs passed into function";
}

export function emptyStringCheck(string) {
  if (string.length == 0) throw "ERROR : string cannot be empty";
}

export function stringValidation(string) {
  checkundefined(string);
  checkstring(string);
  emptyStringCheck(string);
  justSpaces(string);
}
export const checkId = async (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  console.log(id);
  if (typeof id !== "string") throw `Error:${varName} must be a string`;

  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
};
