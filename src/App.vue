<template>
  <div id="app">
    <img src="./assets/logo.png">
    <section>
      <div id="myform">
        <div id="myquestion">
          <b-field label="What is your postcode?"
            :type="getPostcodeFieldStatusType()" v-bind:message="postcodeComment">
            <b-input id="postcode" @keyup.native.exact="monitorPostcodeEnterKey"
              type="text"
              v-model="postcode" maxlength="8"
              autocomplete="off"
              :loading="isAddressSelectLoading"
              placeholder="e.g. RG1 2AR"></b-input>
            <p class="control">
              <b-button type="is-primary" :label="isAddressFindDisabled() ? '' : 'Find Address'"
                :size="isAddressFindDisabled() ? 'is-small' : ''"
                :icon-left="isAddressFindCompleted() ? 'check': 'search'"
                :disabled="isAddressFindDisabled()"
                @click="searchAddresses"/>
            </p>
          </b-field>
          <b-field label="Select address:"
            :type="getAddressFieldStatusType()"
            v-bind:message="addressFieldComment">
            <b-select id="address"
              v-model="address"
              @input="monitorAddressSwitch"
              :disabled="isAddressSelectDisabled()"
              v-bind:placeholder="addressSelectPlaceHolder">
              <option
                v-for="address in addresses"
                :value="address"
                :key="address.AccountSiteUprn">
                {{ address.SiteShortAddress }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div id="myenquiry">
          <b-button rounded type="is-danger" @click="submitEnquiry"
            :disabled="isEnquirySubmitDisabled()"
            :size="isEnquirySubmitDisabled() ? '' : 'is-medium'"
            :icon-left="isEnquirySubmitCompleted() ? 'check' : 'search'"
            >Check Collection Service</b-button>
          <b-loading :is-full-page=true v-model="isCollectionsLoading"
            :can-cancel="true"></b-loading>
        </div>
      </div>
      <div id="myresult">
        <b-field>
          <b-switch v-model="displayMoreCheckbox">Display all possible days</b-switch>
        </b-field>
        <div v-if="displayMoreCheckbox" id="myfilter">
          <b-field>
            <b-switch v-model="domesticWasteCheckbox"
              @input="updateFilterCollections()">Domestic Waste</b-switch>
            <b-switch v-model="foodWasteCheckbox"
              @input="updateFilterCollections()">
              Food Waste
            </b-switch>
            <b-switch v-model="recyclingCheckbox"
              @input="updateFilterCollections()">
              Recycling
            </b-switch>
          </b-field>
        </div>
        <div v-if="isResultTableDisabled()">
          <b-field label="Enquiry Results"
            :label-position=labelPosition>
            <b-input :value="enquiryResult" maxlength="40"
            type="textarea"
            readonly></b-input>
          </b-field>
        </div>
        <div v-else>
          <b-table :data="filterCollections" :columns="resultTableColumns">
          </b-table>
        </div>
      </div>
    </section>
    <router-view/>
  </div>
</template>

<script>
// import store from './store';
// import { inject } from 'vue';
import { getAddresses, getPostcodeAddresses, findBinCollections } from './api/rbc_api';
import { realConn } from './api/real_conn';
import { ErrEnum } from './bc_defines';
import { postcodeValidator } from './utils/postcode_validator';
import { getDateRange } from './utils/time_utils';
import { filterBinCollectionsByTimeRange } from './utils/collection_utils';

// const blankAddressPlaceHolder = '----- ----- ----- ----- ----- ----- -----';
const blankAddressPlaceHolder = '                                  ';

export default {
  name: 'App',

  methods: {
    getDisplayCollections () {
      if (this.displayMoreCheckbox) {
        return this.collections;
      } else {
        return this.filterCollections;
      }
    },
    updateFilterCollections () {
      // console.log("updateFilterCollection");
      this.filterCollections = [];
      this.collections.forEach((item, index, array) => {
        if (item.service.match("Domestic Waste")) {
          if (this.domesticWasteCheckbox) {
            this.filterCollections.push(item);
          }
        } else if (item.service.match("Food Waste")) {
          if (this.foodWasteCheckbox) {
            this.filterCollections.push(item);
          }
        } else if (item.service.match("Recycling")) {
          if (this.recyclingCheckbox) {
            this.filterCollections.push(item);
          }
        }
      })
    },
    submitEnquiry () {
      this.isCollectionsLoading = true;
      // this.$buefy.notification.open('Clicked!!')
      console.log(this.rbcConn);
      findBinCollections(this.rbcConn, this.uprn).then((resp) => {
        // to kick out the delayed async call result
        if (resp.source === this.uprn) {
          this.collections = resp.collections;

          let range = getDateRange();
          this.weeklyCollections = filterBinCollectionsByTimeRange(this.collections,
            range.startDateTime, range.endDateTime);

          let msg = '';
          this.weeklyCollections.forEach((item, index, array) => {
            // msg = 'Next Collection Date Time: ' + item.date;
            // this.$buefy.notification.open(msg);
            msg += item.read_date + " - " + item.service + "\n";
          });

          this.updateFilterCollections();
          // "UPRN:" + this.uprn
          this.enquiryResult = "Bin Collections for the next 7 days\n" + msg;
          // alert('Timeout')
        }
        this.isCollectionsLoading = false;
      }).catch((err) => {
        this.enquiryResult = err.message;
        // this.enquiryResult = "No collection was found";
        this.isCollectionsLoading = false;
      });
    },
    updateAddressSelect (addresses) {
      if (addresses && addresses.length > 0) {
        this.addressSelectPlaceHolder = 'Please select...';
        this.addressFieldComment = "";
        this.addresses = addresses;
      } else {
        this.addressSelectPlaceHolder = blankAddressPlaceHolder;
        this.addressFieldComment = "";
        this.addresses = [];
      }
      this.address = null; // set binded value null to show place holder
      this.uprn = null;
      // console.log(this.addresses)
    },
    clearAddressSelect () {
      this.updateAddressSelect([]);
    },
    getPostcodeFieldStatusType () {
      if (this.lastPostcodeErr === ErrEnum.errNone &&
        this.addresses.length > 0) {
        return 'is-success';
      } else if (this.lastPostcodeErr === ErrEnum.errInvalidChar) {
        return 'is-danger';
      } else if (this.lastPostcodeErr === ErrEnum.errNoValidAddr) {
        return 'is-warning';
      } else if (this.lastPostcodeErr !== ErrEnum.errNone) {
        return '';
      }
      return '';
    },
    isAddressFindDisabled () {
      return (this.lastPostcodeErr !== ErrEnum.errNone);
    },
    isAddressSelectDisabled () {
      return (this.addresses && this.addresses.length > 0) === false;
    },
    isEnquirySubmitDisabled () {
      return (this.uprn === null);
    },
    isAddressFindCompleted () {
      return (this.addresses && this.addresses.length > 0);
    },
    isEnquirySubmitCompleted () {
      return (this.enquiryResult && this.enquiryResult.length > 0);
    },
    isResultTableDisabled () {
      if (this.hasCollections() === false) {
        return true;
      }
      return this.displayMoreCheckbox === false;
    },
    hasCollections () {
      return (this.collections && this.collections.length > 0);
    },
    getAddressFieldStatusType () {
      // console.log(this.uprn);
      // return (this.uprn !== null && this.uprn.length);
      return '';
    },
    searchAddresses () {
      this.isAddressSelectLoading = true;
      let rectified = postcodeValidator.rectifyPostcode(this.postcode);

      if (rectified.errCode === ErrEnum.errNone) {
        getAddresses(this.rbcConn, rectified.postcode).then((resp) => {
          if (resp.addresses.length > 0) {
            this.updateAddressSelect(resp.addresses);
          } else {
            this.clearAddressSelect();
            this.updatePostcordErr(ErrEnum.errNoValidAddr);
          }
          this.isAddressSelectLoading = false;
        }).catch((err) => {
          console.log(err);
          this.clearAddressSelect();
          this.updatePostcodeErr(ErrEnum.errNoValidAddr);
          this.isAddressSelectLoading = false;
        });
      }
      this.clearEnquiryResults();
    },
    updatePostcodeErr (errCode) {
      this.lastPostcodeErr = errCode;
      if (errCode === ErrEnum.errTooShort) {
        this.postcodeComment = "Keep typing to find your address";
      } else if (errCode === ErrEnum.errInvalidChar) {
        this.postcodeComment = "Please type valid postcode with a-z, A-Z, 0-9 and space only";
      } else if (errCode !== ErrEnum.errNone) {
        this.postcodeComment = "Please type valid postcode to find your address";
      } else {
        this.postcodeComment = "";
      }
    },
    monitorPostcodeEnterKey (evt) {
      let validator = postcodeValidator;
      let errCode = validator.verifyPostcodeFormat(evt.target.value);
      // console.log(errCode);
      this.updatePostcodeErr(errCode);
      this.clearAddressSelect();
      this.clearEnquiryResults();
    },
    clearEnquiryResults () {
      this.enquiryResult = '';
      this.collections = [];
      this.weeklyCollections = [];
      this.filterCollections = [];
    },
    monitorPostcodeEnterKeyWithAutoSearch (evt) {
      // alert(evt.target.value);
      this.enquiryResult = "";
      this.clearEnquiryResults();
      let validator = postcodeValidator;
      getPostcodeAddresses(this.rbcConn, evt.target.value, validator).then((resp) => {
        console.log('%s vs %s', resp.source, this.postcode);
        // to kick out the delayed async call result
        if (resp.source === this.postcode) {
          if (resp.addresses.length > 0) {
            this.updateAddressSelect(resp.addresses);
            this.postcodeComment = "Keep typing to find your address";
          } else {
            this.postcodeComment = "Please type valid postcode to find your address";
            this.clearAddressSelect();
          }
        }
      }).catch((err) => {
        // console.log(err);
        if (err.errCode && err.errCode === ErrEnum.errInvalidChar) {
          this.postcodeComment = "Keep typing to find address (accepts A-Z, a-z or 0-9 only)";
        } else {
          this.postcodeComment = "Keep typing to find address";
        }
        this.clearAddressSelect();
      });
    },
    monitorAddressSwitch (address) {
      if (address) {
        this.uprn = address.AccountSiteUprn;
        this.addressFieldComment = "Unique Property Ref#: " + this.uprn;
        // postcode = getPostcodeFromAddress(this.address.SiteShortAddress);
        // this.postcodeComment = "The postcode is valid";
      } else {
        this.uprn = null;
        this.addressFieldComment = "";
      }
    }
  },

  // uprn can be null for the b-select as a placeholder workaround
  data () {
    return {
      rbcConn: realConn,
      postcode: '',
      lastPostcodeErr: ErrEnum.errTooShort,
      address: null,
      uprn: null,
      collectionDetail: 'No Collection Info',
      postcodeComment: '',
      addresses: [
      ],
      collections: [
      ],
      weeklyCollections: [

      ],
      filterCollections: [
      ],
      resultTableColumns: [
        {
          field: 'service',
          label: 'Service Type',
        },
        {
          field: 'date',
          label: 'Date',
        }
      ],
      addressFieldComment: '',
      addressDetail: 'No Address Info',
      uprnResult: 'No UPRN',
      enquiryResult: '',
      labelPosition: 'on-border',
      addressSelectPlaceHolder: blankAddressPlaceHolder,
      isAddressSelectLoading: false,
      isCollectionsLoading: false,
      displayMoreCheckbox: false,
      domesticWasteCheckbox: true,
      foodWasteCheckbox: true,
      recyclingCheckbox: true
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin: 30px;
}
#myform {
  margin: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
}
#myquestion {
  margin: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: left;
}
#myenquiry {
  margin: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: left;
}
#myresult {
  margin-top: 10px;
  margin-bottom: 30px;
  margin: 30px;
  text-align: left;
}
#myfilter {
  margin: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: left;
}
</style>
<style scoped>
  @import "https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css";
  @import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";
</style>
