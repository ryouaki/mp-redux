function initMpState () {
  const reducers = {};
  const finalState = {};
  const listeners = [];
  let injectMethod = null;

  function getStore() {
    return finalState;
  }

  function createStore(modules, injectFunc) {
    if (injectFunc && typeof injectFunc === 'string') {
      injectMethod = injectFunc;
    }
    if (modules && typeof modules === 'object') {
      const keys = Object.keys(modules);
      const len = keys.length;

      for (let i = 0; i < len; i++) {
        const key = keys[i];
        if (modules.hasOwnProperty(key) && typeof modules[key] === 'function') {
          reducers[key] = modules[key];
        }
      }
    }
    dispatch({type: '@MPSTATE/INIT'});
  }

  function dispatch(action) {
    // debugger
    const keys = Object.keys(reducers);
    const len = keys.length;
    
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      const currentReduce = reducers[key];
      const currentState = finalState[key];

      const newState = currentReduce(currentState, action);

      finalState[key] = newState;
    }

    if (this) {
      const componentState = this.mapStoreToState(finalState) || {};

      if (this.setData) { // 小程序
        this.setData({ ...componentState })
      } else if (this.setState) { // react什么的吧
        this.setState({ ...componentState })
      } else { // VUE
        const propKeys = Object.keys(componentState);
        for ( let i = 0; i < propKeys.length; i++) {
          this[propKeys[i]] = componentState[propKeys[i]];
        }
      }
    }
  }

  function connect(mapStoreToState, component) {
    if (!component || typeof component !== 'object') {
      throw new Error('mpState[connect]: Component must be a Object!');
    }

    if (!mapStoreToState || typeof mapStoreToState !== 'function') {
      throw new Error('mpState[connect]: mapStoreToState must be a Function!');
    }

    const newComponent = { ...component };

    const data = component.data || {};

    const extraData = mapStoreToState(finalState);

    if (!extraData || typeof extraData !== 'object') {
      throw new Error('mpState[connect]: mapStoreToState must return a Object!');
    }

    let newData = null;

    if (typeof data === 'function') {
      newData = {
        ...data(),
        ...extraData
      }
    } else {
      newData = {
        ...data,
        ...extraData
      }
    }

    if (newData) {
      newComponent.data = newData;
    }

    const injectFunc = component.getInjectMethod;

    const methods = component.methods || {};

    const newLiftMethod = injectFunc && injectFunc() || injectMethod;
    const oldLiftMethod = component[newLiftMethod];

    methods.dispatch = dispatch;

    newComponent.methods = methods;
    newComponent.dispatch = dispatch;
    newComponent.mapStoreToState = mapStoreToState;

    if (newLiftMethod) {
      newComponent[newLiftMethod] = function() {
        if (this) {
          this.dispatch({});
          oldLiftMethod && oldLiftMethod.call(this, arguments);
        }
      }
    }

    return newComponent;
  }

  return {
    createStore,
    dispatch,
    connect,
    getStore
  }
}

module.exports = initMpState();