<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!--<template>-->
        <!--<error-log class="errLog-container right-menu-item" />-->

        <!--<el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="right-menu-item"/>
        </el-tooltip>-->

        <!--<el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="right-menu-item"/>
        </el-tooltip>-->

        <!--<lang-select class="right-menu-item"/>

        <!--<el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-picker right-menu-item"/>
        </el-tooltip>-->
      <!--</template>-->
      <div>当前用户：{{ userInfo.name }}</div>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img
            :src="
              userInfo.avatar ||
                'https://www.yunzmall.com/min_img/img/yht_adminimg.png'
            "
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t("navbar.dashboard") }}
            </el-dropdown-item>
          </router-link>
          <!--<el-dropdown-item @click.native.prevent="is_edit_info = true">-->
            <!--个人信息-->
          <!--</el-dropdown-item>-->
          <!--<el-dropdown-item @click.native.prevent="clear">-->
            <!--清除缓存-->
          <!--</el-dropdown-item>-->
          <!--<a-->
          <!--target="_blank"-->
          <!--href="https://github.com/PanJiaChen/vue-element-admin/"-->
          <!--&gt;-->
          <!--<el-dropdown-item>-->
          <!--{{ $t("navbar.github") }}-->
          <!--</el-dropdown-item>-->
          <!--</a>-->
          <!--<el-dropdown-item divided>-->
            <!--<span style="display:block;" @click.stop="logout">-->
              <!--{{ $t("navbar.logOut") }}-->
            <!--</span>-->
          <!--</el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="设置密码" :visible.sync="is_edit_info" :close-on-click-modal="false" :show-close="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="20%">
        <!--<el-form-item label="用户名" prop="username">-->
          <!--<el-input-->
            <!--style="width: 80%"-->
            <!--type="text"-->
            <!--v-model="form.username"-->
          <!--&gt;</el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="手机号" prop="mobile">
          <el-input
            style="width: 80%"
            type="text"
            v-model="mobile"
            disabled
          ></el-input>
        </el-form-item>
        <!--<el-form-item label="原密码" prop="old_password">-->
          <!--<el-input-->
            <!--style="width: 80%"-->
            <!--type="text"-->
            <!--v-model="form.old_password"-->
          <!--&gt;</el-input>-->
          <!--<div class="tip">不填则不修改密码</div>-->
        <!--</el-form-item>-->
        <el-form-item label="密码" prop="password">
          <el-input
            style="width: 80%"
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="re_password"
        >
          <el-input
            style="width: 80%"
            type="password"
            placeholder="请确认密码"
            v-model="form.re_password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="is_edit_info = false">取 消</el-button>-->
        <el-button type="primary" @click="changePwd()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import LangSelect from "@/components/LangSelect";
import ThemePicker from "@/components/ThemePicker";

export default {
  created() {
    this.getUser();
    this.mobile = localStorage.getItem("siteMobile")
    // this.getLoginSite();
  },
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      is_edit_info: false,
      userInfo: {},
      mobile: "",
      form: {},
      rules: {
        // old_password: [
        //   { required: true, trigger: "blur", message: "请输入原密码" }
        // ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        re_password: [
          { validator: validatePass2, required: true, trigger: "blur" }
        ]
      }
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar", "device"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    clear() {
      $http
        .get("/admin/clear", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.$message.success("清除成功!");
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getUser() {
      this.loading = true;
      this.$store.dispatch("GenerateRoutes", {company: 1, api: 1});
      this.userInfo = {
        "name": "测试",
          "status": 1,
          "company_name": "测试测试有限公司",
          "company_status": 1,
          "has_set_pwd": 1,
          "is_legal": 1,
          "pc_title": " 测试测试在线管理平台",
          "pc_logo": "",
          "pc_favorite_icon": "",
          "pc_login_left_banner": "",
          "show_yq_api_used": 1
      }
      this.$store.dispatch("setUserInfo", this.userInfo);
      this.$store.dispatch('setGlobal', this.userInfo);

    },
    getLoginSite() {
      $http
        .get("/admin/login/site", {})
        .then(response => {
          if (response.result === 1) {
            this.fun.setIcon(response.data.title_icon);
          } else {
            MessageBox.alert(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePwd() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          $http
            .post("plugin.yun-sign.frontend.member.set-pwd", { user: this.form }, " ")
            .then(response => {
              if (response.result === 1) {
                this.$message.success("修改成功!");
                this.is_edit_info = false;
              } else {
                this.$message.error(response.msg);
              }
            })
            .catch(err => {
              this.$message.error("修改失败!");
              console.error(err);
            });
        }
      });
    },
    logout() {
      $http.get("member.logout.index").then(
        response => {
          if (response.result === 1) {
            // location.reload();// In order to re-instantiate the vue-router object to avoid bugs
            this.$router.push({ path: "/login?i="+this.fun.getKeyByI()});
          }
          window.isFirst = 0;
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  border-bottom: 1px solid #eeeeee;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    display: flex;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      cursor: pointer;
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 20px;
      color: #5a5e66;
      vertical-align: text-bottom;
      transition: background 0.3s;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.tip {
  color: #999;
  font-size: 12px;
}
</style>
