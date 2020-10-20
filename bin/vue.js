
const listeners = []
function VueAdapter() {
  return {
    install(Vue) {
      const defineReactive = Vue.util.defineReactive
      Vue.mixin({
        beforeCreate() {
          let mapStoreToState = this.$options.mapStoreToState

          if (mapStoreToState) {
            listeners.push({
              listen: mapStoreToState,
              ctx: this
            })

            this.$$removeListener = () => {
              const idx = listeners.findIndex((item) => {
                return item.ctx == this
              })
              listeners.splice(idx, 1)
            }
          }
        },
        created() {
          let getState = this.$root.$options.store.getState
          let dispatch = this.$root.$options.store.dispatch

          this.dispatch = function (action) {
            if (typeof action === 'function') {
              action({ dispatch: this.dispatch.bind(this), getState })
            } else {
              dispatch(action)

              listeners.forEach((item) => {
                const newState = item.listen(getState()) || {}
                const keys = Object.keys(newState)
                keys.forEach((key) => {
                  item.ctx[key] = newState[key]
                })
              })
            }
          }.bind(this)

          let mapStoreToState = this.$options.mapStoreToState
          if (mapStoreToState) {
            const newState = mapStoreToState.call(this, getState())
            Object.keys(newState).forEach((prop) => {
              defineReactive(this, prop, newState[prop]);
            })
          }
        },
        beforeDestroy() {
          if (this.$$removeListener) {
            this.$$removeListener()
          }
        }
      })
    }
  }
}

export default VueAdapter()