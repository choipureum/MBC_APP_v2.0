<template>
    <div class='chHome nowfree container'>
        <!--상단 Main Top Slider -->
        <section class="program-wrap">
            <div class="chHome-wrap" v-if="mainTopList.length > 0">
                <div id="chHomeWrap" class="chHome-area type-full swiper-container">
                    <div :class="{'swiper-wrapper': mainTopList.length > 1}">
                        <div class="swiper-slide" :style="{'background':'url('+'https://img.imbc.com/template/'+item.MImg+')'}" v-for="(item,index) in mainTopList" v-on:click="clickInterface('topBanner',item.MLinkUrl)" v-bind:key='index'>
                            <a>
                                <div class="img"><img :src="'https://img.imbc.com/template/'+item.MImg" :alt="item.MTitle"></div> 
                                <div class="txt-wrap"><p class="title ellipsis2" v-html="item.MTitle"></p> <p class="program ellipsis" v-html="item.MContent"></p>
                                </div>
                            </a> 
                        </div>
                    </div>
                    <div class="pagination"></div>  
                </div>
            </div>

            <!-- 시청중 영상 시작 -->
            <div class="onair-wrap nowfree-onair" v-if="userSeamList.List.length > 0">
                <h2 class="tit-sec" v-if="userSeamList.username!=''"><strong>'{{userSeamList.username}}'</strong>님이 시청중인 영상</h2>
                <h2 class="tit-sec" v-else><span>당신이 시청 중인 영상</span></h2> 
                <div class="onair-area type_row ver01" id="nowVod">
                    <div class="slide">
                        <ul>
                            <li class="chn" v-for="(item,index) in userSeamList.List"  v-on:click="clickInterface('userSeam',item.VodType, item.ContentId, item.ProgramId)" v-bind:key='index'>
                                <a>        
                                    <div class="img" v-lazy-container="{ 
                                                    selector: 'img', 
                                                    error: movieDefaultImg, 
                                                    loading: movieDefaultImg 
                                                }">
                                        <img :data-src="item.ContentImg" :alt="item.ProgramTitle">            
                                        <div class="bar-area">
                                            <span class="bar" :style="{width: ((item.MediaTime/item.TotalDuration)*100) +'%'}"><strong></strong></span>
                                        </div>        
                                    </div>        
                                    <div class="txt-wrap">           
                                        <p class="title ellipsis2" v-html="item.ContentTitle"></p>
                                        <div class="info">
                                            <span class="num">{{parseInt(item.ContentNumber)}}회</span>
                                            <span class="date">{{item.ViewDate.substring(0,10)}}</span>
                                        </div>
                                    </div>    
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Theme List -->
            <div v-if="freeTheme.TotalCount > 0">
                <template v-for="(item,index) in freeTheme.List">
                    <div class="wrap-area"  v-bind:key='index'>
                        <h2 class="tit-sec" v-html="item.MTitle"></h2>
                        <div class="curation">          
                            <div class="type_row" :id="'proSlide'+index">
                                <div class="slide">
                                    <ul>
                                        <li v-for="(broadItem, broadIndex) in item.List" v-on:click="clickInterface('content', broadItem.BroadcastID.toString())" v-bind:key='broadIndex'>
                                            <a><span class="img" v-lazy-container="{ 
                                                selector: 'img', 
                                                error: movieDefaultImg, 
                                                loading: movieDefaultImg 
                                            }"><img :data-src="broadItem.PosterPicture" :alt="broadItem.Title"></span><div class="tit" v-html="broadItem.Title"></div></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Best 10 -->
            <div class="wrap-area wrap-best">
                <h2 class="tit-sec">BEST 10</h2>
                <div class="curation">          
                    <div class="type_row" id="bestSlide">
                        <div class="slide">
                            <ul>
                                <li v-for="(item,index) in best10List" v-on:click="clickInterface('content', item.BroadcastId)" v-bind:key='index'>
                                    <a><span class="img" v-lazy-container="{ 
                                    selector: 'img', 
                                    error: movieDefaultImg, 
                                    loading: movieDefaultImg 
                                }"><img :data-src="item.Img" :alt="item.Title"></span>
                                    <p class="txt" v-html="item.Title"></p></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="wrapper wrap-search">
                <div class="tabs">
                    <ul>
                        <li :class="{on: initLabeling.broad == 'drama'}" @click="categoryDataFilter('drama',1)"><button>드라마</button></li>
                        <li :class="{on: initLabeling.broad == 'variety'}" @click="categoryDataFilter('variety',2)"><button>예능</button></li>
                        <li :class="{on: initLabeling.broad == 'culture'}" @click="categoryDataFilter('culture',3)"><button>시사교양</button></li>
                    </ul>
                </div>
                <div class="wrap-sorts">
                    <div class="search">
                        <input type="text" maxlength="10" v-on:blur ="listDataFilter(0,'', $event.target.value)">
                        <button type="button" class="btn-search"><span class="icon ico-search">검색하기</span></button>
                    </div>
                    <div class="wrap-select">
                        <div class="select-box">
                            <select name="" id="" @change="listDataFilter($event.target.value,initial,'')">
                                <option value='0'>연도별</option> 
                                <option v-for="(year, index) in years" :value="year" v-bind:key='index'>{{ year }}</option>
                                <option value='2000'>2000년 이전</option>
                            </select>
                        </div>
                        <div class="select-box">
                            <select name="" id="" @change="listDataFilter(0, $event.target.value, '')"> 
                                <option value="">제목</option>
                                <option v-for="(txt, index) in koreans" :value="txt" v-bind:key='index'>{{ txt }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 검색결과 있을 때  -->
                <div class="wrap-program" v-if="freeList.List.length>0">
                    <ul>
                        <li v-on:click="clickInterface('content',item.BroadcastID.toString())" v-for="(item,index) in freeList.List" v-bind:key='index'>
                            <a>
                                <span class="img" v-lazy-container="{ 
                                    selector: 'img', 
                                    error: movieDefaultImg, 
                                    loading: movieDefaultImg 
                                }"><img :data-src="item.PosterPicture" :alt="item.Title"></span>
                                <div class="tit" v-html="item.Title"></div></a>
                        </li>
                    </ul>
                </div>                

                <infinite-loading @infinite="infiniteHandler" spinner="spiral" :identifier="infiniteId">
                    <div slot="no-results" v-show="freeList.List.length==0">
                        <span style="display: inline-block;padding-top: 50px;color: #a2a2a2;font-size: 16px;line-height: 29px;background: url(https://m.imbc.com/wiz/mbcapp/v2/static/images/ico-noti.png) no-repeat center top;background-size: 36px;">검색하신 프로그램이 존재하지 않습니다. <br>다른 키워드로 다시 검색해주세요.</span>
                    </div>
                    <div slot="no-more" style="color: rgb(102, 102, 102); font-size: 14px; padding: 10px 0px;">(c)2021 iMBC</div>
                </infinite-loading>       
            </div>
        </section>
        <button type="button" class="scroll-top" id="scrollTop" style="display: none;" :style="{ backgroundImage: 'url('+'./static/images/ico_top.png'+')' }" v-on:click='moveTop()' v-once>상단으로 이동</button>   
    </div>
</template>

<script>
import {
  checkMobile,
  getDateFormat,
  bannerDefaultImg,
  sliderType,
  sliderBanner,
  getCookie
} from "../common/common.js";
import InfiniteLoading from "vue-infinite-loading";



export default{
    props:['userAgent'],
    data(){
        return{
            movieDefaultImg:"https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_vod_movie_list.png",
            mainTopList: [],
            userSeamList: {
                username: "",
                List: [],
            },
            freeTheme: {
                TotalCount: 0,
                List: [],
            },
            best10List: [],
            initRender:false,
            limit: 2,
            endYear: 0,
            initial: "", // 필터
            keyword: "", // 검색
            infiniteId: +new Date(),
            initLabeling: {
                broad: "drama", // 카테고리 이름
                subCategoryId: 1, // 카테고리 id
            },
            freeList: {
                TotalCount: 0,
                List: [],
            },
        }
    },
    mounted(){
        this.userSeamList.username = getCookie('IMBCNAME');
        var _that = this;
        _that.Init();
        this.UiFlicking();
    },
    beforeUpdate(){
        this.$nextTick(()=>{
        if(!this.initRender) {
            sliderBanner();
            this.initRender = true; 
        } 
        });
    },
    updated() {
        this.$nextTick(()=>{
            this.UiFlicking();
        });
    },
    computed: {
        years(){
            const year = new Date().getFullYear();
            var arr = new Array();
            arr = Array.from({ length: year - 2000 }, (value, index) => year - index );
            return arr;
        },
        koreans(){
            var arr = [
                "ㄱ",
                "ㄴ",
                "ㄷ",
                "ㄹ",
                "ㅁ",
                "ㅂ",
                "ㅅ",
                "ㅇ",
                "ㅈ",
                "ㅊ",
                "ㅋ",
                "ㅌ",
                "ㅍ",
                "ㅎ",
                "기타",
            ];
            return arr;
        },
    },
    methods: {
        Init(){
            try {
                this.InitMainTop();
                this.InitUserSeamData();
                this.InitFreeTheme();
                this.InitBestTen();
                this.InitFreeData();
            } catch (e) {}
            },
            UiFlicking(){
            //시청중 영상
            sliderType("#nowVod", 8);
            //추천 영역
            for (var i = 0; i < $(".curation").length; i++) {
                sliderType("#proSlide" + i, 11);
            }
            //best 10
            sliderType("#bestSlide", 9);
        },
        InitMainTop() {
            var _this = this;
            var mainTopUrl =
                "https://playvod.imbc.com/api/NowFreeMainTop?date=" + getDateFormat();
            /**
             * @title 지금무료 메인 Top
             */
            $.ajax({
                url: mainTopUrl,
                dataType: "json",
                async: true,
                cache: true,
                timeout: 10000,
                success: function (o) {
                if (o.length > 0)
                    $.each(o, function (index, item) {
                    _this.mainTopList.push(item);
                    });
                },
            });
        },
        InitUserSeamData(){
            var _this = this;
            var userSeamUrl =
                "https://mediaapi.imbc.com/Seamless/UserFreeSeamList?date=" +
                getDateFormat();
            /**
             * @title 유저가 시청중인 영상들
             */
            $.ajax({
                url: userSeamUrl,
                dataType: "json",
                async: true,
                cache: true,
                timeout: 10000,
                crossDomain: true,
                xhrFields: { withCredentials: true },
                success: function (o) {
                if (o.SeamList.length > 0)
                    $.each(o.SeamList, function (index, item) {
                    _this.userSeamList.List.push(item);
                    });
                },
            });
        },
        InitFreeTheme(){
            var _this = this;
            var freeThemeUrl =
                "https://control.imbc.com/TV/FreeTheme?date=" + getDateFormat();
            /**
             * @title 지금무료 주제별 리스트
             */
            $.ajax({
                url: freeThemeUrl,
                dataType: "json",
                async: true,
                cache: true,
                timeout: 10000,
                success: function (o) {
                if (o.length > 0) _this.freeTheme.TotalCount = o.length;
                $.each(o, function (index, item) {
                    _this.freeTheme.List.push(item);
                });
                },
            });
        },
        InitBestTen() {
            var _this = this;
            var best10Url =
                "https://playvod.imbc.com/api/NowFreeBest10?date=" + getDateFormat();
            /**
             * @title 지금무료 BEST 10
             */
            $.ajax({
                url: best10Url,
                dataType: "json",
                async: true,
                cache: true,
                timeout: 10000,
                success: function (o) {
                if (o.length > 0)
                    $.each(o, function (index, item) {
                    _this.best10List.push(item);
                    });
                },
            });
        },
        InitFreeData(){
            var _this = this;

            var url =
                "https://control.imbc.com/TV/FreeProgram?date=" +
                getDateFormat() +
                "&subCategoryId=" +
                _this.initLabeling.subCategoryId +
                "&curPage=1&pageSize=12&endYear=" +
                _this.endYear +
                "&initial=" +
                _this.initial +
                "&keyword=" +
                _this.keyword;

            /**
             * @title  지금 무료
             */
            $.ajax({
                url: url,
                dataType: "json",
                async: true,
                cache: true,
                timeout: 10000,
                success: function (o) {
                if (o.TotalCount > 0) {
                    $.each(o.List, function (index, item) {
                    _this.freeList.List.push(item);
                    });
                }
                },
            });
        },
        infiniteHandler($state){
            var _this = this;

            var url =
                "https://control.imbc.com/TV/FreeProgram?date=" +
                getDateFormat() +
                "&subCategoryId=" +
                _this.initLabeling.subCategoryId +
                "&curPage=" +
                _this.limit +
                "&pageSize=12&endYear=" +
                _this.endYear +
                "&initial=" +
                _this.initial +
                "&keyword=" +
                _this.keyword;

            const EACH_LEN = 12;
            fetch(url, { method: "get" })
                .then((resp) => {
                return resp.json();
                })
                .then((data) => {
                setTimeout(() => {
                    if (data.List.length) {
                    _this.freeList.List = _this.freeList.List.concat(data.List);
                    $state.loaded();
                    _this.limit += 1;
                    if (data.List.length / EACH_LEN < 1) {
                        $state.complete();
                    }
                    } else {
                    $state.complete();
                    }
                }, 1000);
                })
                .catch((err) => {
                console.error(err);
                });
        },
        changeType() {
            var _this = this;
            _this.freeList.List = [];
            _this.freeList.TotalCount = 0;
            _this.limit = 2;
            this.infiniteId += 1;  
            this.InitFreeData();
        },
        listDataFilter(endYear, initial, keyword){
            this.endYear = endYear;
            this.keyword = keyword;
            this.initial = initial;
            this.changeType();
        },
        categoryDataFilter(broad, subCategoryId){
            this.initLabeling.broad = broad;
            this.initLabeling.subCategoryId = subCategoryId;
            this.changeType();
            return false;
        },
        moveTop(){
            $(document).scrollTop(0);   
        },
        clickInterface (...args) {
        /*
        * @param arguments
        *
        */
        //android
        if (this.userAgent == "android") {
            switch(args[0]){
                case "topBanner":
                    var bid = args[1].substring(args[1].indexOf("bid")+4);
                    window.iMBCHandler.setAppContent('VOD', bid, 'Y');
                    break;
                
                case "userSeam":
                    var type;
                    if(args[1] == "MOVIE"){type="Movie"; window.iMBCHandler.setAppContentETC(type, args[2], args[3]);}
                    else if(args[1] == "ABROAD"){type="Overseas"; window.iMBCHandler.setAppContentETC(type, args[2], args[3]);}
                    else{type="VOD"; window.iMBCHandler.setAppContent(type, args[2], 'Y');}
                    break;

                case "content":
                    window.iMBCHandler.setAppContent('VOD', args[1], 'Y');
                    break;
                }
        }
        //ios
        else if(this.userAgent == "ios") {
            var msg;
            switch(args[0]){
                case "topBanner":
                    var bid = args[1].substring((args[1].indexOf("bid")+4));
                    msg = {setAppContent: { contentType: 'VOD', contentId: bid, isFree:'Y' },};  
                    break;
                
                case "userSeam":
                    var type;
                    if(args[1] == "MOVIE"){type="Movie"; msg = {setAppContentETC: { contentType: type, contentId: args[2], programId: args[3]},};}
                    else if(args[1] == "ABROAD"){type="Overseas"; msg = {setAppContentETC: { contentType: type, contentId: args[2], programId: args[3]},};}
                    else{type="VOD";  msg = {setAppContent: { contentType: type, contentId: args[2], isFree:'Y'},};}
                    break;
                
                case "content":
                    msg = {setAppContent: { contentType: 'VOD', contentId: args[1], isFree:'Y' },};
                    break;
            }
            window.webkit.messageHandlers.iMBCHandler.postMessage(msg);
        }
    },
    }
}
</script>
<style scoped lang='scss' src='../../static/css/nowFree.css'></style>
<style scoped lang='scss' src='../../static/css/sub.css'></style>

