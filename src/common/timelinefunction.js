/**
 * @module
 * @name timelinefunction.js
 * @function scrollFn
 * @description    
 * 
 *      화면스크롤시 다시보기 VOD 미리보기 탐색 및 이벤트 시작
 *      
 * (c) 2021 iMBC
 */
function scrollFn() {
    $.fn.scrollGet();
}
(function ($) {
    $.fn.scrollGet = function () {

        var top = $(window).scrollTop();
        var bottom = $(window).scrollTop() + $(window).height();
        var offset = $(window).scrollTop() + $(window).height() / 2

        //onair는 화면보일시 실행
        var onair = $("#onairwrapper");
        //onair 실행 && 실행중 아닐때
        if (!onair.is(':offscreen') && $('.onair-on').length == 0) {
            onair.addClass("onair-on");
            onair.trigger("mouseenter");
        }
        else if (onair.is(':offscreen') && $('.onair-on').length > 0) {
            onair.removeClass("onair-on");
            onair.trigger("mouseleave");
        }

        //VOD
        var videos = $('.replayVod');

        if (videos.length == 0) {
            $(window).off('scroll', $.fn.scrollAni);
        }

        videos.each(function (i) {

            var video = $(this).find('video'),

                item_top = $(this).offset().top, //비디오 윗 좌표
                item_height = $(this).height(), //아이템 높이
                item_bottom = item_top + item_height; //비디오 아랫 좌표

            //화면 중앙위치
            if (($(this).offset().top) - 150 < offset && (item_bottom) + 150 > offset) {

                var video_on = $('.video_on');
                //자동실행이 하나도 없을때
                if (video_on.length <= 2) {
                    video.addClass('video_on');
                    video.trigger("mouseenter");
                    return;
                }
            } else {
                video.trigger("mouseleave");
                if (video.hasClass('video_on')) {
                    video.removeClass('video_on');
                }
            }
        })
    };
})(jQuery);

/**
 * @description 
 * 
 *      offscreen 판단
 *      
 * @param {any} el
 */
jQuery.expr.filters.offscreen = function (el) {
    var rect = el.getBoundingClientRect();
    return (
        (rect.x + rect.width) < 0
        || (rect.y + rect.height) < 0
        || (rect.x > window.innerWidth || rect.y > window.innerHeight)
    );
};

/**
 * @description 
 * 
 *      화면 스크롤 정시시 자동재생 이벤트 시작
 * 
 */
$(function () {
    var lastScrollAt = Date.now(), timeout
    function scrollStartStop() {
        var $this = $(this)
        if (Date.now() - lastScrollAt > 300)
            $this.trigger('scrollstart')
        lastScrollAt = Date.now()
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            if (Date.now() - lastScrollAt > 299)
                $this.trigger('scrollend')
        }, 300)
    }
    $(document).on('scroll', scrollStartStop)
});

export default scrollFn;
