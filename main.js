const commonCss = require('./static/css/common.css');

import VueLazyload from 'vue-lazyload'
import router from './router/routes.js'
import gnbtab from "./src/components/gnb.js";
import { upBtnFunc, checkMobile, getDateFormat, getParameter, sliderBanner, bannerDefaultImg, ImgLazyLoading } from "./src/common/common.js";

/**
 * @title default img 가로형 
 * @description 세로 movie형은 별개 지정
 */
Vue.use(VueLazyload, bannerDefaultImg('drama'));

/**
 * @title scroll upbtn directive
*/
Vue.directive('scroll', {
  inserted: function(el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', upBtnFunc());
      }
    };
    window.addEventListener('scroll', upBtnFunc());
  },
});


/**
 * @title app entry
 */
var app = new Vue({
  router,
}).$mount("#siteContent");