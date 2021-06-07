// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core';
// internal icons
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import { Button, Input, Field } from 'buefy'
import * as VeeValidate from 'vee-validate'

import App from './App'
import router from './router'

Vue.config.productionTip = false
// Vue.config.productionTip = true
library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon);

/* eslint-disable no-new */
Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: 'fas',
  customIconPacks: {
    fas: {
      sizes: {
        default: "lg",
        "is-small": "1x",
        "is-medium": "2x",
        "is-large": "3x"
      },
      iconPrefix: ""
    }
  }
})
// Vue.use(Button)
// Vue.use(Input)
// Vue.use(Field)
// Vue.component(Buefy.Button.name, Buefy.Button);
// Vue.component(Buefy.Input.name, Buefy.Input);
// Vue.component(Buefy.Field.name, Buefy.Field);
Vue.use(VeeValidate, {
  events: ''
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
