<!--
/**
 * @router component
 * @name onAir.vue
 * @title mbc 온에어 컴포넌트
 * @description 스포츠,제작발표회,편성표
 * @author (c) 2021 iMBC
 */
-->
<template>
  <div class="wrap_onair" v-show="initRender">
    <!-- 프로모션 배너 타입 B (배경이미지 + 텍스트) -->
    <div
      class="wrap_banner"
      v-if="topBanner.length > 0"
      v-on:click="
        clickInterface(
          'banner',
          topBanner[0].Info.Relation.ScheduleCode,
          topBanner[0].Info.Relation.NoticeMsg,
          topBanner[0].Info.Relation.ActionType,
          topBanner[0].Info.Relation.LinkType,
          topBanner[0].Info.Relation.LinkURL
        )
      "
    >
      <h2 class="blind">홍보 배너</h2>
      <a>
        <img :src="topBanner[0].Info.Image" :alt="topBanner[0].Info.Title" />
        <div class="banner_txt">
          <p class="title" v-html="topBanner[0].Info.Title"></p>
          <p class="date" v-html="topBanner[0].Info.Desc"></p>
        </div>
      </a>
    </div>

    <!-- 스포츠 -->
    <!--
            <div v-if="sportsList.length > 0">
                <h2 class="b_title">스포츠</h2>
                <div class="wrapper thumb_list">
                    <ul>
                        <li class="vod" v-for="(item,index) in sportsList" v-on:click="clickInterface('sports', item.link)" :key='index'>
                            <span class="img" v-lazy-container="{ selector: 'img' }"><img :data-src="item.TitleImage" :alt="item.Title"></span>
                            <div>
                                <span class="title ellipsis2" v-html="item.Title"></span> 
                                <span class="program ellipsis">스포츠</span> 
                                <span class="writer">
                                    {{item.StartDate.substring(9,13).slice(0,2) + ':' + item.StartDate.substring(9,13).slice(2)}}~{{item.EndDate.substring(9,13).slice(0,2) + ':' + item.EndDate.substring(9,13).slice(2)}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            -->
    <!-- 제작 발표회 -->
    <div v-if="programList.length > 0">
      <h2 class="b_title">제작발표회</h2>
      <div class="wrapper thumb_list">
        <ul>
          <li
            class="vod"
            v-for="(item, index) in programList"
            v-on:click="clickInterface('program', item.MobileLiveurl)"
            :key="index"
          >
            <span class="img" v-lazy-container="{ selector: 'img' }"
              ><img
                :data-src="item.PlayerimageFileurl"
                :alt="item.ProgramTitle"
            /></span>
            <div>
              <span class="title ellipsis2" v-html="item.ProgramTitle"></span>
              <span class="program ellipsis">제작발표회</span>
              <span class="writer"
                >{{ item.PlayerStart.substring(11) }}~{{
                  item.PlayerEnd.substring(11)
                }}</span
              >
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- TV 편성표: TV -->
    <div v-if="scheduleList.length > 0">
      <h2 class="b_title">TV</h2>
      <div class="wrapper thumb_list">
        <ul>
          <li
            class="vod"
            v-on:click="clickInterface('schedule', item.ScheduleCode)"
            v-for="(item, index) in scheduleList"
            :key="index"
          >
            <span class="img"
              ><img
                :data-url="item.OnAirImage"
                :alt="item.Title"
                v-on:error="replaceByDefault"
                v-img-lazy-loading
              /><span
                class="bar"
                :style="{ width: item.percentTime + '%' }"
              ></span>
              <span
                class="vod_btn_play"
                :style="{
                  backgroundImage:
                    'url(' + './static/images/btn_play.png' + ')',
                }"
              ></span>
            </span>
            <div>
              <span class="title ellipsis2" v-html="item.Title"></span>
              <span class="program ellipsis" v-html="item.TypeTitle"></span>
              <span class="writer"
                >{{
                  item.StartTime.slice(0, 2) + ":" + item.StartTime.slice(2)
                }}~{{
                  item.EndTime.slice(0, 2) + ":" + item.EndTime.slice(2)
                }}</span
              >
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 라디오 편성표: RADIO -->
    <div v-if="radioList.length > 0">
      <h2 class="b_title">라디오</h2>
      <div class="wrapper thumb_list">
        <ul>
          <li
            class="vod"
            v-on:click="clickInterface('schedule', item.ScheduleCode)"
            v-for="(item, index) in radioList"
            :key="index"
          >
            <span class="img" v-lazy-container="{ selector: 'img' }"
              ><img :data-src="item.OnAirImage" :alt="item.Title" /><span
                class="bar"
                :style="{ width: item.percentTime + '%' }"
              ></span>
              <span
                class="vod_btn_play"
                :style="{
                  backgroundImage:
                    'url(' + './static/images/btn_play.png' + ')',
                }"
              ></span>
            </span>
            <div>
              <span class="title ellipsis2" v-html="item.Title"></span>
              <span class="program ellipsis" v-html="item.TypeTitle"></span>
              <span class="writer"
                >{{
                  item.StartTime.slice(0, 2) + ":" + item.StartTime.slice(2)
                }}~{{
                  item.EndTime.slice(0, 2) + ":" + item.EndTime.slice(2)
                }}</span
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  checkMobile,
  getDateFormat,
  ImgLazyLoading,
  replaceByDefault,
} from "../common/common.js";

export default {
  props: ["userAgent"],
  data() {
    return {
      initRender: false,
      topBanner: [],
      sportsList: [],
      programList: [],
      scheduleList: [],
      radioList: [],
      defaultImg:
        "https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_vod_drama_list.png",
    };
  },
  directives: {
    "img-lazy-loading": ImgLazyLoading,
  },
  mounted() {
    //30분이상 행동없으면 리로딩(컴포넌트 공통)
    $("meta[name='refreshApp']").attr("content", "1800;url=" + location.href);

    var _that = this;
    _that.Init();
  },
  updated() {
    this.$nextTick(() => {
      this.initRender = true;
    });
  },
  computed: {},
  methods: {
    Init() {
      try {
        this.InitTopBannerData();
        this.InitSportsData(); //이벤트성 LIVE -> 제작발표회랑 연동 둘다없을경우 다 미노출
        this.InitScheduleData();
      } catch (e) {}
    },
    InitTopBannerData() {
      var _this = this;
      var topBannerUrl =
        "https://control.imbc.com/MBCApp/Banner/Live?type=" +
        checkMobile() +
        "&category=1&date=" +
        getDateFormat();
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
            _this.topBanner.push(o[0]);
          }
        },
      });
    },
    InitSportsData() {
      var _this = this;
      var sportsUrl =
        "https://control.imbc.com/Sports/Schedule/V2?date=" + getDateFormat();
      /**
       * @title 스포츠 매핑
       */
      $.ajax({
        url: sportsUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            var n = o.length - 1;
            $.each(o, function (index, item) {
              //Y로 변경할것
              if (item.IsOnAir == "Y") _this.sportsList.push(item);
            });
          }
          //제작발표회
          _this.InitProgramData();
        },
      });
    },
    InitProgramData() {
      var _this = this;
      var scheduleUrl =
        "https://control.imbc.com/Program/LiveList?date=" + getDateFormat();
      /**
       * @title 제작발표회 매핑
       */
      $.ajax({
        url: scheduleUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.length > 0) {
            var n = o.length - 1;
            $.each(o, function (index, item) {
              _this.programList.push(item);
            });
          }
        },
      });
    },
    InitScheduleData() {
      var _this = this;
      var scheduleUrl =
        "https://control.imbc.com/Schedule/PCONAIR?type=APP&date=" +
        getDateFormat();
      /**
       * @title TV 매핑
       */
      $.ajax({
        url: scheduleUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          const { TVList, RadioList } = o;
          _this.scheduleList = [...TVList];
          _this.radioList = [...RadioList];
        },
      });
    },
    replaceByDefault(e) {
      e.target.src = this.defaultImg;
    },
    clickInterface(...args) {
      /*
       * @param arguments
       *
       */
      var msg;
      //android
      if (this.userAgent == "android") {
        switch (args[0]) {
          case "banner":
            if (args[2] != "") {
              alert(args[2]);
            }
            if (args[3] == "Banner") {
              window.iMBCHandler.setAppBanner(args[4], args[5], "온에어");
            } else {
              window.iMBCHandler.setAppOnair(args[1]);
            }
            break;
          case "sports":
            window.iMBCHandler.setAppBanner("WEB", args[1], "스포츠");
            break;
          case "program":
            window.iMBCHandler.setAppBanner("WEB", args[1], "제작발표회");
            break;
          case "schedule":
            window.iMBCHandler.setAppOnair(args[1]);
            break;
        }
      }
      //ios
      else if (this.userAgent == "ios") {
        switch (args[0]) {
          case "banner":
            if (args[2] != "") {
              alert(args[2]);
            }
            if (args[3] == "Banner") {
              msg = {
                setAppBanner: {
                  linkType: args[4],
                  link: args[5],
                  title: "온에어",
                },
              };
            } else {
              msg = { setAppOnair: { sCode: args[1] } };
            }
            break;
          case "sports":
            msg = {
              setAppBanner: { linkType: "WEB", link: args[1], title: "스포츠" },
            };
            break;
          case "program":
            msg = {
              setAppBanner: {
                linkType: "WEB",
                link: args[1],
                title: "제작발표회",
              },
            };
            break;
          case "schedule":
            msg = { setAppOnair: { sCode: args[1] } };
            break;
        }
        window.webkit.messageHandlers.iMBCHandler.postMessage(msg);
      }
    },
  },
};
</script>
<style scoped src='../../static/css/sub.css'></style>