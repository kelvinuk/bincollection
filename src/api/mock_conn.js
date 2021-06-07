import { RBCConnInfo } from './conn'
import { seedAddressData, seedBinCollnData } from './seed_test.js';

export const mockConn = {
  connInfo: new RBCConnInfo(mode = ModeEnum.modeMockServer),
  findBinCollections: (connInfo, uprn) => {
    let data = seedBinCollnData.find((binCollnObj) => {
      return binCollnObj.uprn === uprn;
    });
    console.log(data);
    if (data && data.hasOwnProperty('success') && data.hasOwnProperty('collections')) {
      if (data.success) {
        resolve({source: uprn, collections: data.collections});
      } else {
        console.log("No collection was found");
        reject(new Error("No collection was found"));
      }
    } else {
      console.log("No collection was found");
      reject(new Error("No collection was found"));
    }
  },
  getAddresses: (connInfo, postcode) => {
    // console.log(seedAddressData);
    let data = seedAddressData.find((addressObj) => {
      return addressObj.postcode === postcode;
    });
    if (data && data.hasOwnProperty('Addresses')) {
      console.log(data);
      resolve({source: postcode, addresses: data.Addresses});
    } else {
      reject(new Error("Unknown error"));
    }
  }
};
