const modules = {}
const finalState = {}

function getState() {
  return finalState
}

function createStore(reducers, injectStore) {
  if (injectStore && typeof injectStore === 'function') {
    return injectStore(createStore)(reducers)
  }

  if (reducers && typeof reducers === 'object') {
    const keys = Object.keys(reducers);
    const len = keys.length;

    for (let i = 0; i < len; i++) {
      const key = keys[i];
      if (Object.prototype.hasOwnProperty.call(reducers, key) && typeof reducers[key] === 'function') {
        modules[key] = reducers[key];
      }
    }
  }
  dispatch({ type: '@didi/MINI-H5-STORE/INIT' })

  return {
    getState,
    dispatch
  }
}

function applyMiddleWare(...middleWares) {
  return function (createStore) {
    return function (modules) {
      const store = createStore(modules);

      return {
        ...store,
        dispatch: middleWares.length > 0 ? function (action) {
          return middleWares.reduce(function (init, cb) {
            return cb(init)(store)
          }, store.dispatch(action))
        } : store.dispatch
      }
    }
  }
}

function dispatch(action) {
  if (action && typeof action === 'function') {
    return action
  }

  const keys = Object.keys(modules);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const currentReduce = modules[key];
    const currentState = finalState[key];

    const newState = currentReduce(currentState, action);

    finalState[key] = newState;
  }

  return action
}

export {
  getState,
  createStore,
  applyMiddleWare,
  dispatch
}
