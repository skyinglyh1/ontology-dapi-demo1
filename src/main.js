// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {Button, message, Modal} from 'ant-design-vue'
import { client } from 'ontology-dapi'
import {} from 'ontology-ts-sdk'

client.registerClient({})

Vue.config.productionTip = false

Vue.component(Button.name, Button)
Vue.component(Modal.name, Modal)

Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$success = Modal.success
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
