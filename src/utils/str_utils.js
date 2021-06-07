
function isAlphaNumeric (cc) {
  // number, uppercast, lowercast check
  return ((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123));
}

function isAlphabet (cc) {
  return ((cc > 64 && cc < 91) || (cc > 96 && cc < 123));
}

function checkString (str, from, to, checkFunc) {
  for (let i = from; i < to; i++) {
    let cc = str.charCodeAt(i);
    if (checkFunc) {
    } else {
      return false;
    }
  }
  return true;
}

export default {
  isAlphaNumeric,
  isAlphabet,
  checkString
};

