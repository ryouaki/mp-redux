const mpState = require('./../../mp-redux/index.js');
const userActions = require('./../../action/userinfo.js');
const logActions = require('./../../action/logs.js');
//index.js
//获取应用实例
const app = getApp()

Page(mpState.connect((state) => {
  // debugger
  return {
    userInfo: state.userInfo.userInfo,
    hasUserInfo: state.userInfo.hasUserInfo
  }
} ,{
  data: {
    currentInputValue: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        this.dispatch({
          type: userActions.setUserInfo,
          data: {
            userInfo: res.userInfo,
            hasUserInfo: true
          }
        })
      }
    })
  },
  bindKeyInput(e) {
    this.setData({
      currentInputValue: e.detail.value
    })
  },
  submitLog() {
    this.dispatch({
      type: logActions.addLogs,
      data: this.data.currentInputValue
    })
    this.setData({
      currentInputValue: ''
    })
  },
  getUserInfo(e) {
    this.dispatch({
      type: userActions.setUserInfo,
      data: {
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      }
    })
  }
}))
