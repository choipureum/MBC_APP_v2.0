<!--
/**
 * @module entrypoint
 * @name mainVue.js
 * @description    
 * 
 *      VUE entry
 *      main 메인 타임라인 webview     
 * 
 * @function
 * 
 *      1.onAir
 *      2.news
 *      3.olympic @deprecated 
 *      4.corona info
 *      5.VOD
 *      6.banner
 *      7.promotion
 * 
 * (c) 2021 iMBC
 */
-->
<template>
   <div class="wrap_home">
        <!-- 프로모션 배너 타입 A -->
        <div class="main_top" v-if="topBanner.length > 0">
            <div class="visual_slide swiper-container" id="mTopWrap">
                <ul :class="{'swiper-wrapper': topBanner.length > 1}">
                    <li class="swiper-slide" v-for="(item,index) in topBanner" v-on:click="clickInterface('banner', item.Info.Relation.LinkType, item.Info.Relation.LinkURL, item.Info.Title, item.Info.Relation.ActionType,item.Info.Relation.BID,item.Info.Relation.NoticeMsg,item.Info.Relation.ScheduleCode)" :key='index'>              
                        <img :src="item.Info.Image" alt="item.Info.Title">
                        <div class="wrap_txt">
                            <h2 v-html="item.Info.Title"></h2>
                            <span class="s_info" v-html="item.Info.Desc"></span>
                        </div>
                    </li>
                </ul>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        
        <div v-for="(item,index) in itemList" :key="index">
            <!-- 온에어  4.23(진행중)-->
            <div v-if="item.Division =='Live'" class="wrapper wrap_player" style="position:relative;" v-on:click="clickInterface('onair',item.DivisionType)">
                <div v-show="item.Info.Program != '방송 종료'|| item.Info.Program != '방송 시작'">
                    <div class="player onair-view" id="onairwrapper">
                        <span class="img" style="display:block"><img class="thumb" :src="item.Info.Relation.ContentImage" :alt="item.Info.Title"></span>
                        <span class="img player onair-view" id="onair" style="display:none;" :data-title="item.Info.Title"></span>
                    </div>
                    <div class="wrap_txt">
                        <h3 class="title ellipsis" v-html="item.Info.Program"></h3>
                        <div class="tit_info">
                            <span class="bg_round">Live</span><span class="s_info">{{item.Info.BroadDate}}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 뉴스, 올림픽 -->
            <!--타입별로 태그 (호출 다르게)  ** Division:News / DivisionType:A,B,C,D : 아직 보류(A)만 -->
            <div v-else-if="item.Division=='News'">
                <!-- ▼ 210705 코로나 현황 영역 추가 -->
                <corona-class></corona-class>

                <!--뉴스 -->
                <div class="wrapper wrap_news">
                    <h2>많이 본 뉴스</h2>
                    <div class="news_list">
                        <div class="tabs">
                            <ul>
                                <li class="on" v-on:click="selectedCategory='A'"><span>MBC</span></li>
                                <li><span v-on:click="selectedCategory='B'">포털</span></li>
                                <li><span v-on:click="selectedCategory='C'">SNS</span></li>
                                <li><span v-on:click="selectedCategory='D'">유튜브</span></li>
                            </ul>
                        </div>
                        <ul>
                            <li v-for="(newsItem,newsIndex) in filteredNews" :class="{'first':newsIndex == 0,'ellipsis': newsIndex > 0 }" :key="newsIndex" >
                                <a v-on:click="clickInterface('bannerNews',newsItem.Info.Relation.LinkType,newsItem.Info.Relation.LinkURL,'MBC뉴스')">
                                    <span v-if="newsIndex == 0" class="img">
                                        <img :src="newsItem.Info.Relation.ContentImage" alt="newsItem.Info.Title">
                                    </span>
                                    <span :class="{'title ellipsis3':newsIndex === 0, 'ellipsis':newsIndex>0}"><strong>{{(newsIndex+1)+"."}}</strong>{{(newsItem.Info.Title)}}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <!-- 프로모션 배너 타입 B -->
            <div v-else-if="item.Division=='Banner'&& item.DivisionType=='B'" class="wrapper wrap_banner" v-on:click="clickInterface('banner', item.Info.Relation.LinkType, item.Info.Relation.LinkURL, item.Info.Title, item.Info.Relation.ActionType,item.Info.Relation.BID,item.Info.Relation.NoticeMsg,item.Info.Relation.ScheduleCode)">
                <h2 class="blind">{{item.Info.Title}}</h2>
                <a>
                    <img :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" v-img-lazy-loading>
                    <div class="banner_txt" v-bind:class="{'center':item.Info.Desc=='' && item.Info.Title !=''}">
                        <p class="title" v-html="item.Info.Title"></p>
                        <p class="date" v-html="item.Info.Desc"></p>
                    </div>
                </a>
            </div>

            <!-- 프로모션 타입 ** Division: promotion  -->
            <div v-else-if="item.Division == 'Promotion'" class="wrapper wrap_promo flag1" v-on:click="clickInterface('banner', item.Info.Relation.LinkType, item.Info.Relation.LinkURL, item.Info.Title, item.Info.Relation.ActionType,item.Info.Relation.BID,item.Info.Relation.NoticeMsg,item.Info.Relation.ScheduleCode)">
                <a>
                    <div class="img">
                        <img :src="item.Info.Relation.ContentImage" alt="">
                    </div>
                    <span v-if="item.Info.Relation.Keyword=='' || item.Info.Relation.Keyword=='사용안함'"></span>
                    <span v-else class="flag">{{item.Info.Relation.Keyword}}</span>
                    <div class="wrap_txt">
                        <h3 class="title ellipsis" v-html="item.Info.Title"></h3>
                        <span class="s_info" v-html="item.Info.Desc"></span>
                    </div>
                </a>
            </div>
            <!-- 콘텐츠 B 유료영상 : 올림픽 **  Division:VOD / DivisionType:B-->
            <div v-else-if="item.Division == 'VOD' && item.DivisionType == 'B'" class="wrapper wrap_vod wrap_sports wrap_player" :style="'background:#27253f url('+item.Info.Image+') no-repeat;background-size: 100%;'" v-on:click="clickInterface('content',item.Division, item.Info.Relation.BID)">
                <div class="player replayVod" :data-bid="item.Info.Relation.BID" :data-div="'VODContent'+index" :data-title="item.Info.Title" style="position:relative;">
                    <span class="img" style="display:block"><img class="thumb img_thumb" :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" v-img-lazy-loading></span>
                    <span class="img vod_prev" style="display:none" :id="'VODContent'+index"></span>
                </div>
                <div class="wrap_txt">
                    <div class="tit_info">
                        <h3 class="title_olympic ellipsis" v-html="item.Info.Title"></h3>
                    </div>
                    <a class="btn_vod" :style="{ backgroundImage: 'url('+'./static/images/bg-link.png'+')' }" >바로가기</a>
                </div>
            </div>

            <!-- 콘텐츠 A 무료영상 : 다시보기  **  Division:VOD / DivisionType:A-->
            <div v-else-if="item.Division == 'VOD' && item.DivisionType == 'A'" class="wrapper wrap_vod wrap_player" :style="'background:#27253f url('+item.Info.Image+') no-repeat;background-size: 100%;'" v-on:click="clickInterface('content',item.Division, item.Info.Relation.BID)">
                <div class='vod_gra' :style="{ backgroundImage: 'url('+'./static/images/vod_top_gra.png'+')' }"></div>
                <div class="player replayVod" :data-bid="item.Info.Relation.BID" :data-div="'VODContent'+index" :data-title="item.Info.Title" style="position:relative;">
                    <span class="img" style="display:block"><img class="thumb img_thumb" :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" v-img-lazy-loading></span>
                    <span class="img vod_prev" style="display:none" :id="'VODContent'+index"></span>
                </div>
                <div class="wrap_txt">
                    <div class="tit_info">
                        <h3 class="title ellipsis">[다시보기] {{item.Info.Program}}</h3>
                        <span class="date">{{item.Info.BroadDate}}</span>
                        <span class="num">{{item.Info.Relation.ContentNumber}}회</span>
                    </div>
                    <a class="btn_vod" :style="{ backgroundImage: 'url('+'./static/images/bg-link.png'+')' }">바로가기</a>
                </div>
            </div>

            <!-- 콘텐츠 A 핫클립영상  **  Division:Clip / DivisionType: A-->
            <div v-else-if="item.Division == 'Clip' && item.DivisionType == 'A'" class="wrapper wrap_player" :data-title="item.Info.Title" v-on:click="clickInterface('content',item.Division, item.Info.Relation.BID)">
                <div class="player replayVod" :data-bid="item.Info.Relation.BID" :data-div="'VODContent'+index" style="position:relative;">
                    <span class="img" style="display:block"><img class="thumb img_thumb" :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" v-img-lazy-loading></span>
                    <span class="img vod_prev" style="display:none" :id="'VODContent'+index"></span>
                </div>
                <div class="wrap_txt">
                    <h3 class="title ellipsis" v-html="item.Info.Title"></h3>
                    <div class="tit_info">
                        <span class="bg_round">핫클립</span>
                        <span class="s_info" v-html="item.Info.Program"></span>
                        <span class="s_info">{{item.Info.Relation.ContentNumber}}회</span>
                    </div>
                </div>
            </div>

            <!-- Preview  **  Division:Preview / DivisionType: A-->
            <div v-else-if="item.Division == 'Preview'" class="wrapper wrap_player" :data-title="item.Info.Title" v-on:click="clickInterface('content',item.Division, item.Info.Relation.BID)">
                <div class="player replayVod" :data-bid="item.Info.Relation.BID" :data-div="'VODContent'+index" style="position:relative;">
                    <span class="img" style="display:block"><img class="thumb img_thumb" :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" v-img-lazy-loading></span>
                    <span class="img vod_prev" style="display:none" :id="'VODContent'+index"></span>
                </div>
                <div class="wrap_txt">
                    <h3 class="title ellipsis" v-html="item.Info.Title"></h3>
                    <div class="tit_info">
                        <span class="bg_round">예고</span>
                        <span class="s_info" v-html="item.Info.Program"></span>
                        <span class="s_info">{{item.Info.Relation.ContentNumber}}회</span>
                    </div>
                </div>
            </div>

            <!-- **  Division:Special / DivisionType: A-->
            <div v-else-if="item.Division == 'Special'" class="wrapper wrap_player" :data-title="item.Info.Title" v-on:click="clickInterface('content','Sketch', item.Info.Relation.BID)">
                <div class="player replayVod" :data-bid="item.Info.Relation.BID" :data-div="'VODContent'+index" style="position:relative;">
                    <span class="img" style="display:block"><img class="thumb img_thumb" :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" v-img-lazy-loading></span>
                    <span class="img vod_prev" style="display:none" :id="'VODContent'+index"></span>
                </div>
                <div class="wrap_txt">
                    <h3 class="title ellipsis" v-html="item.Info.Title"></h3>
                    <div class="tit_info">
                        <span class="bg_round">현장스케치</span>
                        <span class="s_info" v-html="item.Info.Program"></span>
                        <span class="s_info">{{item.Info.Relation.ContentNumber}}회</span>
                    </div>
                </div>
            </div>
            

            <!-- 스포츠 ** Divsion : Clip / DivisionType: B  -->
            <div v-else-if="item.Division=='Clip' && item.DivisionType=='B'" class="wrapper wrap_player" :data-title="item.Info.Title" v-on:click="clickInterface('content',item.Division, item.Info.Relation.BID)">
                <div class="player replayVod" :data-bid="item.Info.Relation.BID" :data-div="'VODContent'+index" style="position:relative;">
                    <span class="img" style="display:block"><img class="thumb img_thumb" :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" v-img-lazy-loading></span>
                    <span class="img vod_prev" style="display:none" :id="'VODContent'+index"></span>
                </div>
                <div class="wrap_txt">
                    <h3 class="title ellipsis" v-html="item.Info.Title"></h3>
                    <div class="tit_info">
                        <span class="bg_round">핫클립</span>
                        <span class="s_info" v-html="item.Info.Program"></span>
                        <span class="s_info">{{item.Info.Relation.ContentNumber}}회</span>
                    </div>
                </div>
            </div>

            <!-- 콘텐츠 C 무료/할인 -->
            <!-- 클래스 flag1 할인 플래그 -->
            <!-- 클래스 flag2 무료 플래그 -->
            <div v-else-if="item.Division=='Banner'&& item.DivisionType=='C'" class="wrapper wrap_banners" v-on:click="clickInterface('banner', item.Info.Relation.LinkType, item.Info.Relation.LinkURL, item.Info.Title, item.Info.Relation.ActionType,item.Info.Relation.BID,item.Info.Relation.NoticeMsg,item.Info.Relation.ScheduleCode)">
                <div class="thumb_right">
                    <a>
                        <div class="wrap_txt">
                            <span class="title" v-html="item.Info.Title"></span>
                            <span class="s_info" v-html="item.Info.Desc"></span>
                        </div>
                        <span class="img"><img :data-url="item.Info.Relation.ContentImage" :alt="item.Info.Title" style="width:100%;height:100%" v-img-lazy-loading></span>
                    </a>
                </div>
            </div>
        </div>
        <button type="button" class="scroll-top" id="scrollTop" style="display: none;" :style="{ backgroundImage: 'url('+'./static/images/ico_top.png'+')' }" v-on:click='moveTop()'>상단으로 이동</button>
    </div>
</template>

<script>
import { getDateFormat, sliderBanner, ImgLazyLoading } from "../common/common.js";
import { scrollFn } from "../common/timelinefunction.js";
import PreviewPlayer from "../common/previewPlayer.js";

export default{
    props:['isAuto','userAgent'],
    data(){
        return {
            initRender: false,
            selectedCategory: 'A',
            topBanner:[],
            itemList: [],
            newsList: []           
        }
    },
    directives:{
        'img-lazy-loading': ImgLazyLoading
    },
    beforeMount(){
    },
    mounted() {
        this.Init();
    },
    components:{
        'corona-class': () => import('./corona.vue')
    },
    beforeUpdate(){
        this.$nextTick(()=>{
        if(!this.initRender && this.itemList.length>0) {
            sliderBanner();
            this.initRender = true; 
        } 
        });
    }, 
    updated() {  
        //첫 로드시에만 실행
        var onBtn = $('#onair_video');
        if (onBtn.length == 0) {
            this.getOnAir();
            this.getReplay();

            if (this.isAuto == 'Y') {
                $(window).on('scrollend', scrollFn);
            } //이외 isAuto N
            else {
                $(".img_thumb").removeClass("img_thumb");
            }
            //news click tab change
            $(".tabs ul li").click(function () {
                $(this).siblings().removeClass("on");
                $(this).addClass("on");
            });
        }
    },
    computed:{
        filteredNews(){
            var _this = this;
            var category = _this.selectedCategory;

            return _this.newsList.filter((newsItem) => {
                return newsItem.DivisionType.match(category);
            }).splice(0,8);
        }
    },
    methods: {
        Init(){
            var _that = this;
            var timeline_url = "https://control.imbc.com/App/V2/HomeTimeline?type=" + this.userAgent + "&date=" + getDateFormat();

            $.ajax({
                url: timeline_url,
                dataType: "json",
                async:true,
                cache: true,
                success: function (data) {
                    var newsPosition = false;

                    //data 항목에 맞게 분류(data에 매핑)
                    $.each(data, function (index, item) {
                        if(item.Division =="Banner" && item.DivisionType == "A"){
                            _that.topBanner.push(item);
                        }
                        else if (item.Division !== "News") {
                            _that.itemList.push(item);
                        }
                        else {
                            if (!newsPosition) {
                                _that.itemList.push(item);
                                newsPosition = true;
                            }
                            _that.newsList.push(item);
                        }

                    });

                }
            });
        },
        //onair
        getOnAir() {
            var oid = "onair";
            var oidwrapper = "onairwrapper";
            var img = $("#" + oidwrapper).find(".thumb").attr("src");
            var userAgent = this.userAgent;

            try {
                setTimeout(() => {
                    if (oid != undefined) {
                        var player1 = new PreviewPlayer();
                        player1.addOnAirPlayer(oid, oidwrapper, img, $("#" + oidwrapper).find(".thumb").width(), $("#" + oidwrapper).find(".thumb").height(), $("#" + oid).attr(":data-title"), userAgent); //error callback 질문
                    }

                    //onload onair play on
                    if (this.isAuto == 'Y') {
                        $("#" + oidwrapper).trigger("mouseenter");
                        $("#" + oidwrapper).addClass("onair-on");
                    }

                    $("#" + oidwrapper).mouseenter(function () {
                        $("#" + oidwrapper).find(".img").last().css("display", "block");
                        $("#" + oidwrapper).find(".img").first().css("display", "none");
                    });
                }, 1000);
            } catch (ex) {
                return;
            }
        },
        //vod && Clip
        //다시보기 && 핫클립
        getReplay() {
            //맨위 -> 아래로 로딩 순서
            $($(".replayVod").get().reverse()).each(function () {
                var bid = $(this).attr("data-bid");
                var img = $(this).find(".thumb").attr("data-url");
                var did = $(this).attr("data-div");

                try {
                    if (did != undefined) {
                        var player = new PreviewPlayer();
                        player.addPlayer(did, bid, img, "100%", "100%", $("#" + did).attr("data-title"));
                    }

                    // 이미지 교체 enter 이벤트 설정
                    $(this).mouseenter(function () {
                        $(this).find(".img").last().css("display", "block");
                    });
                    $(this).mouseleave(function () {
                        $(this).find(".img").last().css("display", "none");
                    });
                } catch (ex) {
                    return;
                }

            });
        },
        moveTop(){
            $(document).scrollTop(0);   
        },
        //클릭시 interface 이동
        clickInterface(...args) {
            /*
             * @param arguments
             * 
             * args[0] : args type(content / banner / onair)
             * args[1] : Division Type(content, banner) or sCode(onair)
             * args[2] : args 1 - contentID(content) or link(banner)
             * args[3] : args 2 - title(banner)
             * args[4] : args 3 - actionType(banner)
             * args[5] : args 4 - BID(banner)
             * args[6] : args 5 - NoticeMSG(banner)
             * args[7] : args 6 - ScheduleCode(banner)    
             */
            //android
            if (this.userAgent == "android") {
                switch (args[0]) {
                    case "content":
                        window.iMBCHandler.setAppContent(args[1], args[2], 'N');
                        break;

                    case "bannerNews":
                        window.iMBCHandler.setAppBanner(args[1], args[2], args[3]);
                        break;

                    case "banner":
                        if (args[6] != "") {alert(args[6]);}
                        if (args[4] == "TAB") {window.iMBCHandler.goTab(args[1]);}
                        else if (args[4] == "Clip" || args[4] == "VOD") {window.iMBCHandler.setAppContent(args[4], args[5],'N');}
                        else if (args[4] == "Live" || args[4] == "MbicLive") { window.iMBCHandler.setAppOnair(args[7]);}
                        else { window.iMBCHandler.setAppBanner(args[1], args[2], args[3]); }
                        break;

                    case "onair":
                        window.iMBCHandler.setAppOnair(args[1]);
                        break;
                }
            }
            //ios
            else if (this.userAgent == "ios") {

                var msg;
                switch (args[0]) {
                    case "content":
                        msg = { 'setAppContent': { 'contentType': args[1], 'contentId': args[2], 'isFree':'N' } };
                        break;

                    case "bannerNews":
                        msg = { 'setAppBanner': { 'linkType': args[1], 'link': args[2], 'title': args[3] } };
                        break;

                    case "banner":
                        if (args[6] != "") {alert(args[6]);}
                        if (args[4] == "TAB") {msg = {'goTab': { 'tabName': args[1] } };}
                        else if (args[4] == "Clip" || args[4] == "VOD") { msg = { 'setAppContent': { 'contentType': args[4], 'contentId': args[5], 'isFree':'N' } };}
                        else if (args[4] == "Live" || args[4] == "MbicLive") { msg = { 'setAppOnair': { 'sCode': args[7] } };}
                        else { msg = { 'setAppBanner': { 'linkType': args[1], 'link': args[2], 'title': args[3] } };}
                        break;

                    case "onair":
                        msg = { 'setAppOnair': { 'sCode': args[1] } };
                        break;
                }
                window.webkit.messageHandlers.iMBCHandler.postMessage(msg);
            }
        }
    } 
}
</script>

<style scoped src='../../static/css/main.css'></style>

