<!--
/**
 * @router component
 * @name news.vue
 * @title mbc 뉴스 컴포넌트
 * @description mbc 뉴스, 뉴스데스크
 * @author (c) 2021 iMBC
 */
-->
<template>
  <div class="wrap_news" v-show="initRender">
    <!-- MBC NEWS -->
    <div
      v-show="newsList.main.length > 0"
      class="visual_top"
      v-on:click="clickInterface(newsList.main[0].Link)"
    >
      <span class="img"
        ><img src="../../static/images/mbcnews_logo.png" alt="MBC 뉴스"
      /></span>
      <div class="news_top">
        <a>
          <img
            :src="newsList.main[0].Image"
            :alt="newsList.main[0].Title"
            v-on:error="replaceByDefault"
          />
          <div class="wrap_txt ellipsis">
            <span class="title" v-html="newsList.main[0].Title"></span>
          </div>
        </a>
      </div>
    </div>
    <div class="wrapper news_mid">
      <div
        class="half"
        v-for="(item, index) in newsList.half"
        v-on:click="clickInterface(item.Link)"
        :key="index"
      >
        <a>
          <img
            :src="item.Image"
            :alt="item.Title"
            v-on:error="replaceByDefault"
          />
          <span class="title ellipsis2" v-html="item.Title"></span>
        </a>
      </div>
    </div>
    <div class="wrapper news_list">
      <ul>
        <li
          class="ellipsis"
          v-for="(item, index) in newsList.list"
          v-on:click="clickInterface(item.Link)"
          :key="index"
        >
          <a v-html="item.Title"></a>
        </li>
      </ul>
    </div>

    <!--MBC NEWSDESK-->
    <div class="newsdesk" v-show="newsDeskList.length > 0">
      <div class="ch_info">
        <span class="img"
          ><img src="../../static/images/mbcnews_thumb.png" alt="뉴스데스크"
        /></span>
        <div class="txt_info">
          <span class="title">뉴스데스크</span>
          <span class="date">{{ today }}</span>
        </div>
      </div>
      <div class="wrapper thumb_list" v-if="newsDeskList.length > 0">
        <ul>
          <li
            :data-title="item.Title"
            v-on:click="clickInterface(item.Link)"
            v-for="(item, index) in newsDeskList.slice().reverse()"
            :key="index"
          >
            <span class="img" v-lazy-container="{ selector: 'img' }"
              ><img :data-src="item.Image" :alt="item.Title"
            /></span>
            <div>
              <span class="title ellipsis2" v-html="item.Title"></span>
              <span class="writer" v-html="item.Section"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getDateFormat } from "../common/common.js";

export default {
  props: ["userAgent"],
  data() {
    return {
      initRender: false,
      defaultImg:
        "https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_vod_drama_list.png",
      today: "",
      newsList: {
        main: [],
        half: [],
        list: [],
      },
      newsDeskList: [],
    };
  },
  mounted() {
    //30분이상 행동없으면 리로딩(컴포넌트 공통)
    $("meta[name='refreshApp']").attr("content", "1800;url=" + location.href);
    var _that = this;
    try {
      _that.Init();
    } catch (error) {
      console.log(error);
    }
  },
  updated() {
    this.$nextTick(() => {
      this.initRender = true;
    });
  },
  methods: {
    Init() {
      try {
        this.InitNewsData();
      } catch (e) {}
    },
    InitNewsData() {
      var _this = this;
      var newsUrl =
        "https://control.imbc.com/WebApi/Main/Imnews?date=" + getDateFormat();
      /**
       * @title 주요뉴스 DATA 매핑
       */
      $.ajax({
        url: newsUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.Data.length > 1) {
            $.each(o.Data, function (index, item) {
              if (index == 0) _this.newsList.main.push(item);
              //메인
              else if (index == 1 || index == 2) _this.newsList.half.push(item);
              // 상단
              else _this.newsList.list.push(item); // 리스트
            });
            //뉴스데스크
            _this.InitNewsDeskData();
          }
        },
      });
    },
    InitNewsDeskData() {
      var _this = this;
      var newsDeskUrl =
        "https://control.imbc.com/WebApi/Main/NewsDesk?date=" + getDateFormat();
      /**
       * @title 주요 뉴스데스크 DATA 매핑
       */
      $.ajax({
        url: newsDeskUrl,
        dataType: "json",
        async: true,
        cache: true,
        timeout: 10000,
        success: function (o) {
          if (o.Data.length > 1) {
            $.each(o.Data, function (index, item) {
              _this.newsDeskList.push(item);
            });
            //현재일시
            _this.today = _this.newsDeskList[0].StartDate;
          }
        },
      });
    },
    replaceByDefault(e) {
      e.target.src = this.defaultImg;
    },
    clickInterface(link) {
      /*
       * @param arguments
       *
       */
      //android
      if (this.userAgent == "android") {
        window.iMBCHandler.setAppBanner("APP_LINK", link, "MBC뉴스");
      }
      //ios
      else if (this.userAgent == "ios") {
        var msg = {
          setAppBanner: { linkType: "APP_LINK", link: link, title: "MBC뉴스" },
        };
        window.webkit.messageHandlers.iMBCHandler.postMessage(msg);
      }
    },
  },
};
</script>
<style scoped src='../../static/css/sub.css'></style>