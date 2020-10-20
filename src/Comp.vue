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