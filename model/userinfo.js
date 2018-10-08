const actions = require('./../action/userinfo.js');

const initState = {
  userInfo: {
    nickName: '',
    avatarUrl: ''
  },
  hasUserInfo: false
}

module.exports = function (state = initState, action = {}) {
  switch(action.type) {
    case actions.setUserInfo: 
      const newState = { ...state, ...action.data };
      return newState;
    default:
      return state;
  }
}
