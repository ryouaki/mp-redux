# mp-redux
一个用于小程序和轻量级H5应用的状态管理工具， 使用方法是一个简化版本的Redux。之所以是适用于轻量级应用，主要是因为没有实现组件间的数据共享。因此不适合于复杂，巨大的前端应用。

### 是否你需要使用它？
如果你也和我有同样的困惑，那么你就该使用它：
- 代码耦合严重，业务代码重复，往往改一处就会引起诸多功能也要跟着修改
- 业务逻辑都写在视图逻辑层，但是有苦于没有办法将业务代码剥离
- 代码越来越臃肿不堪

### 为什么借鉴redux
- 用为redux是框架无关的，所以具有更好的可移植性，当然我这里在内部还是做了一些"猥琐"处理来兼容多平台
- 单一数据源，让状态更容易被跟踪
- 将业务逻辑与视图层分离，让代码更清晰，耦合更低
- 状态都应该放在页面的根容器去管理，分发到各个子组件。以便更好的控制业务逻辑
- 业务逻辑都放入model中，而model都是纯函数，让测试更加容易(其实就是reduce)

### 如何使用？
拷贝 /mp-redux/index.js文件到项目中引入即可。开包即用。

### 为什么没有使用npm?
懒

### api使用

1. 在系统入口我们必须初始化store
```js
  const mpState = require('./mp-redux/index.js');
  const userInfo = require('./model/userinfo.js');
  const logs = require('./model/logs.js');

  mpState.createStore({
    logs, // 这些model 就是redux的reduce，必须是纯函数，并且需要返回一个纯对象
    userInfo // 这些model 就是redux的reduce，必须是纯函数，并且需要返回一个纯对象
  }, 'onShow') // 第二个参数是劫持的生命周期函数，这是为了解决不同平台的差异性问题导致的。后期会考虑优化
```

2. 创建model
```js
  // model 就是数据模型，是根据业务而来的
  // model/userinfo.js
  const actions = require('./../action/logs.js'); // 这里同样采用了redux的action机制

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
  // action/userinfo.js
  module.exports = {
    addLogs: 'LOGS_ADD',
    clearLogs: 'LOGS_CLEAR'
  }
```

3. 在Page中使用
```js
  // 使用connect来注入需要订阅的状态，并且mp-redux会在页面对象中自动注入dispatch方法 
  const mpState = require('./../../mp-redux/index.js');
  const util = require('../../utils/util.js');
  const logActions = require('./../../action/logs.js');

  Page(mpState.connect((state) => {
    return {
      userInfo: state.userInfo.userInfo,
      logs: state.logs.logs
    }
  },
  { // 在这里所有的业务数据都保存在store中，所以页面如果只有业务数据的话，是不需要data属性的。
    clearLogs() {
      this.dispatch({ // 通过dispatch方法来发出action，从而更新store中的数据
        type: logActions.clearLogs
      })
    }
  }))
```

4. 更容易被测试的业务代码
从上面我们将业务数据声明到model中，而所有的业务数据更新以及业务数据更新的逻辑都在model中完成(参考/model/logs.js)。而model都是纯函数，因此业务代码更加容易被测试。
```js
  // 不要吐槽，，，，，，我第一次写测试用例。(-_-)
  const actions = require('./../action/logs.js');
  const model = require('./../model/logs.js');

  test('1. init logs data', () => {
    expect(model()).toEqual({
      logs: []
    })
  })

  test('2. add new log into empty logs', () => {
    const newState = model(undefined, {
      type: actions.addLogs,
      data: "Test new log"
    });

    expect({
      value: newState.logs[0].value,
      len: newState.logs.length
    }).toEqual({
      value: "Test new log",
      len: 1
    });
  })

  test('3. add new log into logs', () => {
    const newState = model({logs: [{time: '00:00:00', value: 'the first log'}]}, {
      type: actions.addLogs,
      data: "the second log"
    });

    expect({
      log1: newState.logs[0].value,
      log2: newState.logs[1].value,
      len: newState.logs.length
    }).toEqual({
      log1: "the first log",
      log2: "the second log",
      len: 2
    });
  })

  test('4. clear all logs', () => {
    const newState = model({ logs: [
      { time: '00:00:00', value: 'log1' }, 
      { time: '00:00:00', value: 'log2' }
      ] }, {
        type: actions.clearLogs
      });

    expect({
      len: newState.logs.length
    }).toEqual({
      len: 0
    });
  })
```

因为互联网产品都是toC业务，UI基本上每天都在变化，但是业务的变化其实是很小的。我们通过将业务建模，在前端构建业务数据模型。而这些模型是可以预知的。因此也就可测试。
而对于一些互联网产品，前端测试是一件非常繁琐而复杂的事情。因此这个简单的方案大大的降低了前端代码变动引起的风险，而增加的工作量也并不是很大。可以一定程度上降低业务代码的回归测试成本。