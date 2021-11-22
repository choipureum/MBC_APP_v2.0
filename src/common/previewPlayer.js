/**
 * @module
 * @name PreviewPlayer.js
 * @function 
 *      @name addPlayer : VOD미리보기 생성
 *      @name addOnAirPlayer : onAir 미리보기 생성
 * @description    
 * 
 *      미리보기 생성 모듈
 * 
 * (c) 2021 iMBC
 */
class PreviewPlayer {

    constructor() { }

    addPlayer(div, broId, imgsrc, width, height, title) {
        this.id = div + "_video";
        this.div = div;
        this.broId = broId;
        this.imgsrc = imgsrc;
        this.width = width;
        this.height = height;

        var top = parseInt(this.height) - 40;

        var that = this;

        var src = "https://mediaapi.imbc.com/Player/OverlapURLUtil?broadcastId=" + this.broId;

        var HTML = "<div style='position:relative;cursor:pointer;height:100%;width:100%' >"
            + "<img class='img_thumb' id='" + this.id + "_img' data-url='" + this.imgsrc + "' style='position:absolute;top: 0px; left: 0px; z-index:19;height:inherit;width:inherit; margin:0;'>"
            + "<video poster='./static/images/default_mbc_thum.jpg' muted preload='metadata' id='" + this.id + "'"
            + " playsinline = '' x-webkit-airplay='' webkit-playsinline='true' autoplay style='display:block; cursor:pointer; width:100.4%; height:inherit;object-fit:fill;'></video>"
            + "</div>";

        //./images/default_mbc_thum.jpg

        var parent = document.getElementById(div);
        if(parent==null) return;
        parent.innerHTML = HTML;
        this.player = document.getElementById(this.id);

        var isFirstCall = true;

        //미디어 데이터 미리보기 완료시 이미지 오버랩
        this.player.addEventListener('ended', (event) => {
            that.player.pause();
            $('#' + that.id + "_img").fadeTo(300, 1, function () {
                try {
                    that.player.currentTime = 0;
                } catch (ex) { }
            });
        });

        var vod_on = _.debounce(function (e) {
            if (isFirstCall) {
                isFirstCall = false;

                $.ajax({
                    url: src,
                    dataType: "jsonp",
                    cache: false,
                    success: function (data) {
                        that.player.addEventListener('loadeddata', function () {
                            $('#' + that.id + "_img").fadeTo(300, 0);
                        });
                        that.player.src = data.MediaURL;
                        var playPromise = that.player.play();

                        if (playPromise !== undefined) {
                            playPromise.then(function () {
                                // Automatic playback started!
                            }).catch(function (error) {
                                // Automatic playback failed.
                                // Show a UI element to let the user manually start playback.
                            });
                        }
                    }
                });

            }
            else {
                var playPromise = that.player.play();
                if (playPromise !== undefined) {
                    playPromise.then(function () {
                        $('#' + that.id + "_img").fadeTo(300, 0);
                    }).catch(function (error) {
                    });
                }
            }
        }, 300);

        var vod_off = _.debounce(function (e) {

            that.player.pause();
            $('#' + that.id + "_img").fadeTo(300, 1, function () {
                try {
                    that.player.currentTime = 0;
                } catch (ex) { }
            });
        }, 300);
        $(parent).mouseenter(vod_on);
        $(parent).mouseleave(vod_off);
        $(parent).parent().parent().click(vod_off);

    }

    addOnAirPlayer(div, mouseAnchor, imgsrc, width, height, title, userAgent) {
        this.id = div + "_video";
        this.div = div;
        this.imgsrc = imgsrc;
        this.width = width;
        this.height = height;

        var top = parseInt(this.height) - 40;

        var src = "https://mediaapi.imbc.com/Player/OnAirURLUtil?type=m&onairtype=1";

        var HTML = "<div style='position:relative;cursor:pointer;height:" + this.height + ";width=" + this.width + ";'>"
            + "<img id='" + this.id + "_img' src='" + this.imgsrc + "' style='position:absolute;top: 0px; left: 0px; z-index:19;height:" + this.height + ";width= " + this.width + "';alt='" + title + "'>"
            + "<video poster='" + this.imgsrc + "'muted preload='none' id='" + this.id + "'"
            + " playsinline = '' x-webkit-airplay='' webkit-playsinline='true' autoplay style='cursor:pointer;  width:" + this.width + "px;  height:" + this.height + "px;object-fit:fill;display:block;'></video>"
            + "</div>";


        var parent = document.getElementById(div);
        if(parent==null) return;
        parent.innerHTML = HTML;
        
        var anchor = document.getElementById(mouseAnchor);

        this.player = document.getElementById(this.id);

        var that = this;

        var isFirstCall = true;

        var hls = new Hls();

        this.player.addEventListener('stalled', (event) => {
            $('#' + that.id + "_img").fadeTo(300, 1);
            isFirstCall = true;
        });


        //userAgent == ios 일때      

        if (userAgent === "ios") {

            var ios_onair_on = _.debounce(function (e) {

                if (isFirstCall) {
                    isFirstCall = false;

                    $.ajax({
                        url: src,
                        dataType: "json",
                        crossDomain: true,
                        xhrFields: { withCredentials: true },
                        cache: false,
                        success: function (data) {
                            that.player.setAttribute("poster", this.imgsrc);
                            that.player.addEventListener('loadeddata', function () {
                                setTimeout(function () {
                                    $('#' + that.id + "_img").fadeTo(300, 0);
                                }, 300)
                            });
                            try {
                                that.player.src = data.MediaInfo.MediaURL;
                                var playPromise = that.player.play();
                            }
                            catch (e) {
                                isFirstCall = true;
                            }

                        }
                    });
                } else {
                    setTimeout(function () {
                        var playPromise = that.player.play();

                        if (playPromise !== undefined) {
                            playPromise.then(function () {
                                $('#' + that.id + "_img").fadeTo(300, 0);
                            }).catch(function (error) {

                            });
                        }
                    }, 300)

                }
            }, 300);

            var ios_onair_off = _.debounce(function (e) {
                that.player.pause();
            }, 300);

            $(anchor).mouseenter(ios_onair_on);
            $(anchor).mouseleave(ios_onair_off);
            $(anchor).parent().click(onair_off);

        }
        //userAgent == Android && Web 이외 일때\
        else {

            var onair_on = _.debounce(function (e) {

                if (isFirstCall) {
                    isFirstCall = false;

                    $.ajax({
                        url: src,
                        dataType: "json",
                        cache: false,
                        crossDomain: true,
                        xhrFields: { withCredentials: true },
                        success: function (data) {
                            that.player.addEventListener('loadeddata', function () {
                                setTimeout(function () {
                                    $('#' + that.id + "_img").fadeTo(300, 0);
                                }, 300)
                            });

                            //안드로이드 && web
                            try {
                                hls.loadSource(data.MediaInfo.MediaURL);
                                hls.attachMedia(that.player);

                                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                                    that.player.play();
                                });

                                hls.on(Hls.Events.ERROR, function (event, data) {
                                    //error Handling
                                    if (data.fatal) {
                                        switch (data.type) {
                                            case Hls.ErrorTypes.NETWORK_ERROR:
                                                // try to recover network error
                                                console.log('fatal network error encountered, try to recover');
                                                this.hlsTryLoadTimer = setTimeout(() => function () {
                                                    hls.loadSource(and_url)
                                                    hls.startLoad();
                                                }, 1000);
                                                break;
                                            case Hls.ErrorTypes.MEDIA_ERROR:
                                                console.log('fatal media error encountered, try to recover');
                                                hls.recoverMediaError();
                                                break;
                                            default:
                                                // cannot recover
                                                hls.destroy();
                                                break;
                                        }
                                    }
                                });
                            }
                            catch (e) {
                                isFirstCall = true;
                            }
                            $('#' + that.id + "_img").fadeTo(300, 0);
                        }
                    });

                } else {
                    setTimeout(function () {
                        hls.startLoad();
                        var playPromise = that.player.play();

                        if (playPromise !== undefined) {
                            playPromise.then(function () {
                                $('#' + that.id + "_img").fadeTo(300, 0);
                            }).catch(function (error) {

                            });
                        }
                    }, 300);

                }
            }, 300);

            var onair_off = _.debounce(function (e) {
                that.player.pause();
                hls.stopLoad();
            }, 300);


            $(anchor).mouseenter(onair_on);
            $(anchor).mouseleave(onair_off);
            $(anchor).parent().click(onair_off);
        }
    }
}
export default PreviewPlayer;