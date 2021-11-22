Vue.use(VueRouter)
import router from './router/routes.js'
import gnbtab from "./src/components/gnb.js";

var app = new Vue({
  router,
}).$mount("#siteContent");