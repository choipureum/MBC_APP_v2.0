/**
 * @component
 * @name gnb-menu
 * @title GNB 메뉴 전역 컴포넌트
 * @description header, gnbMove 
 */
import {getDateFormat, gnbHeader, gnbMove, checkMobile } from "../common/common.js";

Vue.component('gnb-menu', {
    template: `
            <nav class="gnb" >
                <div class="slide">
                    <ul>
                        <li v-on:click="stateChange(index)" v-for="(item,index) in GnbMenu" v-if="item.state=='Y'" :class="{'on': index == idx}">
                            <router-link :to="item.link" v-if='item.weblinkpos=="GNB"'>
                                <a v-html="item.menuName"></a>
                            </router-link>
                            <a v-else v-on:click="clickGNBInterface(item.weblinkpos, item.link, item.menuName)" v-html="item.menuName"></a>
                        </li>
                    </ul>                
                </div>
            </nav>
            `
    ,
    data(){
        return {
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
        this.$nextTick(function () {
            if(!this.render){
                gnbHeader();
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
                        });                       
                    }
                }
            });
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