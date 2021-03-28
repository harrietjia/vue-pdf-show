import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {getToken} from '@/utils/auth' // getToken from cookie

NProgress.configure({showSpinner: false})// NProgress Configuration

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

// 路由跳转的限制可以在这里做判断

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  next();
  // NProgress.done();

})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
