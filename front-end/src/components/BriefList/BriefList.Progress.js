/**
 * Created by edeity on 16/8/26.
 */
import React, {Component} from 'react';

import constants from './../tools/constants';
var base_url = constants.URL.BASE_URL;

var UPLOAD_STATUS = {
    SUCCESS: 1,
    FAILURE: -1,
}
class Progress extends Component {
    constructor() {
        super();
        this.state = ({
            // 同时上传的数量, 暂时不提供并发传输
            // concurrentNum: 4,
            // 需要上传的文件
            isUploading: false,
            uploadedFiles: [],
            totalNum: 0,
            uploadIndex: 0,
            successNum: 0,
            failureNum: 0,
            // 显示上传面板
            isShow: false,
            // 显示文件状态
            isFileShow: true,
        })
    }


    /**
     * 点击出发隐藏input的点击事件
     */
    triggerBulkUpload = () => {
        // 该兼容性有待考虑
        if (this.props.activeCategoryId !== -1) {
            this.refs.files.click();
        } else {
            alert('请选择补丁分类');
        }
    }

    /**
     * 上传入口
     * @param files 封装过的files
     */
    upload = () => {
        var files = this.refs.files.files;
        var url = base_url + 'patches/upload?&categoryId=' + this.props.activeCategoryId;
        var index = 0;
        this.setState({
            isUploading: true,
            uploadedFiles: [],
            totalNum: files.length,
            uploadIndex: index,
            successNum: 0,
            failureNum: 0,
            isShow: true
        }, () => {
            if (files.length === 1) {
                // 合并单个上传接口
                this.uploadFile(url, files, index, true);
            } else {
                this.uploadFile(url, files, index);
            }
        });
    }

    /**
     * 顺序上传文件, 当全部文件上传完毕(接收到后台的state反馈, 不过成功还是失败), 则返回true
     * @param url 上传的地址
     * @param files 要上传的文件
     * @param index 目前上传的文件索引
     * @param isOneFile 单个文件上传标示
     */
    uploadFile = (url, files, index, isOneFile) => {
        // 假如上传的索引值超过了所有的文件, 则代表文件已经全部执行完毕
        if (index >= files.length) {
            this.setState({
                isUploading: false
            });
            this.props.afterFinished(this.props.activeCategoryId);
        } else {
            // 执行post补丁文件
            var file = files[index];
            // var acceptSize = 1000000000; // 1G
            var acceptSize = 10000000; // 10M

            if (file.size > acceptSize) {
                // 前台截取
                this._handleAjaxResult({   status: 0, msg: '不支持上传大于10M的补丁'}, file);

                if (isOneFile) {
                    this.props.afterFinished(this.props.activeCategoryId);
                } else {
                    // 递归调用, 因为state的index 未能实时同步, 故传参为参数index++
                    this.uploadFile(url, files, ++index);
                }
            } else {
                var formData = new FormData();
                formData.append(file.name, file);
                fetch(url, {method: 'POST', body: formData})
                    .then(function (response) {
                        return response.json();
                    })
                    .then((json) => {
                        this._handleAjaxResult(json, file);

                        if (isOneFile) {
                            this.props.afterFinished(this.props.activeCategoryId, json.patchId);
                        } else {
                            // 递归调用, 因为state的index 未能实时同步, 故传参为参数index++
                            this.uploadFile(url, files, ++index);
                        }
                    }).catch(function (error) {
                    // 注意处理失败的事件
                    throw error;
                })
            }
        }
    }

    /**
     * 根据返回的json变更状态
     * @param json 后台返回的json
     * @param file 当前处理的文件
     */
    _handleAjaxResult = (json, file) => {
        var uploadedFiles = this.state.uploadedFiles;
        if (json.status === 1) {
            // 添加补丁成功
            file.uploadStatus = UPLOAD_STATUS.SUCCESS;
            uploadedFiles.unshift(file);
            this.setState({
                successNum: ++this.state.successNum,
                uploadIndex: ++this.state.uploadIndex,
                uploadedFiles: uploadedFiles
            })
        } else if (json.status === 0) {
            // 添加补丁失败
            file.uploadStatus = UPLOAD_STATUS.FAILURE;
            file.failureMsg = json.msg;
            uploadedFiles.unshift(file);
            this.setState({
                failureNum: ++this.state.failureNum,
                uploadIndex: ++this.state.uploadIndex,
                uploadedFiles: uploadedFiles
            })
        }
    }

    hideFilePanel = () => {
        this.setState({
            isShow: false
        })
    }
    showFileStatus = () => {
        this.setState({
            isFileShow: true
        })
    }
    hideFileStatus = () => {
        this.setState({
            isFileShow: false
        })
    }

    render() {
        var uploadStatusIndex = 0;
        return (
            <div className="progress-bar">
                {
                    <div id="upload-panel">
                        <input id="bulk-upload-inpupt" type="file" ref="files" multiple="multiple" /*accept=".zip"*/
                               style={{display: 'none'}}
                               onChange={ this.upload }/>
                        <a id="bulk-upload" className="btn" onClick={ this.triggerBulkUpload }>点击上传</a>

                        {
                            this.state.isShow ?
                                <div id="upload-status-panel" className="upload-status">
                                    <span className="status-num total-num">总：{this.state.totalNum}</span>
                                    <span className="status-num success-num">成功：{this.state.successNum}</span>
                                    <span className="status-num failure-num">失败：{this.state.failureNum}</span>
                                    <div id="upload-status-tools">
                                        {
                                            this.state.isFileShow
                                                ? <a className="btn"><i className="fa fa-arrow-down" aria-hidden="true"
                                                                        onClick={this.hideFileStatus}/></a>

                                                : <a className="btn"><i className="fa fa-arrow-up" aria-hidden="true"
                                                                        onClick={this.showFileStatus}/></a>
                                        }
                                        <a className="btn"><i className="fa fa-close" onClick={this.hideFilePanel}/></a>
                                    </div>

                                    {
                                        this.state.isFileShow
                                            ?
                                            <div id="upload-file-detail">
                                                {
                                                    this.state.uploadedFiles.map((uploadFile) => {
                                                        return <div key={"uploadStatus" + ++uploadStatusIndex }
                                                                    className={ uploadFile.uploadStatus === UPLOAD_STATUS.SUCCESS
                                                                    ? 'success' : 'failure file-line'}>
                                                            <span>{uploadFile.name}</span>
                                                            {
                                                                uploadFile.failureMsg
                                                                    ?
                                                                    <div className="upload-msg failure">
                                                                        <i className="fa fa-warning"
                                                                           aria-hidden="true"/>
                                                                        <span>{ uploadFile.failureMsg }</span>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </div>
                                                    })
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                                : null
                        }

                    </div>
                }
            </div>
        )
    }
}

export {Progress}