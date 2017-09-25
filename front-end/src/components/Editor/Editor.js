/**
 * Created by edeity on 16/8/9.
 */
import React, {Component} from 'react';

// 组件
import {EditorDataTitle} from './Editor.DataTitle';
import {EditorDataLine} from './Editor.DataLine';
import {EditorDataList} from './Editor.DataList';
import {EditorDataSelect} from './Editor.DataSelect';
import {DataModuleList} from './Editor.DataModuleList.js';
import {EditorDataArea} from './Editor.DataArea';
import {EditorTips} from './Editor.Tips';
import {EditorFileUpload} from './Editor.FileUpload'

// ajax加载工具
// import 'whatwg-fetch'
// 常量
import constants from './../tools/constants';
import date from './../tools/date'

var base_url = constants.URL.BASE_URL;

class Editor extends Component {
    constructor() {
        super();
        this.state = {
            // 该状态列举了了编辑器所允许修改的所有属性
            title: '', // 补丁标题
            department: '', // 补丁部门
            author: '', // 作者
            version: '', // 版本号
            describe: '', // 补丁描述
            link: '', // 补丁下载链接
            // 对应属性是否变更(关系是否向后台提交数据)
            isTitleChange: false,
            isDepartmentChange: false,
            isAuthorChange: false,
            isVersionChange: false,
            isDescribeChange: false,
            isLinkChange: false,
            // 其他编辑状态
            previewUrl: ''
        }
    }

    preview = (url) => {
        this.setState({
            previewUrl: url
        });
        var isPreview = !this.props.isPreview;
        this.props.toPreview(isPreview);
        if(isPreview) {
            this.props.isEdit(false);
        }

    }
    /**
     * 改变补丁的标题
     * @param title
     */
    changeTitle = (title) => {
        this.setState({title: title, isTitleChange: true});
        this.props.changeTitle(title);
    };
    /**
     * 改变部门名称
     * @param department
     */
    changeDepartment = (department) => {
        this.setState({department: department, isDepartmentChange: true})
    };

    /**
     * 改变作者
     * @param author
     */
    changeAuthor = (author) => {
        this.setState({author: author, isAuthorChange: true})
    };

    /**
     * 改变补丁使用版本
     * @param version
     */
    changeVersion = (version) => {
        this.setState({version: version, isVersionChange: true})
    };
    /**
     * 改变描述信息
     * @param desc
     */
    changeDesc = (desc) => {
        this.setState({describe: desc, isDescribeChange: true})
    };

    /**
     * 核心功能: 上传单个补丁
     * 之所以为核心功能, 是因为提交补丁后, 会在后台分析补丁包的信息, 自动填补文件
     * @param link
     */
    changeLink = (file) => {
        // 构造文件提交信息
        var formData = new FormData();
        var postFile = file[0];
        formData.append(postFile.name, postFile);
        var url = base_url + 'patches/upload?patchId=' + this.props.patchId + "&categoryId=" + this.props.activeCategoryId;
        fetch(url, {
            method: 'POST',
            body: formData
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            if (json.status === 1) {
                if (json.warningMsg) console.log('waring: ' + json.warningMsg);
                this.props.reload(null, this.props.patchId);
            } else if (json.status === 0) {
                console.error(json.msg);
                this.props.showEditorTips(json.msg)
            }
        });
    };


    /**
     * 在可编辑状态提交表单
     */
    submit = () => {
        var tempState = this.state;

        // 当且仅当表单某一段元素更改时, 才提交该项
        var postPatchContent = {};
        this.state.isTitleChange && (postPatchContent.title = tempState.title);
        this.state.isDepartmentChange && (postPatchContent.department = tempState.department);
        this.state.isAuthorChange && (postPatchContent.author = tempState.author);
        this.state.isVersionChange && (postPatchContent.version = tempState.version);
        this.state.isDescribeChange && (postPatchContent.describe = tempState.describe);
        this.state.isLinkChange && (postPatchContent.link = tempState.link);

        // 往服务器提交信息
        this.props.submit(postPatchContent);
        // 编辑器重新更改为不可编辑
        this.props.isEdit(false);
    };

    // 在游览状态, 点击"编辑"按钮的动作
    edit = () => {
        this.props.isEdit(true);
        this.props.toPreview(false);
    };


    render() {
        // 是否处于可编辑状态
        var isEditor = this.props.isEditor;
        // 补丁的详细内容
        var pc = this.props.patchContent;
        var hf = this.props.highlightField;

        return (
            typeof pc.link === 'undefined' || pc.link === ''
                ?
                <div id="editor">
                    <EditorTips value={ this.props.patchTips }/>
                    <EditorFileUpload value={ pc.link } isEditor={ isEditor } refName="file"
                                      onChangeAction={ this.changeLink }/>
                </div>
                : <div id="editor">

                <EditorDataTitle value={ pc.title } 
                                 isEditor={ isEditor }
                                 patchId={ pc.patchId }
                                 isHighlight={ hf && hf.title ? true : false }
                                 hasPreviewBtn={ pc.isPreview } // 是否可预览
                                 highlightValue={ hf && hf.title ? hf.title[0] : '' }
                                 refName="title"
                                 link={ pc.link }
                                 submitAction={ this.submit }
                                 editAction={ this.edit }
                                 onChangeAction={ this.changeTitle }
                                 onPreview={ this.preview }
                                 isFullScreen={ this.props.isFullScreen }
                                 toggleFullScreen={ this.props.toggleFullScreen }
                                />
                <EditorTips value={ this.props.patchTips }/>
                <EditorFileUpload value={ pc.link } isEditor={ isEditor } refName="file"
                                  downloadName={ pc.title }
                                  onChangeAction={ this.changeLink }/>
                {
                    this.props.isPreview
                    ?
                    // 预览
                    <iframe src={ this.state.previewUrl } className="preview-frame"/>
                    :
                    // 正常编辑
                    (() => {
                        switch (pc.type) {
                            case "docx":
                                return <div id="patch-describe">
                                    <EditorDataSelect name="版本" value={ pc.version } isEditor={ isEditor }
                                                      refName="version" onChangeAction={this.changeVersion}/>
                                    <EditorDataLine name="更新时间" value={date.getFormatDay(pc.updateTime)} disable={true}
                                                    isEditor={ isEditor }/>
                                    <EditorDataLine name="发布时间" value={ date.getFormatDay(pc.time) } disable={true}
                                                    isEditor={ isEditor }/>
                                    <EditorDataLine name="MD5" value={ pc.md5 } disable={true} isEditor={ isEditor }
                                                    isHighlight={ hf && hf.md5 ? true : false }
                                                    highlightValue={ hf && hf.md5 ? hf.md5[0] : ''}
                                                    refName="md5"/>
                                    <EditorDataArea name="描述" value={ pc.describe } isEditor={ isEditor }
                                                    isHighlight={ hf && hf.describe ? true : false }
                                                    highlightValue={  hf && hf.describe ?  hf.describe[0] : ''}
                                                    refName="desc"
                                                    onChangeAction={ this.changeDesc }/>
                                </div>;
                            case "doc":
                                return <div id="patch-describe">
                                    <EditorDataSelect name="版本" value={ pc.version } isEditor={ isEditor }
                                                    refName="version" onChangeAction={this.changeVersion}/>
                                    <EditorDataLine name="更新时间" value={date.getFormatDay(pc.updateTime)} disable={true}
                                                    isEditor={ isEditor }/>
                                    <EditorDataLine name="发布时间" value={ date.getFormatDay(pc.time) } disable={true}
                                                    isEditor={ isEditor }/>
                                    <EditorDataLine name="MD5" value={ pc.md5 } disable={true} isEditor={ isEditor }
                                                    isHighlight={ hf && hf.md5 ? true : false }
                                                    highlightValue={ hf && hf.md5 ? hf.md5[0] : ''}
                                                    refName="md5"/>
                                    <EditorDataArea name="描述" value={ pc.describe } isEditor={ isEditor }
                                                    isHighlight={ hf && hf.describe ? true : false }
                                                    highlightValue={  hf && hf.describe ?  hf.describe[0] : ''}
                                                    refName="desc"
                                                    onChangeAction={ this.changeDesc }/>
                                    </div>;
                            case "patch":
                            default: return <div id="patch-describe">
                                <EditorDataLine name="部门" value={  pc.department } isEditor={ isEditor }
                                                isHighlight={ hf && hf.department ? true : false }
                                                highlightValue={ hf && hf.department ? hf.department[0] : '' }
                                                refName="department"
                                                onValueChange={ this.changeDepartment }/>
                                <EditorDataLine name="作者" value={ pc.author } isEditor={ isEditor }
                                                isHighlight={ hf && hf.author ? true : false }
                                                highlightValue={ hf && hf.author ? hf.author[0] : ''}
                                                refName="author"
                                                onValueChange={ this.changeAuthor }/>
                                <EditorDataLine name="版本" value={ pc.version } isEditor={ isEditor }
                                                isHighlight={ hf && hf.version ? true : false }
                                                highlightValue={ hf && hf.version ? hf.version[0] : ''}
                                                refName="version"
                                                onValueChange={ this.changeVersion }/>
                                <DataModuleList name="所属模块" value={ pc.modules ? pc.modules.split(',') : ''}
                                               isHighlight={ hf && hf.modules ? true : false }
                                               highlightValue={ hf && hf.modules ? hf.modules[0].split(',') : '' }/>
                                <EditorDataLine name="更新时间" value={date.getFormatDay(pc.updateTime)} disable={true}
                                                isEditor={ isEditor }/>
                                <EditorDataLine name="发布时间" value={ date.getFormatDay(pc.time) } disable={true}
                                                isEditor={ isEditor }/>
                                <EditorDataLine name="MD5" value={ pc.md5 } disable={true} isEditor={ isEditor }
                                                isHighlight={ hf && hf.md5 ? true : false }
                                                highlightValue={ hf && hf.md5 ? hf.md5[0] : ''}
                                                refName="md5"/>
                                <EditorDataList name="修改的文件" value={ pc.modifiedFiles ? pc.modifiedFiles.split(',') : ''}
                                                isHighlight={ hf && hf.modifiedFiles ? true : false }
                                                highlightValue={ hf && hf.modifiedFiles ? hf.modifiedFiles[0].split(',') : '' }/>
                                <EditorDataArea name="描述" value={ pc.describe } isEditor={ isEditor }
                                                isHighlight={ hf && hf.describe ? true : false }
                                                highlightValue={  hf && hf.describe ?  hf.describe[0] : ''}
                                                refName="desc"
                                                onValueChange={ this.changeDesc }/>
                            </div>;
                        }
                    })()
                }
            </div>
        )
    }
}

export {Editor}