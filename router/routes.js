import timeline from '../src/components/timeLine.js';
import news from '../src/components/news.js';

export default new VueRouter({
    routes: [
        {
            path: '/' ,
            component: timeline
        },
        {
            path: '/news',
            component: news
        }
    ]
});
