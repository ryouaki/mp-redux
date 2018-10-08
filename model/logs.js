const actions = require('./../action/logs.js');

const initState = {
  logs: []
}

module.exports = function (state = initState, action = {}) {
  const newState = { ...state };
  switch (action.type) {
    case actions.addLogs:
      const now = new Date();
      newState.logs.push({
        time: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
        value: action.data
      });
      return newState;
    case actions.clearLogs:
      newState.logs = [];
      return newState;
    default:
      return newState;
  }
}
