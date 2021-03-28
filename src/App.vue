<template>
  <div id="app">
    <template v-if="fun.isPhone()">
      <div style="text-align: center;margin-top: 45%;font-size: 20px;color: #409eff;">
        <div style="color: rgba(0,0,0,0.31)">
          <i class="el-icon-warning" style="font-size: 50px;margin-bottom: 15px"></i>
          <p style="margin-bottom: 15px;">请在电脑浏览器打开网页访问</p>
        </div>
        <p style="margin-bottom: 15px">e.yunqiankeji.com</p>
        <el-button  style="margin-bottom: 60px;width: 65%" v-clipboard:copy="'https://e.yunqiankeji.com'"  v-clipboard:success="onCopy"  v-clipboard:error="onError" type="primary" round plain>复制</el-button>
        <div style="width: 50%;margin: 0 auto">
          <img style="width: 100%" src="./assets/images/ad_img@2x.png" alt="">
        </div>
      </div>
    </template>

    <template v-else>
      <router-view />
    </template>

    <el-dialog title="" :visible.sync="$store.state.user.is_open_pwd" @close="closePwd">
      <div style="text-align:center;">
        <div style="font-size:50px;color:#ff7676;padding:50px 0">
          <i class="el-icon-warning"></i>
        </div>
        <div style="padding-bottom:50px;font-size:16px">
          提示：{{$store.state.user.tips_word}}
        </div>
        <div style="padding-bottom:50px">
          <el-button type="primary" @click="gotoChangePwd">
            修改密码
          </el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
    };
  },
  watch: {
    //监测路由变化
    $route(to, from) {
      if (to.meta.title) {
        this.fun.setTitle("芸签电子合同在线管理平台--"+ to.meta.title);
      } else {
        this.fun.setTitle("芸签电子合同在线管理平台");
      }
    }
  },
  created() {
    // this.is_tips = this.$store.state.user.is_open_pwd;
  },
  methods: {
    onCopy: function(e) {
      this.$message.success("复制成功")
    },
    onError: function(e) {
      this.$message.error("复制失败")
    },
    closePwd() {
      if(this.$route.name !== 'changePwd') {
        this.$router.push(this.fun.getUrl("Manage"));
      }
    },
    gotoChangePwd() {
      this.$store.dispatch("IsOpenPwd", false);
      this.$router.push(this.fun.getUrl("changePwd"));
    },
  },
};
</script>
