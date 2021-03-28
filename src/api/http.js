import axios from "axios";
import Fun from "@/utils/fun";
import store from "../store";
import base64_encode from "../utils/base64_encode";
import { Loading, MessageBox, Message } from "element-ui";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
var loading;
var loading2;

export default {
  // 封装的 GET请求
  get(url, params, message) {
    // Fun.getKeyByI() || 2
    let i = Fun.getKeyByI();
    let mid = Fun.getKeyByMid();
    let type = Fun.getTyep();
    let shop_id = Fun.getKeyByMicroShopId();
    let webToken = localStorage.getItem("token");
    let uid = localStorage.getItem("loginUid");
    let uuid = window.localStorage.uuid;
    if (!uuid) {
      uuid = 0;
    }

    let baseUrl = "";
    if (mid) {
      baseUrl =
        "/addons/yun_shop/api.php?i=" +
        i +
        "&uuid=" +
        uuid +
        "&mid=" +
        mid +
        "&type=" +
        type +
        "&shop_id=" +
        shop_id;
    } else {
      baseUrl =
        "/addons/yun_shop/api.php?i=" +
        i +
        "&uuid=" +
        uuid +
        "&type=" +
        type +
        "&shop_id=" +
        shop_id;
    }

    if (window.yzFirstlogin === 0 && window.yzValidate_page === 0) {
      baseUrl = baseUrl + "&validate_page=1";
    }

    if (
      (window.yzFirstlogin === 1 &&
        url.indexOf("member.login.index") < 0 &&
        url.indexOf("member.member.wxJsSdkConfig") < 0 &&
        url.indexOf("member.login.login-mode") < 0) ||
      url.indexOf("finance.income-page.index") >= 0
    ) {
      window.yzFirstlogin = 0;
      baseUrl = baseUrl + "&basic_info=1&validate_page=1";
    }

    // if(Fun.isPhone()){
    //   loading2 = Loading.service({
    //     lock: true,
    //     text: '请在电脑端打开网页',
    //     spinner: "el-icon-warning",
    //     background: "#ffffff"
    //   });
    //   return;
    // }
    if (message) {
      loading = Loading.service({
        lock: true,
        text: message,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }

    if (
      window.location.href.indexOf("#/cashier_pay/") > -1 &&
      url.indexOf("member.login.check-login") < 0
    ) {
      baseUrl += "&scope=base&route=";
    } else {
      baseUrl += "&route=";
    }

    if (params) {
      let paramsArray = [];
      Object.keys(params).forEach(key =>
        paramsArray.push(key + "=" + params[key])
      );
      url += "&" + paramsArray.join("&");
      url = baseUrl + url;
    } else {
      url = baseUrl + url;
    }

    console.log("===test url====", url);

    return new Promise(function(resolve, reject) {
      // Authorization要删
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + base64_encode(uid + ":" + webToken)
        },
        credentials: "include"
      })
        .then(response => {
          if (message) {
            loading.close();
          }

          if (response.ok) {
            return response.json();
          } else {
            reject({ status: response.status });
          }
        })
        .then(response => {
          if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -5
          ) {
            //注册站点
            window.location.href = Fun.getSiteRoot() + "/#/website/register_website";
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -4
          ) {
            //安装向导
            window.location.href = Fun.getSiteRoot() + "/#/install";
            // Message.error(response.msg);
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -3
          ) {
            //无权限
            window.location.href = Fun.getSiteRoot() + "/#/manage/index?i="+Fun.getKeyByI();
            Message.error(response.msg);
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -2
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/login?i="+Fun.getKeyByI();
            Message.error(response.msg);
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.login_status === 1
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/login?from=1&i="+Fun.getKeyByI();
            console.log("无权限，跳入登录入口");
          } else if (
            response.result === 1 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -5
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/login?i="+Fun.getKeyByI();
            Message.error(response.msg);
          }  else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == 'upgrade'
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/website/system_upgrade";
            console.log("跳入系统升级页面");
          }
          if (
            response.result === 1 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.pwd_remind === 1
          ) {
            // 提示修改密码弹出框
            store.dispatch("IsOpenPwd", true);
            store.dispatch("tips_word", response.data.msg);
            console.log("提示修改密码弹出框")
          }
          if (
            response.result === 1 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.url &&
            !response.data.url instanceof Object
          ) {
            // 操作员直接跳进主商城
            window.location.href = response.data.url;
          }
          else {
            return response;
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          if (message) {
            loading.close();
          }
          window.location.href = Fun.getSiteRoot() + "/#/500";
          console.error(err);
          reject({ status: -1 });
        });
    });
  },
  // POST请求  FormData 表单数据

  post(url, formData, message) {
    // Fun.getKeyByI() || 2
    let i = Fun.getKeyByI();
    let mid = Fun.getKeyByMid();
    let type = Fun.getTyep();
    let shop_id = Fun.getKeyByMicroShopId();
    let webToken = localStorage.getItem("token");
    let uid = localStorage.getItem("loginUid");
    let uuid = window.localStorage.uuid;
    if (!uuid) {
      uuid = 0;
    }
    let baseUrl = "";
    if (mid) {
      baseUrl =
        "/addons/yun_shop/api.php?i=" +
        i +
        "&uuid=" +
        uuid +
        "&mid=" +
        mid +
        "&type=" +
        type +
        "&shop_id=" +
        shop_id;
    } else {
      baseUrl =
        "/addons/yun_shop/api.php?i=" +
        i +
        "&uuid=" +
        uuid +
        "&type=" +
        type +
        "&shop_id=" +
        shop_id;
    }

    if (window.yzFirstlogin === 0 && window.yzValidate_page === 0) {
      baseUrl = baseUrl + "&validate_page=1";
    }

    if (
      (window.yzFirstlogin === 1 &&
        url.indexOf("member.login.index") < 0 &&
        url.indexOf("member.member.wxJsSdkConfig") < 0 &&
        url.indexOf("member.login.login-mode") < 0) ||
      url.indexOf("finance.income-page.index") >= 0
    ) {
      window.yzFirstlogin = 0;
      baseUrl = baseUrl + "&basic_info=1&validaste_page=1";
    }

    // if(Fun.isPhone()){
    //   loading2 = Loading.service({
    //     lock: true,
    //     text: '请在电脑端打开网页',
    //     spinner: "el-icon-warning",
    //     background: "#ffffff"
    //   });
    //   return;
    // }
    if (message) {
      loading = Loading.service({
        lock: true,
        text: message,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }

    if (
      window.location.href.indexOf("cashier_pay") > 0 &&
      url.indexOf("member.login.check-login") < 0
    ) {
      baseUrl += "&scope=base&route=";
    } else {
      baseUrl += "&route=";
    }

    return new Promise(function(resolve, reject) {
      url = baseUrl + url;
      // Authorization要删
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + base64_encode(uid + ":" + webToken)
        },
        body: JSON.stringify(formData),
        credentials: "include"
      })
        .then(response => {
          if (message) {
            loading.close();
          }
          if (response.ok) {
            return response.json();
          } else {
            reject({ status: response.status });
          }
        })
        .then(response => {
          if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -5
          ) {
            //注册站点
            window.location.href = Fun.getSiteRoot() + "/#/website/register_website";
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -4
          ) {
            //安装向导
            window.location.href = Fun.getSiteRoot() + "/#/install";
            // Message.error(response.msg);
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -3
          ) {
            //无权限
            window.location.href = Fun.getSiteRoot() + "/#/manage/index?i="+Fun.getKeyByI();
            Message.error(response.msg);
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -2
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/login?i="+Fun.getKeyByI();
            Message.error(response.msg);
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.login_status === 1
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/login?from=1&i="+Fun.getKeyByI();
            console.log("无权限，跳入登录入口");
          } else if (
            response.result === 1 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status === -5
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/login?i="+Fun.getKeyByI();
            Message.error(response.msg);
          } else if (
            response.result === 0 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.status == 'upgrade'
          ) {
            window.location.href = Fun.getSiteRoot() + "/#/website/system_upgrade";
            console.log("跳入系统升级页面");
          }
          if (
            response.result === 1 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.pwd_remind === 1
          ) {
            // 提示修改密码弹出框
            store.dispatch("IsOpenPwd", true);
            store.dispatch("tips_word", response.data.msg);
            console.log("提示修改密码弹出框")
          }
          if (
            response.result === 1 &&
            !Fun.isTextEmpty(response.data) &&
            response.data.url &&
            !response.data.url instanceof Object
          ) {
            // 操作员直接跳进主商城
            window.location.href = response.data.url;
          }
          else {
            return response;
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          if (message) {
            loading.close();
          }
          window.location.href = Fun.getSiteRoot() + "/#/500";
          console.error(err);
          reject({ status: -1 });
        });
    });
  },
};
