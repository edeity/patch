/**
 * Created by edeity on 16/8/19.
 */
import React, {Component} from 'react';

import constants from './../tools/constants';
var baseUrl = constants.URL.BASE_URL;
/**
 *
 */
class EditorFileUpload extends Component {
    /**
     * 出发input的upload事件
     */
    triggerUpload = () => {
        this.refs[this.props.refName].click();
    }
    /**
     * 上传补丁文件
     * @param e
     */
    handlePatchUpload = (e) => {
        var files = this.refs[this.props.refName].files;
        this.props.onChangeAction(files);
    }

    render() {
        /* 重命名时, 应将标签的路径(由后台随机生成)更改为文件名 */
        return (
            <div id="upload-patch">
                { this.props.isEditor
                    ?
                        <div>
                            <a id="patch-upload-btn" className="patch-link-btn" href="#" onClick={ this.triggerUpload }>
                                <i className="fa fa-upload" aria-hidden="true"/>
                            </a>
                            <input type="file" onChange={this.handlePatchUpload}
                                   ref={ this.props.refName }
                                   style={{display: 'none'}}
                                   /*accept=".zip"*/ />
                            <span className="small-tips">提交新补丁(或方案)后, 旧的会被删除</span>
                        </div>
                    :
                        <a id="patch-download-btn" className="patch-link-btn"
                           href={baseUrl + this.props.value + '?filename=' + this.props.downloadName }
                           download={ this.props.downloadName }>
                            <i className="fa fa-download" aria-hidden="true"/>
                        </a>


                }
            </div>
        )
    }
}
export {EditorFileUpload}