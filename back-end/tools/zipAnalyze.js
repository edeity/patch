// zip 分析
var AdmZip = require('adm-zip');
// xml转换json
var parseString = require('xml2js').parseString;

var preAnalyzeData = "packmetadata.xml";

/**
 * 分析压缩包, 搜集该压缩包的有效信息
 * @param filePath 文件路径
 * @param attr 有用的属性
 * @param callback 毁掉函数
 * @private
 */
function _analyze(filePath, callback) {
    var umsg = {}; // 即将存入数据库的有用信息, 内含属性请参考db/patch.js
    var isXMLAnalyze = false; // 表示读取到packmetadata.xml, 不管该文件解析是否成功
    var warningMsg = '';
    
    
    // 开始分析补丁的内容
    try {
        var zip = new AdmZip(filePath);
        var zipEntries = zip.getEntries();
        // 补丁包中有用的信息

        // 获取模块的正则
        var tempModules = {};
        var tempModifiedFiles = {};
        var reModule = /(?:modules\/)(\w+)/i;
        var reJava = /(?:classes\/)(.+).java/i;

        // 同步操作
        zipEntries.forEach(function (zipEntry) {
            if (zipEntry.isDirectory == false) {
                var filePath = zipEntry.entryName.toString();
                // 提取模块Modules后的文件夹(该文件夹将作为该补丁涉及的模块名, 如ufoc)
                var m = reModule.exec(filePath);
                m ? tempModules[m[1]] = 1 : '';
                umsg.modules = Object.keys(tempModules).join(',');
                // 提取修改后的文件名
                var j = reJava.exec(filePath);
                j ? tempModifiedFiles[j[1]] = 1 : '';
                umsg.modifiedFiles = Object.keys(tempModifiedFiles).join(',');

                var fileName = filePath.split("/").pop();

                // 分析packmetadata.xml文件中的信息
                if (fileName === preAnalyzeData) {
                    isXMLAnalyze = true; 
                    var xmlString = zipEntry.getCompressedData().toString('utf8');
                    // console.log(xmlString);
                    // 从补丁packmetadata.xml文件中获取信息, 请注意data为xml重的信息, 而usmg对应patch数据库的字段
                    parseString(xmlString, {trim: true}, function (err, results) {
                        if (!err) {
                            var data = results.packmetadata;
                            umsg.department = data.department[0];
                            // 从xml中获取的修改类不准确
                            // umsg.modifiedFiles = data.modifiedJavaClasses.join(',');
                            umsg.version = data.applyVersion[0].split(',').pop();
                            umsg.author = data.provider[0];
                            umsg.supportId = data.id[0];
                            umsg.time = data.time[0];
                            umsg.describe = data.description[0];
                        } else {
                            // throw err;
                            // 一些不合法的输入会导致xml无法解析
                            warningMsg = "补丁文件中packmetadata不是合法的xml文件";
                        }
                    })
                }
            }
        });
        if(!isXMLAnalyze) {
            callback && callback (null, umsg, "未能获取更多补丁信息: 缺少packmetadata.xml文件")
        } else {
            callback && callback (null, umsg, warningMsg)
        }
    } catch (err) {
        callback && callback(err, null);
    }
}


exports.analyze = _analyze;

