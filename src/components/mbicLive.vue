<!--
/**
 * @router component
 * @name mbicLive.vue
 * @title 엠빅라이브 라우터 컴포넌트
 * @description mbicLive gnb
 * @author (c) 2021 iMBC
 */
-->
<template>
    <div class='wrap-mbic' v-show="initRender">
        <!-- 프로모션 배너 타입 B (배경이미지 + 텍스트) -->
        <div class="wrap_banner" v-if="topBanner.length > 0" v-on:click="clickInterface('banner', topBanner[0].Info.Relation.ScheduleCode, topBanner[0].Info.Relation.NoticeMsg, topBanner[0].Info.Relation.ActionType, topBanner[0].Info.Relation.LinkType, topBanner[0].Info.Relation.LinkURL)">
            <h2 class="blind">홍보 배너</h2>
            <a>
                <img :src="topBanner[0].Info.Image" :alt="topBanner[0].Info.Title">
                    <div class="banner_txt">
                        <p class="title" v-html="topBanner[0].Info.Title"></p>
                        <p class="date" v-html="topBanner[0].Info.Desc"></p>
                    </div>
            </a>
        </div>

        <!-- 엠빅 라이브 -->
        <div v-show="scheduleList.length > 0" class="wrapper thumb_list">
            <ul>
                <li class="vod" v-on:click="clickInterface('MbicLive', item.ScheduleCode)" v-for="(item,index) in scheduleList" v-bind:key='index'>
                    <span class="img"><img :data-url="item.OnAirImage" :alt="item.Title" v-on:error="replaceByDefault" v-img-lazy-loading><span class="bar" :style="{width: item.percentTime+'%'}"></span></span>
                    <div>
                        <span class="title ellipsis2" v-html="item.Title"></span> 
                        <span class="program ellipsis" v-html="item.TypeTitle"></span> 
                        <span class="writer">{{item.StartTime.slice(0,2)+':'+ item.StartTime.slice(2)}}~{{item.EndTime.slice(0,2)+':'+ item.EndTime.slice(2)}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {checkMobile, getDateFormat, ImgLazyLoading } from "../common/common.js";

export default{
    props:['userAgent'],
     data(){
        return{
            btnShow: true,
            initRender :false,
            topBanner:[],
            scheduleList:[],
            defaultImg: "https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_vod_drama_list.png",
        }
     },
    directives:{
        'img-lazy-loading': ImgLazyLoading
    },
     mounted() {
        var _that = this;
        _that.Init(); 
     },
    updated() {
        this.$nextTick(()=>{
            this.initRender = true;
        });
    },
    computed: {
 
    },
     methods: {
        Init() {
            try {
                this.InitTopBannerData();
                this.InitScheduleData();
            }
            catch (e) { }
        },
        InitTopBannerData() {
            var _this = this;
            var topBannerUrl = 'https://control.imbc.com/MBCApp/Banner/Live?type='+ checkMobile() +'&category=2&date=' + getDateFormat();
            /**
             * @title 상단 배너 매핑
             */         
            $.ajax({
                url: topBannerUrl,
                dataType: "json",
                async:true,
                cache: true,
                timeout: 10000,
                success: function (o) {
                    if (o.length > 0) {
                        _this.topBanner.push(o[0]);
                    }
                }
            });
        },
        InitScheduleData() {
            var _this = this;
            var scheduleUrl = 'https://control.imbc.com/Schedule/ONAIRWITHNVOD?date=' + getDateFormat();
            /**
             * @title 엠빅 라이브 매핑
             */         
            $.ajax({
                url: scheduleUrl,
                dataType: "json",
                async:true,
                cache: true,
                timeout: 10000,
                success: function (o) {
                    if (o.length > 0) {
                        var n = o.length - 1;
                        $.each(o, function (index, item) {
                            if(item.Type == "NVOD") _this.scheduleList.push(item);
                        });                       
                    }
                }
            });
        },
        replaceByDefault(e){
            e.target.src = this.defaultImg;
        },
        clickInterface(...args) {
            var _this = this;
            var link = 'https://m.imbc.com/onair/nvod/'+ parseInt(args[1].substring(1));
            //android
            if (this.userAgent == "android") {
                switch (args[0]) {
                    case "banner":
                        if(args[2] != ""){alert(args[2]);}
                        if(args[3] == "Banner") {window.iMBCHandler.setAppBanner(args[4], args[5], '온에어');}
                        else{window.iMBCHandler.setAppOnair(args[1]); }
                        break;    

                    case "MbicLive":
                        if(_this.isOnAir(args[1])){ window.iMBCHandler.setAppOnair(args[1]); }
                        else{ window.iMBCHandler.setAppBanner("WEB", link, 'mbicLive'); } 
                        break;
                }    
            }      
            //ios
            else if (this.userAgent == "ios") {
                var msg;
                switch (args[0]) {
                    case "banner":
                        if(args[2] != ""){alert(args[2]);}
                        if(args[3] == "Banner"){ msg = { 'setAppBanner': { 'linkType': args[4], 'link': args[5], 'title': '온에어' } };}
                        else{ msg = { 'setAppOnair': { 'sCode': args[1] }};    }
                        break;   

                    case "MbicLive":
                        //생중계
                        if(_this.isOnAir(args[1])) { msg = { 'setAppOnair': {'sCode' : args[1] } };}
                        else{ msg = { 'setAppBanner': { 'linkType': "WEB", 'link': link, 'title': 'mbicLive' } }; }
                        break;
                }        
                window.webkit.messageHandlers.iMBCHandler.postMessage(msg);
            }            
        },
        isOnAir(sCode){
            var onAirList = ['MBC', 'P_everyone', 'P_drama', 'P_music', 'P_on', 'MBCNET', 'C0001', 'C0002', 'C0005', 'C0006', 'C0007', 'C0008', 'C0009'];
            var idx = onAirList.indexOf(sCode);
            return idx>-1;
        }
     }
 };
</script>

<style scoped src='../../static/css/sub.css'></style>