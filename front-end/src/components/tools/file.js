/**
 * Created by edeity on 15/11/15.
 */
;(function(dom, win){
    "use strict";
    //保存md到本地
    function _fakeClick(obj) {
        var ev = dom.createEvent('MouseEvents');
        ev.initMouseEvent(
            'click', true, false, win, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        obj.dispatchEvent(ev);
    }

    /**
     * 保存文件到本地
     * @param name 文件名
     * @param data 文件的数据
     */
    function save(name, data) {
        var urlObject = win.URL || win.webkitURL || win;
        var export_blob = new Blob([data]);
        var save_link = dom.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        _fakeClick(save_link);
    }

    //测试读取的能力
    var tests = {
            filereader: typeof FileReader != 'undefined',
            dnd: 'draggable' in dom.createElement('span'),
            formdata: !!win.FormData,
            progress: 'triggerUpload' in new XMLHttpRequest
        },
        acceptedTypes = {
            //允许接受的个格式
            'text/markdown': true
        };

    /**
     * 使组件获得拖拉文件的能力
     * @param selectorId dom文档的id,将在该id绑定onDrag等事件
     * @param callback 回去拖拉文本的内容后的信息
     */
    function enableDragFile(selectorId, callback) {
        var holder = dom.getElementById(selectorId);
        if (tests.dnd) {
            //处理拖拉事件
            holder.ondragover = function () { this.className = 'hover'; return false; };
            holder.ondragend = function () { this.className = ''; return false; };

            holder.ondrop = function (e) {
                this.className = '';
                e.preventDefault();

                var files = e.dataTransfer.files;
                //遍历文件
                var formData = tests.formdata ? new FormData() : null;
                for (var i = 0; i < files.length; i++) {
                    if (tests.formdata) formData.append('file', files[i]);
                    var file = files[i];
                    //真正地读取数据
                    if(tests.filereader === true && acceptedTypes[file.type] === true) {
                        var reader = new FileReader();
                        //获取文件的名字
                        reader.onload = function(file) {
                            return function (event) {
                                callback(file.name, event.target.result);
                            }
                        }(file);
                        //getFileNameCallback(file.name);
                        reader.readAsText(file);
                    }
                }
            }
        }
    }
    module.exports = {
        save: save,
        enableDragFile: enableDragFile
    }
})(document, window);

//api
//var fileOperation = require(this)
//fileOperation.save(name, content)
//fileOperation.enableDragFile(document.getElementById('mark-app'), handleFileInput(content))