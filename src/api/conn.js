const ModeEnum = Object.freeze({
  modeNone: 0,
  modeMainServer: 1,
  modeMockServer: 2
})

const defaultAddressesUrl = 'https://api.readingdev.com/rbc/getaddresses/';
const defaultCollectionsUrl = 'https://api.readingdev.com/api/collections/';

class RBCConnInfo {
  constructor (mode = ModeEnum.modeMainServer,
    addressesUrl = defaultAddressesUrl,
    collectionsUrl = defaultCollectionsUrl) {
    this.serviceMode = mode;
    this.addressesUrl = addressesUrl;
    this.collectionsUrl = collectionsUrl;
  }

  checkMode (mode) {
    // console.log(this.serviceMode === mode);
    return mode === this.serviceMode;
  }

  getAddressesUrl (postcode) {
    let url = this.addressesUrl + postcode;
    // console.log(url);
    return url;
  }

  getCollectionsUrl (uprn) {
    let url = this.collectionsUrl + uprn;
    // console.log(url);
    return url;
  }
}

export {
  ModeEnum,
  RBCConnInfo
}
