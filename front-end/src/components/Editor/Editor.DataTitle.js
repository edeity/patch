/**
 * Created by edeity on 16/8/19.
 */
import React, {Component} from 'react';

import constants from './../tools/constants';
import Clipboard from 'clipboard'
const base_url = constants.URL.BASE_URL;

// 仅改变操作dom,而不影响 react中存在的任何状态
import $ from 'jquery'
window.$ = $;
/**
 *
 */
class EditorDataTitle extends Component {
    constructor() {
        super();
        this.state = {
            copySuccess: false,
            isShowDetails: false,
        };
        // 剪切
        let clipboard = new Clipboard('.clipBtn');
        // 成功后显示的样式
        clipboard.on('success', (e) => {
            this.setState({
                copySuccess: true
            });
            setTimeout(() => {
                this.setState({
                    copySuccess: false
                })
            }, 1000)
        });
    }
    // 改变标题
    changeTitle = () => {
        let title = this.refs[this.props.refName].value + '.' + this.suffix;
        this.props.onValueChange(title);
    };
    // 启动预览
    preview = () => {
        var url = base_url + 'patches/preview?patchId=' + this.props.patchId;
        this.props.onPreview(url);
    };
    // 高亮显示
    highlight = (htmlText) => {
        return {__html: htmlText}
    };
    toggleDetails = () => {
        let isShowDetails = !this.state.isShowDetails;
        this.setState({
            isShowDetails: isShowDetails
        })
    };
    // react 渲染
    render() {
        let isEditor = this.props.isEditor;
        let title = this.props.value;
        // 后缀名
        let temp = title.split('.');
        this.suffix = temp.pop();
        let realTitle = temp.join();
        return (
            <div id={this.props.patchId} className="patch-head">
                {
                    isEditor 
                        ? <input id="p-head-input" 
                                 className="editor-title"
                                 defaultValue={ realTitle }
                                 ref={ this.props.refName }
                                 onChange={ this.changeTitle }/>
                        : this.props.isHighlight
                            ? <span id="p-head-span" className="editor-title" dangerouslySetInnerHTML={this.highlight(this.props.highlightValue)}/>
                            : <span id="p-head-span" className="editor-title"> { title }</span>
                }
                <div id="patch-tools">
                    {
                        isEditor
                            ? <a id="editor-patch-btn" className="active btn" onClick={ this.props.submitAction }>提交</a>
                            : <a id="editor-patch-btn" className="btn" onClick={ this.props.editAction }>编辑</a>
                    }
                    <a id="share-patch-link" className="btn clipBtn" title="复制"
                                data-clipboard-text={base_url + this.props.link}>
                        <i className="fa fa-copy"/>
                        {this.state.copySuccess ? <span className="tools-tips">Copied!</span> : null}
                    </a>
                    {
                        this.props.hasPreviewBtn &&
                        <a id="preview-link" className="btn previewBtn" target="_blank"  title="预览"
                           onClick={ this.preview }>
                            <i className="fa fa-eye"/>
                         </a>
                    }
                    {
                        this.props.isFullScreen
                            ? <a id="full-screen" className="btn" title="全屏" onClick={ this.props.toggleFullScreen }>
                            <i className="fa fa-stop-circle"></i>
                        </a>
                            : <a id="full-screen" className="btn" title="退出全屏" onClick={ this.props.toggleFullScreen }>
                            <i className="fa fa-arrows-alt"></i>
                        </a>
                    }
                    {
                        <a onClick={ this.toggleDetails } className={
                        this.state.isShowDetails ? "is-active btn" : "btn"} title="文件信息">
                            <i className="fa fa-info"/>
                        </a>

                    }

                </div>
            </div>
        )
    }
}
export {EditorDataTitle}