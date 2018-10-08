const mpState = require('./mp-redux/index.js');
const userInfo = require('./model/userinfo.js');
const logs = require('./model/logs.js');

mpState.createStore({
  logs,
  userInfo
}, 'onShow')
//app.js
App({
  onLaunch: function () {
  }
})