const mpState = require('./../../mp-redux/index.js');
const util = require('../../utils/util.js');
const logActions = require('./../../action/logs.js');

Page(mpState.connect((state) => {
  return {
    userInfo: state.userInfo.userInfo,
    logs: state.logs.logs
  }
},
{
  clearLogs() {
    this.dispatch({
      type: logActions.clearLogs
    })
  }
})
)