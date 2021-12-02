<!--
/**
 * @router component
 * @name replay.vue
 * @title mbc 다시보기 컴포넌트
 * @description 프로모션, 시청중인 프로그램 리스트, 꿀잼방송, 주간베스트, 에디터픽, 예고, 현장스케치, 구작추천
 * @author (c) 2021 iMBC
 */
-->
<template>
    <div class='wrap_vod' v-show="initRender">
       <!-- 상단 TOP 배너-->
        <div class="wrap_banner" v-if="topBanner.length > 0" v-on:click="clickInterface('banner', topBanner[0].Info.Relation.BID, topBanner[0].Info.Relation.LinkType, topBanner[0].Info.Relation.LinkURL, topBanner[0].Info.Relation.NoticeMsg)">
            <h2 class="blind">홍보 배너</h2>
            <a v-lazy-container="{ selector: 'img' }">
            <img :data-src="topBanner[0].Info.Image" :alt="topBanner[0].Info.Title">
                <div class="banner_txt">
                    <p class="title" v-html="topBanner[0].Info.Title"></p>
                    <p class="date" v-html="topBanner[0].Info.Desc"></p>
                </div>
            </a>
        </div>

        <!-- 프로그램 프로모션 -->
        <section v-if="programPromotionList.List.length != 0" class="wrap_promo"  :style="{'background-image':'url('+programPromotionList.promotionImage+')'}" style="background-size:100%">
            <button type="button" class="close-promo">접기</button>
            <div class="promo-list">
                <div class="type_row" id="promoWrap">
                    <div class="slide">
                        <ul>
                            <li v-for="(item,index) in programPromotionList.List" v-on:click="clickInterface('promo',item.ContentType, item.URL, item.BroadCastID)" v-bind:key='index'>
                                <a>
                                    <span class="img" v-lazy-container="{ selector: 'img' }">
                                        <img :data-src="item.Image" :alt="item.Title">
                                    </span>
                                    <p class="txt ellipsis2" v-html="item.Title" :style="{color:programPromotionList.promotionThemaColor}"></p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- 시청중인 프로그램 리스트 -->
        <div v-if="userSeamList.List.length > 0">
            <h2 class="b_title" v-if="userSeamList.username!=''">'{{userSeamList.username}}'<span>님이 시청 중인 콘텐츠</span></h2>
            <h2 class="b_title" v-else><span>당신이 시청 중인 콘텐츠</span></h2>
            <div class="type_row" id="row1">
                <div class="slide">
                    <ul>
                        <li class="vod" v-on:click="clickInterface('userSeam',item.VodType, item.ContentId, item.ProgramId)" v-for="(item,index) in userSeamList.List" v-bind:key='index'>
                            <span class="img" v-lazy-container="{ selector: 'img' }"><img :data-src="item.ContentImg" :alt="item.ProgramTitle"><span class="bar" :style="{width: ((item.MediaTime/item.TotalDuration)*100) +'%'}"></span></span>
                            <div class="txt">
                                <span class="title ellipsis" v-html="item.ContentTitle"></span> 
                                <span class="program">{{item.ProgramTitle}}  {{parseInt(item.ContentNumber)}}회</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- MBC 꿀잼방송 -->
        <div v-if="newestVODList.length > 0">
            <h2 class="b_title" v-if="userSeamList.username!=''">'{{userSeamList.username}}'<span>님이 놓친 어제 MBC 꿀잼 방송</span></h2>  
            <h2 class="b_title" v-else><span>당신이 놓친 어제 MBC 꿀잼 방송</span></h2>       
            <div class="type_row" id="row2">
                <div class="slide">
                    <ul>
                        <li class="vod" v-for="(item,index) in newestVODList" v-on:click="clickInterface('content',item.ContentType,item.BroadCastID)" v-bind:key='index'>
                            <span class="img" v-lazy-container="{ selector: 'img' }"><img :data-src="item.Image" :alt="item.Title"></span>
                            <div class="txt">
                                <span class="title ellipsis">{{item.Title}}</span> 
                                <span class="program">{{item.ProgramTitle}} {{item.ContentNumber}}회</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 주간 BEST -->
        <div v-if="bestVODList.length > 0">
            <h2 class="b_title">주간 BEST</h2>
            <div class="type_row" id="row3">
                <div class="slide">
                    <ul>
                        <li class="vod" v-for="(item,index) in bestVODList" v-on:click="clickInterface('content',item.ContentType,item.BroadCastID)" v-bind:key='index'>
                            <span class="label">다시보기</span>
                            <span class="img" v-lazy-container="{ selector: 'img' }"><img :data-src="item.Image" :alt="item.Title"></span>
                            <div class="txt">
                                <span class="title ellipsis" v-html="item.Title"></span> 
                                <span class="program" v-html="item.ProgramTitle"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 예고 -->
        <div v-if="previewVODList.length > 0">
            <h2 class="b_title">예고</h2>
            <div class="type_row" id="row4">
                <div class="slide">
                    <ul>
                        <li class="vod" v-for="(item,index) in previewVODList" v-on:click="clickInterface('content', 2 ,item.Info.Relation.BID)" v-bind:key='index'>
                            <span class="label">예고</span>
                            <span class="img" v-lazy-container="{ selector: 'img' }"><img :data-src="item.Info.Relation.ContentImage" :alt="item.Info.Title"></span>
                            <div class="txt">
                                <span class="title ellipsis" v-html="item.Info.Title"></span> 
                                <span class="program">{{item.Info.Program}} {{item.Info.Relation.ContentNumber}}회</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Editor's Pick -->
        <div v-if="editorPickList.List.length > 0" class="wrap_editor type_row">
            <h2 class="b_title">Editor's pick</h2>
            <span class="tit_info" v-html="editorPickList.List[editorPickList.editorIdx].EditorTitle"></span>
            <ul>
                <li class="vod" v-for="(item,index) in editorPickList.List[editorPickList.editorIdx].List" v-on:click="clickInterface('editorPick', item.ContentType ,item.BID)" v-bind:key='index'>
                    <span class="img" v-lazy-container="{ selector: 'img' }"><img :data-src="item.Image" :alt="item.Title"></span>
                    <div class="txt">
                        <span class="title ellipsis" v-html="item.Title"></span> 
                        <span class="program"></span>
                    </div>
                </li>
            </ul>
            <button v-on:click="editorIdxCnt" type="button" class="btn_refresh" :style="{ backgroundImage: 'url('+'./static/images/btn_refresh.png'+')' }">다음 콘텐츠 보기 {{(editorPickList.editorIdx+1)}}/{{editorPickList.totalCnt}}</button>
        </div>

        <!-- 현장스케치 -->
        <div v-if="sketchVODList.length > 0">
            <h2 class="b_title">현장스케치</h2>
            <div class="type_row" id="row5">
                <div class="slide">
                    <ul>
                        <li class="vod" v-for="(item,index) in sketchVODList" v-on:click="clickInterface('content', 5 ,item.Info.Relation.BID)" v-bind:key='index'>
                            <span class="label">현장스케치</span>
                            <span class="img" v-lazy-container="{ selector: 'img' }"><img :data-src="item.Info.Relation.ContentImage" :alt="item.Info.Title"></span>
                            <div class="txt">
                                <span class="title ellipsis" v-html="item.Info.Title"></span> 
                                <span class="program">{{item.Info.Program}} {{item.Info.Relation.ContentNumber}}회</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 구작 추천 -->
        <div v-if="oldRecommendVODList.List.length > 0" class="wrap_legend">
            <h2 class="b_title">구작추천</h2>
            <div class="type_row type2" id="row6">
                <div class="slide">
                    <ul>
                        <li v-for="(item,index) in oldRecommendVODList.List" v-on:click="clickInterface('legend',item.BID)" v-bind:key='index'>
                            <a>
                                <span class="img" v-lazy-container="{ 
                                    selector: 'img', 
                                    error: movieDefaultImg, 
                                    loading: movieDefaultImg 
                                }">
                                <img :data-src="item.Image" :alt="item.Title"></span>
                                <span class="title ellipsis">{{item.Title.substring(1)}}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <button type="button" class="scroll-top" id="scrollTop" :style="{ backgroundImage: 'url('+'./static/images/ico_top.png'+')' }" v-on:click='moveTop()' v-scroll>상단으로 이동</button>   
    </div>
</template>

<script>
import { getDateFormat, sliderType, getCookie, upBtnFunc } from "../common/common.js";

export default{
  props:['userAgent'],
  data(){
    return{
        initRender:false,
        movieDefaultImg:"https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_vod_movie_list.png",
        topBanner: [], // 상단배너
        programPromotionList: {
            promotionTitle: "",
            promotionBid: "",
            promotionImage: "",
            promotionThemaColor:"#bababa",
            List:[]
        },
        userSeamList: {
            username: "",
            List:[]
        }, 
        newestVODList: [], // '철수'님이 놓친 어제 MBC 꿀잼 방송
        bestVODList: [], // 주간BEST
        previewVODList: [], // 예고
        sketchVODList: [], // 현장스케치
        editorPickList: {
            editorIdx : 0,
            totalCnt : 0,
            List: []
        }, // Editor's Pick
        oldRecommendVODList: {
            Thema: "",
            Link: "",
            Channel: "",
            List: [],
        }, // 구작추천
    }
  },
  mounted() {
    this.userSeamList.username = getCookie('IMBCNAME');
    var _that = this;
    _that.Init();
    this.UiFlicking();

  },
  updated() {
    this.$nextTick(() =>{
      this.UiFlicking();
      this.initRender = true;
      upBtnFunc();
    });
  },
  watch:{
  },
  computed: {
  },
  methods: {
    Init() {
      try {
        this.InitTopBannerData();
        this.InitProgramPromotionBidData();
        this.InitUserSeamData();
        this.InitNewestVODData();
        this.InitBestVODData();
        this.InitPreviewVODData();
        this.InitEditorPickData();
        this.InitSketchVODData();
        this.InitOldRecommendVODData();
      } catch (e) {}
    },
    UiFlicking(){
      // 프로모션
      sliderType('#promoWrap',6);
      $('.close-promo').click(function(){
          $(this).parent().hide();
      });
      // 가로 플리킹 스크롤
      for (var i = 0; i < 7; i++) {
          sliderType('#row' + (i + 1), 10);
      }
    },
    InitTopBannerData() {
      var _this = this;
      var topBannerUrl =
        "https://control.imbc.com/MBCApp/Banner/VOD?date=" + getDateFormat();
      /**
       * @title 상단 배너 매핑
       */
      $.ajax({
        url: topBannerUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            var n = o.length - 1;
            _this.topBanner.push(o[n]);
          }
        },
      });
    },
    InitProgramPromotionBidData() {
      var _this = this;
      var programPromotionBidUrl =
        "https://control.imbc.com/WebApi/Main/ProgramPromotion?deviceType=m&date=" +
        getDateFormat();
      /**
       * @title 프로그램 프로모션 bid 매핑
       */
      $.ajax({
        url: programPromotionBidUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o != null && o.length > 0) {
            _this.programPromotionList.promotionTitle = o[0].Title;
            _this.programPromotionList.promotionBid = o[0].BID;
            _this.programPromotionList.promotionImage = o[0].Image;
            _this.programPromotionList.promotionThemaColor = o[0].FontColor;
            _this.InitProgramPromotionData();
          }
        },
      });
    },
    InitProgramPromotionData() {
      var _this = this;
      var programPromotionUrl =
        "https://control.imbc.com/WebApi/Main/RelationContent?deviceType=m&top=12&broadcastID=" +
        _this.programPromotionList.promotionBid +
        "&date=" +
        getDateFormat();
      /**
       * @title 프로그램 프로모션
       */
      $.ajax({
        url: programPromotionUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            $.each(o, function (index, item) {
              _this.programPromotionList.List.push(item);
            });
          }
        },
      });
    },
    InitUserSeamData() {
      var _this = this;
      var userSeamUrl =
        "https://mediaapi.imbc.com/Seamless/UserSeamList?date=" +
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
          if(o.SeamList.length > 0)      
            $.each(o.SeamList, function (index, item) {
              _this.userSeamList.List.push(item);
            });
        },
      });
    },
    InitNewestVODData() {
      var _this = this;
      var newestVODUrl =
        "https://control.imbc.com/App/V2/VOD/Newest?date=" + getDateFormat();
      /**
       * @title 최신 VOD
       */
      $.ajax({
        url: newestVODUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            $.each(o, function (index, item) {
              _this.newestVODList.push(item);
            });
          }
        },
      });
    },
    InitBestVODData() {
      var _this = this;
      var bestVODUrl =
        "https://control.imbc.com/WebApi/Main/WeekBestVod?deviceType=m&top=12&day=7&date=" +
        getDateFormat();
      /**
       * @title 주간베스트 VOD
       */
      $.ajax({
        url: bestVODUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            $.each(o, function (index, item) {
              _this.bestVODList.push(item);
            });
          }
        },
      });
    },
    InitPreviewVODData() {
      var _this = this;
      var previewVODUrl =
        "https://control.imbc.com/MBCApp/Timeline/ContentType?ContentType=2&date=" +
        getDateFormat();
      /**
       * @title 예고 VOD
       */
      $.ajax({
        url: previewVODUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            $.each(o, function (index, item) {
              _this.previewVODList.push(item);
            });
          }
        },
      });
    },
    InitSketchVODData() {
      var _this = this;
      var sketchVODUrl =
        "https://control.imbc.com/MBCApp/Timeline/ContentType?ContentType=5&date=" +
        getDateFormat();
      /**
       * @title 현장스케치 VOD
       */
      $.ajax({
        url: sketchVODUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            $.each(o, function (index, item) {
              _this.sketchVODList.push(item);
            });
          }
        },
      });
    },
    InitEditorPickData() {
      var _this = this;
      const num = Math.ceil((Math.random() * 10) / 3);

      var editorPickUrl =
        "https://control.imbc.com/WebApi/Main/ChannelEditor?deviceType=m&channel=" +
        num +
        "&date=" +
        getDateFormat();
      /**
       * @title 에디터 픽 랜덤 노출
       */
      $.ajax({
        url: editorPickUrl,
        dataType: "json",
        async: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            _this.editorPickList.List = o;
          }
          _this.editorPickList.editorIdx = 0;
          _this.editorPickList.totalCnt = o.length;
        },
      });
    },
    InitOldRecommendVODData() {
      var _this = this;
      var oldRecommendVODUrl =
        "https://control.imbc.com/WebApi/Main/Legend?deviceType=m&channel=0&top=1&opt=N&date=" +
        getDateFormat();
      /**
       * @title 구작 추천
       */
      $.ajax({
        url: oldRecommendVODUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            _this.oldRecommendVODList.Thema = o[0].Thema;
            _this.oldRecommendVODList.Link = o[0].Link;
            _this.oldRecommendVODList.Channel = o[0].Channel;
            _this.oldRecommendVODList.List = o[0].List;
          }
        },
      });
    },
    urlLink(link) {
      location.href = link;
    },
    moveTop(){
        $(document).scrollTop(0);   
    },
    editorIdxCnt(){
      var _this = this;
      if(_this.editorPickList.editorIdx >= 7){
        _this.editorPickList.editorIdx = 0;
      } 
      else{
        _this.editorPickList.editorIdx+=1;
      } 
    },
    clickInterface(...args) {
      /*
       * @param arguments
       *
       */
      //android
      if (this.userAgent == "android") {
        switch (args[0]) {
          case "banner":
            if (args[4] != "") {alert(args[4]);}
            else if(args[1] == '0'){window.iMBCHandler.setAppBanner(args[2], args[3], '다시보기');}
            else{window.iMBCHandler.setAppContent('VOD', args[1], 'N');}
            break;

          case "promo":
            if(args[1] == 1){window.iMBCHandler.setAppContent('VOD', args[3], 'N');}
            else if(args[1] == 3){window.iMBCHandler.setAppContent('Clip', args[3], 'N');}
            else if(args[1] == 5){window.iMBCHandler.setAppContent('Sketch', args[3], 'N');}
            else{window.iMBCHandler.setAppBanner("APP_LINK",args[2],'연예');}  
            break;

          case "userSeam":
            var type;
            if(args[1] == "MOVIE"){type="Movie"; window.iMBCHandler.setAppContentETC(type, args[2], args[3]);}
            else if(args[1] == "ABROAD"){type="Overseas"; window.iMBCHandler.setAppContentETC(type, args[2], args[3]);}
            else{type="VOD"; window.iMBCHandler.setAppContent(type, args[2], 'N');}
            break;
          
          case "content":
            if(args[1] == 1){window.iMBCHandler.setAppContent('VOD', args[2], 'N');}
            else if(args[1] == 2){window.iMBCHandler.setAppContent('Preview', args[2], 'N');}
            else if(args[1] == 3){window.iMBCHandler.setAppContent('Clip', args[2], 'N');}
            else if(args[1] == 5){window.iMBCHandler.setAppContent('Sketch', args[2], 'N');}
            break;

          case "editorPick":
            if(args[1] == 'Special') args[1] = 'Sketch';
            window.iMBCHandler.setAppContent(args[1], args[2], 'N');
            break;

          case "legend":
            window.iMBCHandler.setAppContent('VOD', args[1], 'N');
            break;
        }
      }
      //ios
      else if (this.userAgent == "ios") {
        var msg;
        switch (args[0]) {
          case "banner":
            if (args[4] != "") {alert(args[4]); }
            if(args[1] == '0'){msg = { 'setAppBanner': { 'linkType': args[2], 'link': args[3], 'title': '다시보기' } };}
            else{msg = {setAppContent: { contentType: 'VOD', contentId: args[1], isFree:'N' },};}
            break;

          case "promo":
            if(args[1] == 1){msg = {setAppContent: { contentType: 'VOD', contentId: args[3], isFree:'N' },};}
            else if(args[1] == 3) {msg = {setAppContent: { contentType: 'Clip', contentId: args[3], isFree:'N' },};}
            else if(args[1] == 5) {msg = {setAppContent: { contentType: 'Sketch', contentId: args[3], isFree:'N' },};}
            else{msg = { 'setAppBanner': { 'linkType': "APP_LINK", 'link': args[2], 'title': '연예' } };}         
            console.log(msg);        
            break;
            
          case "userSeam":
            var type;
            if(args[1] == "MOVIE"){type="Movie"; msg = {setAppContentETC: { contentType: type, contentId: args[2], programId: args[3]},};}
            else if(args[1] == "ABROAD"){type="Overseas"; msg = {setAppContentETC: { contentType: type, contentId: args[2], programId: args[3]},};}
            else{type="VOD";  msg = {setAppContent: { contentType: type, contentId: args[2], isFree:'N'},};}
            break;

          case "content":
            if(args[1] == 1){msg = {setAppContent: { contentType: 'VOD', contentId: args[2], isFree:'N' },};}
            else if(args[1] == 2){msg = {setAppContent: { contentType: 'Preview', contentId: args[2], isFree:'N' },};}
            else if(args[1] == 3) {msg = {setAppContent: { contentType: 'Clip', contentId: args[2], isFree:'N' },};}
            else if(args[1] == 5) {msg = {setAppContent: { contentType: 'Sketch', contentId: args[2], isFree:'N' },};}
            break;
          
          case "editorPick":
            if(args[1] == 'Special') args[1] = 'Sketch';
            msg = {setAppContent: { contentType: args[1] ,contentId: args[2], isFree:'N' },};  
            break;

          case "legend":
            msg = {setAppContent: { contentType: 'VOD' ,contentId: args[1], isFree:'N' },};
            break;
        }
        window.webkit.messageHandlers.iMBCHandler.postMessage(msg);
      }
    },
  },
};
</script>
<style scoped src='../../static/css/sub.css'></style>
