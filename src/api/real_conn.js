import { RBCConnInfo } from './conn'
import axios from 'axios';

export const realConn = {
  connInfo: new RBCConnInfo(),
  findBinCollections: (connInfo, uprn) => {
    // connInfo should be passed from outside
    // With arrow functions, this is lexically bound
    // So don't use this to get connInfo here
    console.log(uprn);
    let url = connInfo.getCollectionsUrl(uprn);
    return new Promise((resolve, reject) => {
      axios.get(url).then((response) => {
        console.log(response);
        let data = response.data;
        if (data.success) {
          resolve({source: uprn, collections: data.collections});
        } else {
          console.log("No collection was found");
          resolve({source: uprn, collections: []});
        }
      }).catch((err) => {
        console.log(err);
        // Blocked by CORS policy, No 'Allow-Control-Allow-Origin'
        console.log("No collection was found (Access denied)");
        reject(new Error("No collection was found (Access denied)"));
      });
    });
  },
  getAddresses (connInfo, postcode) {
    // connInfo should be passed from outside
    // With arrow functions, this is lexically bound
    // So don't use this to get connInfo here
    console.log(postcode);
    let url = connInfo.getAddressesUrl(postcode);
    return new Promise((resolve, reject) => {
      // postcode should be ukpostcode without space
      axios.get(url).then((response) => {
        console.log(response);
        let data = response.data;
        if (data.Addresses) {
          resolve({source: postcode, addresses: data.Addresses});
        } else {
          console.log("No address was found");
          resolve({source: postcode, addresses: []});
        }
      }).catch((err) => {
        console.log(err);
        reject(new Error("Network error"));
      });
    });
  }
};
