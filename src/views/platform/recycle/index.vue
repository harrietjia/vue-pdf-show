<template>
  <div class="right">
    <div class="right-head">
      <div class="right-head-con1">回收站</div>
    </div>
    <el-form :inline="true" :model="search" ref="search">
      <el-row>
        <el-col :span="17">
          <el-form-item>
            <el-input
              v-model="search.name"
              placeholder="请输入平台名称关键词"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" align="right">
          <el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="currentChange(1)"
              >搜索
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="list_box">
      <el-col
        :md="7"
        :sm="12"
        :xs="24"
        v-for="(item, index) in list"
        :key="index"
        class="user"
      >
        <div class="temp">
          <el-row class="temp_top">
            <el-col
              :xs="24"
              :sm="24"
              :md="6"
              :lg="6"
              class="user_box"
              style="padding:30px 0 0 0"
            >
              <div class="temp-img">
                <img :src="item.img" alt="" />
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="14"
              :lg="14"
              style="padding:30px 0 0 0"
            >
              <div class="name_time">
                <div class="name">
                  {{ item.name }}
                </div>
                <div class="effective_time">
                  有效期：{{ item.validity_time }}
                </div>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="6"
              :lg="4"
              style="padding:30px 0 0 0;"
            >
              <div class="edit_box">
                <i
                  class="el-icon-delete"
                  style="color:red;cursor:pointer"
                  @click="del(item.id)"
                ></i>
              </div>
            </el-col>
          </el-row>
          <el-row class="btn_box">
            <el-col :span="8" align="center">
              <el-button
                type="primary"
                style="width:86%;"
                @click="recover(item)"
                >恢复</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-col :span="24" align="right" style="padding:15px 5% 15px 0">
      <el-pagination
        layout="prev, pager, next"
        @current-change="currentChange"
        :current-page.sync="current_page"
        :page-size="pageSize"
        :total="total"
        background
        v-loading="loading"
      >
      </el-pagination>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "PlatformManage",
  data() {
    return {
      search: {
        name: ""
      },
      list: [],
      pageSize: 0,
      current_page: 0,
      total: 0,
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  created() {
    this.currentChange(1);
  },
  destroyed() {},
  methods: {
    //分页
    currentChange(val) {
      this.loading = true;
      $http
        .post(
          "/admin/application/recycle",
          { page: val, search: this.search },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.total = response.data.total;
            this.pageSize = response.data.per_page;
            this.list = response.data.data;
            this.current_page = response.data.current_page;
          } else {
            this.list = response.data;
            this.$message.error(response.msg);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
        });
    },
    recover(item) {
      this.$confirm("确定恢复吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $http
            .get("/admin/application/switchStatus/" + item.id, {}, "正在恢复")
            .then(response => {
              if (response.result === 1) {
                this.currentChange(1);
                this.$message({ type: "success", message: "恢复成功!" });
              } else {
                this.$message.error({ type: "success", message: "恢复失败!" });
              }
            })
            .catch(err => {
              console.error(err);
              this.$message.error({ type: "success", message: "恢复失败!" });
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消恢复" });
        });
    },
    del(id) {
      this.$confirm("确定删除平台相关的所有信息？此操作不可逆!!!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $http
            .get("/admin/application/delete/" + id, {}, "正在删除")
            .then(response => {
              if (response.result === 1) {
                this.currentChange(1);
                this.$message({ type: "success", message: "删除成功!" });
              } else {
                this.$message.error({ type: "success", message: "删除失败!" });
              }
            })
            .catch(err => {
              console.error(err);
              this.$message.error({ type: "success", message: "删除失败!" });
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.right {
  padding-left: 30px;
  .right-head {
    padding: 15px 0;
    line-height: 50px;
    border-bottom: 1px #ccc solid;
    margin-bottom: 15px;
    .right-head-con1 {
      padding-right: 20px;
      font-size: 16px;
      color: #888;
    }
  }
  .temp {
    border: 1px #dcdfe6 solid;
    border-radius: 8px;
    margin: 0 16px;
    .temp_top {
      display: flex;
    }
    .name_time {
      .name {
        font-size: 20px;
        line-height: 48px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .effective_time {
        line-height: 24px;
        color: #ccc;
        font-weight: normal;
        font-size: 14px;
      }
    }
    .temp-img {
      overflow: hidden;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .btn_box {
      display: flex;
      justify-content: flex-end;
      margin: 28px 0;
      padding: 0 10px;
    }
  }
  .list_box {
    flex-wrap: wrap;
    .user {
      width: 33.33% !important;
      margin: 16px 0;
    }
  }
}
</style>
