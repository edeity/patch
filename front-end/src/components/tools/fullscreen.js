/**
 * Created by edeity on 14/06/2017.
 * 用于控制并模拟监听退出全屏的事件
 */
;(function (dom, win, ele) {
    /**
     * 退出全屏
     * @private
     */
    function _exitFullScreen() {
        if (dom.cancelFullScreen) {
            dom.cancelFullScreen();
        } else if (dom.mozCancelFullScreen) {
            dom.mozCancelFullScreen();
        } else if (dom.webkitCancelFullScreen) {
            dom.webkitCancelFullScreen();
        }
    }

    /**
     * 进入全屏
     * @private
     */
    function _toFullScreen() {
        if (dom.documentElement.requestFullscreen) {
            dom.documentElement.requestFullscreen();
        } else if (dom.documentElement.mozRequestFullScreen) {
            dom.documentElement.mozRequestFullScreen();
        } else if (dom.documentElement.webkitRequestFullscreen) {
            dom.documentElement.webkitRequestFullscreen(ele.ALLOW_KEYBOARD_INPUT);
        }
    }

    /**
     * 监听全屏退出事件
     * @param callback
     * @private
     */
    function _onFullScreenExit(callback) {
        document.addEventListener("fullscreenchange", function () {
            if(!_isFullScreen()) {
                callback && callback();
            }
        });
        document.addEventListener("mozfullscreenchange", function() {
            if(!_isFullScreen()) {
                callback && callback();
            }
        });
        document.addEventListener("webkitfullscreenchange", function() {
            if(!_isFullScreen()) {
                callback && callback();
            }
        });
        document.addEventListener("msfullscreenchange", function() {
            if(!_isFullScreen()) {
                callback && callback();
            }
        });
    }

    /**
     * 是否处于全屏状态
     * @returns {*}
     * @private
     */
    function _isFullScreen() {
        return dom.fullscreenElement || dom.mozFullScreenElement || dom.webkitFullscreenElement;
    }
    module.exports = {
        isFullScreen: _isFullScreen,
        exitFullScreen: _exitFullScreen,
        toFullScreen: _toFullScreen,
        onFullScreenExit: _onFullScreenExit
    }
})(document, window, Element);