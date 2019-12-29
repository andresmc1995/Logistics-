// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
export const EventBus = new Vue();
import App from './App'
import Login from '@/components/Login' 
import Transferencias from '@/components/Transferencias'
import Enviar from '@/components/Enviar'
import Home from '@/components/Home'
import TransferenciasOtros from '@/components/TransferenciasOtros'
import TransferenciasRechazadas from '@/components/TransferenciasRechazadas'
import router from './router'

Vue.config.productionTip = false

import Firebase from 'firebase'
import config from './config'
import {app} from './App'
import {db} from './App'


import { rtdbPlugin } from 'vuefire'
Vue.use(rtdbPlugin)

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2);
/* eslint-disable no-new */
Firebase.auth().onAuthStateChanged(function(user){
new Vue({
  el: '#app',
  router,
  components: { App, Login, Transferencias, Enviar, Home, TransferenciasOtros, TransferenciasRechazadas},
  template: '<App/>'
})
});
