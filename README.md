# vue-store
Vue-store是一款针对移动端领域的1kb状态管理工具。可以大大简化状态管理的复杂度与体积，针对性的满足移动端的状态管理需求

### 是否你需要使用它？
如果你也和我有同样的困惑，那么你就该尝试一下：
- 代码耦合严重，业务代码重复，往往改一处就会引起诸多功能也要跟着修改
- 业务逻辑都写在视图逻辑层，但是有苦于没有办法将业务代码剥离
- 代码越来越臃肿不堪
- 对老代码不敢碰，会影响很多业务逻辑

### 为什么借鉴redux
- 用为redux是框架无关的，所以具有更好的可移植性，当然我这里在内部还是做了一些"猥琐"处理来兼容多平台
- 单一数据源，让状态更容易被跟踪
- 将业务逻辑与视图层分离，让代码更清晰，耦合更低
- 状态都应该放在页面的根容器去管理，分发到各个子组件。以便更好的控制业务逻辑
- 业务逻辑都放入model中，而model都是纯函数，让测试更加容易

### 如何使用？
拷贝 /bin/index.js文件到项目中引入即可。开包即用。

### 为什么没有使用npm?
懒

### api使用方法

1. 在系统入口我们必须初始化store
```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import {
  createStore,
  applyMiddleWare
} from './../bin'

import VueStore from './../bin/vue'

// 使用中间件 
const middleWares = applyMiddleWare(function (action) {
  return function (store) {
    if (action && typeof action === 'function') {
      return action(store)
    }
    return action
  }
})

// 初始化Store
const store = createStore({
  testModule: (state = { value: 1, flg: 1 }, action) => {
    switch (action.type) {
      case 1:
        return {
          ...state,
          value: action.action
        }
      case 2:
        return {
          ...state,
          flg: action.action
        }
    }
    return state
  }
}, middleWares)

Vue.config.productionTip = false

// 注册Store插件
Vue.use(VueStore)

new Vue({
  render: h => h(App),
  store // 绑定Store
}).$mount('#app')
```

2. 在Vue中使用
```vue
// app.vue
<template>
  <div id="app">
    <button @click="clickHandle1">点我1</button>
    <button @click="clickHandle2">点我2</button>
    <button @click="clickHandle3">点我3</button>
    <Test-Comp />
    <Test-Comp v-if="flg === 1" />
  </div>
</template>
<script>
import TestComp from "./Comp";

export default {
  components: { TestComp },
  name: "App",
  mapStoreToState(state) {
    return {
      flg: state.testModule.flg,
    };
  },
  created() {
    console.log("root mixin");
  },
  methods: {
    clickHandle1() {
      this.dispatch({ type: 1, action: 2 });
    },
    clickHandle2() {
      this.dispatch((store) => {
        setTimeout(() => {
          // console.log(args)
          store.dispatch({ type: 1, action: 3 });
        }, 100);
      });
    },
    clickHandle3() {
      this.dispatch({ type: 2, action: 2 });
    },
  },
};
</script>
```

3. 组件中使用状态
```vue
// Comp.vue
<template>
  <div>
    {{ test }}
  </div>
</template>
<script>
export default {
  mapStoreToState(state) {
    return {
      test: state.testModule.value,
    };
  },
};
</script>
```
