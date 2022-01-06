/**
 * @component
 * @name gnb-menu
 * @title GNB 메뉴 전역 컴포넌트
 * @description header, gnbMove 
 */
import {getDateFormat, gnbHeader, gnbMove, checkMobile } from "../common/common.js";

Vue.component('gnb-menu', {
    template: `
            <nav class="gnb" ref="gnb">
                <div class="slide">
                    <ul ref="ul">
                        <li v-for="(item,index) in GnbMenu" v-if="item.state=='Y'" :class="{'on': index == idx}">
                            <router-link :to="item.link" v-if='item.weblinkpos=="GNB"'>
                                <a v-on:click="stateChange(index)"  v-html="item.menuName" style="white-space:nowrap"></a>
                            </router-link>
                            <a v-else v-on:click="clickGNBInterface(item.weblinkpos, item.link, item.menuName)" v-html="item.menuName"></a>
                        </li>
                        <!--테스트 정보
                        <li v-on:click="stateChange(6)">
                            <a style="white-space:nowrap" v-on:click="clickGNBInterface('WEB', 'https://imnews.imbc.com/issue/vote2022/m/main_m.html', '2022 대선')">2022 대선</a>
                        </li>
                        -->
                    </ul>                
                </div>
            </nav>
            `
    ,
    data(){
        return {
            render:false,
            userAgent:"",
            GnbMenu: [],
            idx: 0
        }
    },
    mounted() {
        var _that = this;
        _that.Init();
    },  
    beforeUpdate(){
        this.$nextTick(() => {
            if(!this.render){
                gnbHeader();
                this.render= true;
            }
            gnbMove();
        }) 
    },
    methods: {
        Init(){
            try {
                this.userAgent = checkMobile();
                this.InitData();
            }
            catch (e) { }
        },
        InitData() {
            var _this = this;
            var current_url = window.location.href;
            var url = 'https://control.imbc.com/MBCApp/GNB?date='+getDateFormat();

            $.ajax({
                url: url,
                dataType: "json",
                async:true,
                cache: true,
                timeout: 10000,
                success: function (o) {
                    if (o.length > 0) {
                        $.each(o, function (index, item) {
                            var map = {link: item.Link, weblinkpos: item.WebLinkPos, menuName: item.MenuName, state: item.State};
                            _this.GnbMenu.push(map);
                            _this.InitIdx(current_url, item.Link, index);
                        });                       
                    }                
                }
            });
        },
        InitIdx(current_url, current_route, index){
            if(current_route !="/" && current_url.indexOf(current_route)>-1){
                this.idx = index
            }
        },  
        stateChange(value){
            this.idx = value;
        },
        clickGNBInterface(pos, link, title){
            //android
            if (this.userAgent == "android") {
                window.iMBCHandler.setAppBanner(pos, link, title);              
            }      
            //ios
            else if (this.userAgent == "ios") {
                var msg = { 'setAppBanner': { 'linkType': pos, 'link': link, 'title': title } };       
                window.webkit.messageHandlers.iMBCHandler.postMessage(msg);
            }              
        } 
    }
});