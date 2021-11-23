import timeline from '../src/components/timeLine.vue';
import news from '../src/components/news.vue';
import onAir from '../src/components/onAir.vue';

export default new VueRouter({
    routes: [
        {
            path: '/' ,
            component: timeline
        },
        {
            path: '/news',
            component: news
        },
        {
            path: '/onAir',
            component: onAir
        }
    ]
});
