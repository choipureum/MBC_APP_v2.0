import {checkMobile,getParameter} from "../src/common/common.js";

const mobileStatus = () => {
    return checkMobile();
}

const autoStatus = (sname) => {
    return getParameter(sname);
}

Vue.use(VueRouter)

export default new VueRouter({
    
    routes: [
        {
            path: '/' ,
            //Lazy Load - prefetch
            component: () => import('../src/components/timeLine.vue'),
            props:{
                isAuto: autoStatus("isAuto"),
                userAgent: mobileStatus(),    
            },
        },
        {
            path: '/news',
            component: () => import('../src/components/news.vue'),
            props:{
                userAgent: mobileStatus()
            },
        },
        {
            path: '/onAir',
            component: () => import('../src/components/onAir.vue'),
            props:{
                userAgent: mobileStatus()
            }
        },
        {
            path: '/mbicLive',
            component: () => import('../src/components/mbicLive.vue'),
            props:{
                userAgent: mobileStatus()
            }
        },
        {
            path: '/replay',
            component: () => import('../src/components/replay.vue'),
            props:{
                userAgent: mobileStatus()
            }
        },
        {
            path: '/nowFree',
            component: () => import('../src/components/nowFree.vue'),
            props:{
                userAgent: mobileStatus()
            }
        },
        //error url
        {
            path: '*',
            component: () => import ('../src/components/timeLine.vue'),
            props:{
                userAgent: mobileStatus()
            }
        },
        
    ]
});
