/**
 * @title scroll to Top 상단 이동 버튼 ON
 * @returns void
*/
export const upBtnFunc = () =>{
    $(function(){
        $(window).scroll(() => {
            if ($(window).scrollTop() == 0) {
                $('#scrollTop').fadeOut(300);
            } else {
                $('#scrollTop').fadeIn(300);
             }
        }); 
    })
}
 
/**
 * @title dateTime url 콜백 파라미터
 * @returns ?date= {yyyymmdd}
 */
export const getDateFormat = () => {
    var date = new Date();
    var MM = date.getMonth() + 1;
    var dd = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();

    return [
        date.getFullYear(),
        (MM > 9 ? "" : "0") + MM,
        (dd > 9 ? "" : "0") + dd,
        (hh > 9 ? "" : "0") + hh,
        (mm > 9 ? "" : "0") + mm,
    ].join("");
}

/**
 * @title 모바일 타입 체크
 * @returns ios, android, web
 */
export const checkMobile = () => {
    var varUA = navigator.userAgent.toLowerCase();

    if (varUA.indexOf("android") > -1) {
        //안드로이드
        return "android";
    } else if (
        varUA.indexOf("iphone") > -1 ||
        varUA.indexOf("ipad") > -1 ||
        varUA.indexOf("ipod") > -1 ||
        varUA.indexOf("mac") > -1
    ) {
        //IOS
        return "ios";
    } else {
        return "other";
    }
}

/**
 * @title 파라미터 체크
 * @returns 파라미터 리턴
 */
export const getParameter = (sname) => {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    var temp = [];
    params = params.split("&");

    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }
    return sval;
}
/**
 * @description
 *
 *      화면 슬라이더 배너
 *
 */
 export const sliderBanner = () => {
    //메인 슬라이더
    if ($(".wrap_home").length) {
      var topWrap = new Swiper(".visual_slide", {
        loop: true,
        pagination: {
          el: ".swiper-pagination",
        },
        
      });
    }
    //지금무료 슬라이더
    else if($(".nowfree").length){
        //main slide
        var mySwiper = new Swiper('.swiper-container', {
            loop:true,
            pagination: {
                el: '.pagination',
            },
        })
    }
  };


/**
 * @description
 *
 *      화면 Slider 플리킹
 *
 */
export const gnbHeader = () => {
    scrollX('.gnb', 23, 2);
};
export const gnbMove = () => {
    scrollCenter('.gnb .slide', $('.gnb ul li.on'));
}

const scrollX = (obj, n, padding) => {
    var objNode, objSlide, slideLi;
    objNode = $(obj);
    objSlide = objNode.find("ul");
    slideLi = objSlide.find("li");
    var liMargin = (slideLi.length -1) * n;
    var liArr = [];

    slideLi.each(function(index, item){ 
        var w = item.offsetWidth;
        if(w == 0) w = liMargin * 100;
        liArr.push(w);        
    });
    var liWidth = liArr.reduce(function(a, b){ return a + b; });
    objSlide.css('width', (liWidth + liMargin + padding)+'px');
}

const scrollCenter = (obj, item) => {
    var windowWidth = $(window).width()/2;
    var move = item[0].offsetLeft;
    var thisWidth = item[0].offsetWidth/2;
    var scrollMove = move-windowWidth+thisWidth;
    if( item[0].offsetLeft > windowWidth ){
        $(obj).stop().animate({scrollLeft : scrollMove}, 100, "linear");
    }else{
        $(obj).stop().animate({scrollLeft : 0}, 100, "linear");
    }
    return false;
}

/** 
 * @title 가로 플리킹
 * @description 다시보기쪽 가로 플리킹
 * 
*/
export const sliderType = (obj, n) => {
    var objNode = $(obj);
    var objSlide = objNode.find(".slide");
    var slideLi = objSlide.find("li");
    var slideLiCount = 0;
    objSlide.find("li").each(function () {
        if ($(this).children().length) { slideLiCount++; }
    });
    var liMargin = (slideLiCount > 3 ? slideLiCount - 1 : slideLiCount)  * n;
    objSlide.children("ul").width(slideLi.width() * slideLiCount + liMargin);
}

/** 
 * @title Get 쿠키 정보
 * @description 회원 이름 정보 조회 사용
 * 
*/
export const getCookie = (strName) => {
    var strArg = new String(strName + "=");	
    var nArgLen, nCookieLen, nEnd;
    var i = 0, j;

    nArgLen    = strArg.length;
    nCookieLen = document.cookie.length;

    if(nCookieLen > 0) {
        while(i < nCookieLen) {
            j = i + nArgLen;
            if(document.cookie.substring(i, j) == strArg) {
                nEnd = document.cookie.indexOf (";", j);
                if(nEnd == -1) nEnd = document.cookie.length;
                return unescape(document.cookie.substring(j, nEnd));
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
    }
    return("");
}

/**
 * @title Vue 전용 이미지 lazyload 세팅
 * @param {'drama' = 드라마 디폴트 이미지/ 'movie' = 영화, 방송 포스터 디폴트 이미지} sw 
 * @returns vueLazyLoad 세팅값
 */
export const bannerDefaultImg = (sw) => {
    var img = 'https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_main.png';
    if(sw == "drama") img = 'https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_vod_drama_list.png';
    if(sw == 'movie') img = 'https://m.imbc.com/wiz/mbcapp/v2/static/images/default_thum_vod_movie_list.png';
    
    return {
        preLoad: 1.3,
        error: img,
        loading: img,
        attempt: 1
    };
}


/*
 * @title: LazyLoading
 * */
export const ImgLazyLoading = {
    inserted: el => {
        function loadImage() {
            var imageElement = el;
            if (imageElement) {
                imageElement.addEventListener("load", () => {
                    setTimeout(() => el.classList.add("loaded"), 100);
                });
                imageElement.addEventListener("error", () => console.log("error"));
                imageElement.src = imageElement.dataset.url;
                try {
                    //영상 img 함께 전환
                    var parentDiv = imageElement.parentElement.parentElement;
                    if (parentDiv.tagName == "DIV") {
                        document.getElementById(parentDiv.attributes[1].value + "_video_img").src = document.getElementById(parentDiv.attributes[1].value + "_video_img").dataset.url;
                    }
                } catch (e) { }
            }

        }

        function handleIntersect(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage();
                    observer.unobserve(el);
                }
            });
        }

        function createObserver() {
            const options = {
                root: null,
                rootMargin: '150px',
                threshold: "0"
            };
            const observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(el);
        }
        if (window["IntersectionObserver"]) {
            createObserver();
        } else {
            loadImage();
        }
    }
};