/*
  *  @title: 코로나, 예방접정 현황 컴포넌트
  * */
 export default{
     template: `
             <section class="wrapper wrap_corona">
                 <div class="box">
                     <h3>코로나19 발생 현황<span class="standard">({{Status.StateDate}} 기준)</span></h3>
                     <div class="c-number">
                         <div>
                             <strong>확진자</strong>
                             <span class="num">{{Status.DecideTotal}}</span>
                             <span class="num-change">(<span>{{Status.DecideToday}}</span>)</span>
                         </div>
                         <div>
                             <strong>사망자</strong>
                             <span class="num">{{Status.DeathTotal}}</span>
                             <span class="num-change">(<span>{{Status.DeathToday}}</span>)</span>
                         </div>
                     </div>
                 </div>
                 <div class="box">
                     <h3>예방접종 현황<span class="standard">({{Vaccine.StateDate}} 기준)</span></h3>
                     <div class="c-number">
                         <div>
                             <strong>1회차 접종</strong>
                             <span class="num">{{Vaccine.FirstTotal}}</span>
                             <span class="num">({{Vaccine.FirstToday}})</span>
                         </div>
                         <div>
                             <strong>2회차 접종</strong>
                             <span class="num">{{Vaccine.SecondTotal}}</span>
                             <span class="num">({{Vaccine.SecondToday}})</span>
                         </div>
                     </div>
                 </div>
             </section>
             `
     ,
     data: function () {
         return {
             Status: {
                 DecideTotal: 0,
                 DecideToday: 0,
                 DeathTotal: 0,
                 DeathToday: 0,
                 StateDate: ""
             },
             Vaccine: {
                 FirstTotal: 0,
                 SecondTotal: 0,
                 FirstToday: 0,
                 SecondToday: 0,
                 StateDate: ""
             }
         }
     },
     created: function () {
         var _that = this;
         _that.Init();
     },
     methods: {
         Init: function () {
             try {
                 this.InitData();
             }
             catch (e) { }
         },
         NumberChange: function (s) {
             return parseInt(s).toLocaleString('ko-KR')
         },
         MakeCallbackTime: function () {
             var d = new Date();
             var t =
                 d.getFullYear() +
                 this.Pad2(d.getMonth() + 1) +
                 this.Pad2(d.getDate()) +
                 this.Pad2(d.getHours()) +
                 this.Pad2(d.getMinutes());
             return t;
         },
         Pad2: function (n) {
             return (n < 10 ? '0' : '') + n;
         },
         SortJSON: function (data, key, type) {
             if (type == undefined) {
                 type = "asc";
             }
             return data.sort(function (a, b) {
                 var x = a[key];
                 var y = b[key];
                 if (type == "desc") {
                     return x > y ? -1 : x < y ? 1 : 0;
                 } else if (type == "asc") {
                     return x < y ? -1 : x > y ? 1 : 0;
                 }
             });
         },
         InitData: function () {
             var _this = this;
             $.ajax({
                 type: "get",
                 dataType: "json",
                 url: "//control.imbc.com/WebApi/Covid19",
                 dataType: "jsonp",
                 async: true,
                 jsonpCallback: "Covid19" + _this.MakeCallbackTime(),
                 cache: true,
                 timeout: 10000,
                 success: function (o) {
                     if (o.length > 1) {
                         var k = _this.SortJSON(o, "createDt", "desc");
                         k[0].stdDay = k[0].stdDay.replace("년 ", "").replace("월 ", "").replace("일 ", "").replace("시", "");
 
                         _this.Status.DecideTotal = _this.NumberChange(k[0].defCnt);
                         _this.Status.DeathTotal = _this.NumberChange(k[0].deathCnt);
                         _this.Status.DecideToday = _this.NumberChange(k[0].incDec);
                         _this.Status.DeathToday = _this.NumberChange(k[0].deathCnt - k[1].deathCnt);
                         _this.Status.StateDate = parseInt(String(k[0].stdDay).substr(4, 2)) + "월 " + parseInt(String(k[0].stdDay).substr(6, 2)) + "일 " + parseInt(String(k[0].stdDay).substr(8, 2)) + "시";
 
                         _this.InitVaccinData();
                     }
                 }
             });
         },
         InitVaccinData: function () {
             var _this = this;
             $.ajax({
                 type: "get",
                 dataType: "json",
                 url: "//control.imbc.com/WebApi/CovidVaccine",
                 dataType: "jsonp",
                 async: true,
                 jsonpCallback: "CovidVaccine" + _this.MakeCallbackTime(),
                 cache: true,
                 timeout: 10000,
                 success: function (o) {
                     if (o.data.length > 1) {
                         var k = o.data;
                         var n = k.length - 1;
                         _this.Vaccine.FirstTotal = _this.NumberChange(k[n].totalFirstCnt);
                         _this.Vaccine.SecondTotal = _this.NumberChange(k[n].totalSecondCnt);
                         _this.Vaccine.FirstToday = _this.NumberChange(k[n].firstCnt);
                         _this.Vaccine.SecondToday = _this.NumberChange(k[n].secondCnt);
                         _this.Vaccine.StateDate = parseInt(String(k[n].baseDate).substr(5, 2)) + "월 " + parseInt(String(k[n].baseDate).substr(8, 2)) + "일 " + parseInt(String(k[n].baseDate).substr(11, 2)) + "시";
                     }
                 }
             });
         }
     }
 };