/**
 * Created by edeity on 16/8/14.
 */
// 此处应该填写后台ip地址
const IP = 'http://127.0.0.1';
// var ip = document.host;
module.exports = {
    URL: {
        APP_URL: IP + ':3000/',
        BASE_URL: IP + ':8000/',
        SEARCH_URL: IP + ':9200/'
    },
    KEY_MAP: {
        ESC: 27
    },
};