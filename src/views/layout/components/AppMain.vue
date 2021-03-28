<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
    <el-popover
      placement="left-end"
      width="220" height="200"
      trigger="hover">
      <div class="code">
        <img :src="imgUrl" alt="">
      </div>
      <div class="service" slot="reference"><i class="iconfont icon-all_service"></i></div>
    </el-popover>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      imgUrl: ''
    }
  },
  created(){
    if(localStorage.getItem("setPublicSetting") && JSON.parse(localStorage.getItem("setPublicSetting")).ercode_img) {
      this.imgUrl = JSON.parse(localStorage.getItem("setPublicSetting")).ercode_img
    }
  },
  methods: {},
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.service {
  position: fixed;
  z-index: 10;
  right: 20px;
  bottom: 180px;
}
.code img{
  width: 200px;
  height: 200px;
}
.icon-all_service{
  cursor: pointer;
  font-size: 40px;
  color: #0092ff;
}
</style>

