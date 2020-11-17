<template>
  <div id="app">
    <button @click="clickHandle1">点我1</button>
    <button @click="clickHandle2">点我2</button>
    <button @click="clickHandle3">点我3</button>
    <button @click="clickHandle4">点我4</button>
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
    clickHandle4() {
      this.dispatch({ type: 2, action: 1 });
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
