import { ErrEnum } from '../bc_defines';

const minPostcodeLen = 5;
const maxPostcodeLen = 8;

function verifyPostcodeFormat (testcode) {
  // trim and remove double space
  let code = testcode.trim().replace(/ +/g, '').toUpperCase();

  // test invalid characters
  // const blRegex = new RegExp("^[^#%&!.*:<>_?/(=){|}]+$");
  const blRegex = new RegExp(/^[0-9a-zA-Z]+$/);

  // test validity of the format
  const wlRegex = new RegExp(/[A-Z][A-Z0-9 ]{1,8}/i);

  // let blResult = blRegex.test(code);
  // let wlResult = wlRegex.test(code);
  // console.log('validation result %o %o for code %s', blResult, wlResult, code);
  if (code.length < 1) {
    return ErrEnum.errTooShort;
  }
  if (code.match(blRegex)) {
    if (wlRegex.test(code) === false) {
      return ErrEnum.errInvalidFormat;
    }
    if (code.length < minPostcodeLen) {
      return ErrEnum.errTooShort;
    }
    if (code.length > maxPostcodeLen) {
      return ErrEnum.errTooLong;
    }
    return ErrEnum.errNone;
  } else {
    return ErrEnum.errInvalidChar;
  }
}

function shortenPostcode (code) {
  return code.trim().replace(/\s+/g, '').toUpperCase();
}

function rectifyPostcodeSimple (testCode) {
  return testCode.trim().replace(/ +(?= )/g, '').toUpperCase();
}

function rectifyPostcode (testCode) {
  let rectifiedCode = testCode;
  let errCode = ErrEnum.errNone;

  if (testCode && typeof testCode === 'string') {
    if (testCode.length > 0) {
      errCode = this.verifyPostcodeFormat(rectifiedCode);
      if (errCode === ErrEnum.errNone) {
        rectifiedCode = this.shortenPostcode(testCode);
      }
    }
  }

  return { postcode: rectifiedCode, errCode: errCode, desc: '' };
}

export const postcodeValidator = {
  verifyPostcodeFormat,
  shortenPostcode,
  rectifyPostcode
};
