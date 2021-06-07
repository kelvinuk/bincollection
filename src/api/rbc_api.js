
import { PostcodeError, ErrEnum } from '../bc_defines';
import { ModeEnum } from './conn.js';

function getAddresses (conn, postcode) {
  return conn.getAddresses(conn.connInfo, postcode);
}

function findBinCollections (conn, uprn) {
  return conn.findBinCollections(conn.connInfo, uprn);
}

function getPostcodeAddresses (conn, postcode, validator) {
  return new Promise((resolve, reject) => {
    let rectified = validator.rectifyPostcode(postcode);

    if (rectified.errCode !== ErrEnum.errNone) {
      reject(new PostcodeError("Validation Error", rectified.errCode));
    } else {
      this.uprn = null;
      if (rectified.postcode !== '') {
        getAddresses(conn, rectified.postcode).then((resp) => {
          resolve({source: postcode,
            rectifiedPostcode: resp.source,
            addresses: resp.addresses});
        }).catch((err) => {
          reject(err);
        });
      }
    }
  });
}

export {
  getAddresses,
  getPostcodeAddresses,
  findBinCollections
}
