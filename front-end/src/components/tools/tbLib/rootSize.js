/**
 * Created by edeity on 16/8/22.
 */
;(function (doc, win) {
    var resizeEvt = 'orientationchange' in window ? 'orientationchange': 'resize',
        recalc = function () {
           document.getElementsByTagName('body')[0].style.height = window.innerHeight + 'px';
        };
    if(!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);