import Vue from 'vue'
import Vuex from 'vuex';

// import { reactive } from 'vue';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    addresses: [],
    collections: [],
    addressDataLoading: false,
    collectionDataLoading: false
  },
  mutations: {
    UPDATE_ADDRESS_DATA (state, payload) {
      const {data} = payload;
    },
    UPDATE_WEEKLY_COLLECTION_DATA (state, payload) {
      const {data} = payload
    },
    SET_ADDRESS_DATA_LOADING (state, payload) {
      state.addressDataLoading = payload
    },
    SET_COLLECTION_DATA_LOADING (state, payload) {
      state.collectionDataLoading = payload
    }
  },
  actions: {
    getPostAddresses ({ commit }, postcode) {
      commit('SET_ADDRESS_DATA_LOADING', true);
      let url = 'https://api.readingdev.com/rbc/getaddresses/' + postcode;
      axios.get(url).then((response) => {
        commit('UPDATE_ADDRESS_DATA', response.data);
        commit('SET_ADDRESS_DATA_LOADING', false);
      });
    },
    findBinCollections ({ commit }, uprn) {
      let url = 'https://api.readingdev.com/api/collections/' + uprn;
      axios.get(url).then((response) => {
        commit('UPDATE_COLLECTION_DATA', response.data);
      });
    }
  },
  getters: {
    addressses: state => state.addresses,
    collections: state => state.collections
  }
});
