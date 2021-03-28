import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import App from "./App";
import store from "./store";
import router from "./router";

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "@/styles/index.scss"; // global css

import i18n from "./lang"; // Internationalization
import "./icons"; // icon
import "./errorLog"; // error log
import "./permission"; // permission control
// import "./mock"; // simulation data

import Fun from "./utils/fun"; // 常用方法
import http from "@/api/http"; // 请求封装的方法
import VueClipboard from "vue-clipboard2";

import * as filters from "./filters"; // global filters

// 使用剪切板
Vue.use(VueClipboard);
Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.prototype.fun = Fun;
// Fun.setIcon("https://dev8.yunzshop.com/favicon.ico");

window.$http = http;

Vue.config.productionTip = false;

window.__pcVueApp__ = new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});
