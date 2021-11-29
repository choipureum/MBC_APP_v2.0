const commonCss = require('./static/css/common.css');

import VueLazyload from 'vue-lazyload'
import router from './router/routes.js'
import gnbtab from "./src/components/gnb.js";
import {checkMobile, getDateFormat, getParameter, sliderBanner, bannerDefaultImg, ImgLazyLoading } from "./src/common/common.js";

Vue.use(VueLazyload, bannerDefaultImg('drama'));

var app = new Vue({
  router,
}).$mount("#siteContent");