<template>
  <div
    v-loading="loading"
    v-loading.fullscreen.lock="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 1)"
  ></div>
</template>
<script>
export default {
  data() {
    return {
      loading: "加载中"
    };
  },
  created() {
    this.currentChange();
  },
  methods: {
    //分页
    currentChange() {
      this.$router.push(this.fun.getUrl("set_template"));
    }
  }
};
</script>
