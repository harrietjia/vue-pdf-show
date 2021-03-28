import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/views/layout/Layout";

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/

// 法定代表人
export const asyncRouterMap2 = [
  {
    path: "/manage",
    component: Layout,
    redirect: "/manage/index",
    name: "platform",
    meta: {
      title: "合同列表",
      icon: "example"
    },
    children: [
      {
        path: "/manage/set_template/1",
        component: () => import("@/views/sign/set_template"),
        name: "set_template",
        meta: { title: "创建模版", icon: "edit" }
      },
      {
        path: "/manage/sign_contract/1",
        component: () => import("@/views/sign/sign_contract"),
        name: "sign_contract",
        meta: { title: "pdf详情", icon: "edit" }
      }
    ]
  },
];

export const constantRouterMap = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  // 加载页面
  {
    path: "/",
    component: Layout,
    component: () => import("@/views/redirect/loading"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401"),
    hidden: true
  },
  {
    path: "/500",
    component: () => import("@/views/errorPage/500"),
    hidden: true
  },
  { path: "*", redirect: "/404", hidden: true }
];

const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

router.addRoutes(asyncRouterMap2);

export default router;
