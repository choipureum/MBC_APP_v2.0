Vue.use(VueRouter)
const commonCss = require('./static/css/common.css');
import router from './router/routes.js'
import gnbtab from "./src/components/gnb.js";
import {checkMobile, getDateFormat, getParameter, sliderBanner, bannerDefaultImg, ImgLazyLoading } from "./src/common/common.js";

Vue.directive('img-lazy-loading', ImgLazyLoading);

var app = new Vue({
  router,
}).$mount("#siteContent");