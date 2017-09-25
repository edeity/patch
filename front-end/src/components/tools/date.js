/**
 * Created by edeity on 16/8/9.
 */
;(function () {
    function format(date, fmt)
    {
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    function _getFormatDay(str, fc) {
        return format(new Date(str), fc || 'yyyy-MM-dd hh:mm');
    }
    function _getToday(fc) {
        return format(new Date(), fc || "yyyy-MM-dd");
    }
    module.exports = {
        getToday: _getToday,
        getFormatDay: _getFormatDay
    }
})(document, window);