<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div style="width: 100%;height: 50px;background-color: rgb(48, 65, 86);">
      <img v-if="$store.state.app.sidebar.opened" style="width: 100%;height: 50px" :src="$store.getters.globalData.pc_logo" alt="">
      <!--src="../../../../assets/images/logo.png"-->
      <img v-else style="width: 100%;height: 50px" :src="$store.getters.globalData.pc_logo" alt="">
      <!--src="../../../../assets/images/small_logo.png"-->
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
