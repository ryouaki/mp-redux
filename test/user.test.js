const actions = require('./../action/userinfo.js');
const model = require('./../model/userinfo.js');

test('1. init user information', () => {
  expect(model()).toEqual({
    userInfo: {
      nickName: '',
      avatarUrl: ''
    },
    hasUserInfo: false
  })
})

test('2. update user information', () => {
  expect(model({}, {
    type: actions.setUserInfo,
    data: {
      userInfo: {
        nickName: 'test name',
        avatarUrl: 'http://test.com/test.jpg'
      }
    }
  })).toEqual({
    userInfo: {
      nickName: 'test name',
      avatarUrl: 'http://test.com/test.jpg'
    }
  })
})

test('3. if has user information', () => {
  expect(model({}, {
    type: actions.setUserInfo,
    data: {
      hasUserInfo: true
    }
  })).toEqual({
    hasUserInfo: true
  })
})