import Vue from 'vue'
import App from './App.vue'
import {
  createStore,
  applyMiddleWare
} from './../bin'

import VueStore from './../bin/vue'

const middleWares = applyMiddleWare(function (action) {
  return function (store) {
    if (action && typeof action === 'function') {
      return action(store)
    }
    return action
  }
})

const store = createStore({
  testModule: (state = { value: 1, flg: 1 }, action) => {
    switch (action.type) {
      case 1:
        return {
          ...state,
          value: action.action
        }
      case 2:
        return {
          ...state,
          flg: action.action
        }
    }
    return state
  }
}, middleWares)

Vue.config.productionTip = false

Vue.use(VueStore)

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
