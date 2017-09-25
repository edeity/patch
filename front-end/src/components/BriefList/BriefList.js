/**
 * Created by edeity on 16/8/8.
 */
import React, { Component } from 'react';

import {BriefBtn} from './BriefList.Btn';
import {BriefCounter} from './BriefList.Counter';
import {BriefSearch} from './BriefList.Search';
import {Progress} from './BriefList.Progress'

class BriefList extends Component {
    constructor() {
        super();
        this.state = {
            searchContent : '',
            perPageNum : 1000
        }
    }

    /**
     * 下一页
     */
    nextPage = () => {
        var pageNum = this.props.currentPageNum + 1;
        var perPageNum = this.state.perPageNum; // 该项应该从后台加载
        if(this.props.patchList.length === perPageNum) {
            this.props.changeListPage(pageNum);
            this.props.reload(null, null, pageNum);
        }
    };

    /**
     * 上一页
     */
    prePage = () => {
        var pageNum = this.props.currentPageNum - 1;
        if(pageNum > 0) {
            this.props.changeListPage(pageNum);
            this.props.reload(null, null, pageNum);
        }
    };
    /**
     * 过滤文本内容
     * @param searchContent 文本内容
     */
    titleFilter = (searchContent) => {
        this.setState({
            searchContent: searchContent
        })
    };
    
    // 搜索的内容和输入的内容是否匹配, 该方法应不仅仅包含模糊匹配
    render() {
        var handleClick = this.props.handleClick;
        var searchContent = this.state.searchContent;
        var tips = this.props.patchListTips;
        var dustbinId = this.props.dustbinId;
        var activePatchId = this.props.activePatchId;
        var activeCategoryId = this.props.activeCategoryId;
        var removeListBtn = this.props.removeListBtn;
        var listNum = 0;
        
        // 离线的模糊匹配方法, title和searchContent相等
        function isMatch(title) {
            var reg = new RegExp(searchContent, "i");// 忽略大小写
            if(searchContent=== "" || reg.test(title))
                return true
        }
        return (
            <div id="list">
                {
                    this.props.activeCategoryId ?
                        <div id="list-content">
                            <BriefSearch titleFilter={ this.titleFilter }></BriefSearch>
                            <Progress activeCategoryId={ this.props.activeCategoryId }
                                      afterFinished={ this.props.reload }/>
                            {
                                tips !== "undefined" && tips !== "" ? <div className="tips">{ tips }</div> : null
                            }
                            <ul id="patch-list" className="no-list-style">
                                {
                                    this.props.patchList.map(function (result) {
                                        const title = result.title; // 标题
                                        const patchId = result.patchId;
                                        const highlightField = result.highlightField; // 高亮文本
                                        const type = result.type; // 资源类型
                                        if(isMatch(title)) {
                                            listNum ++;
                                            return <BriefBtn
                                                element={result}
                                                handleClick={ handleClick }
                                                removeListBtn={ removeListBtn }
                                                key={ patchId }
                                                patchId={ patchId }
                                                highlightField={ highlightField }
                                                type={ type }
                                                dustbinId={ dustbinId }
                                                activeCategoryId={ activeCategoryId }
                                                categoryId={result.categoryId }
                                                activePatchId={ activePatchId }
                                                title={ title }
                                                time={ result.time }
                                                updateTime={ result.updateTime }/>;
                                        }else {
                                            return null; // 针对eslint检测
                                        }
                                    })
                                }
                            </ul>
                            <BriefCounter value={ listNum }
                                          pageNum={ this.props.currentPageNum }
                                          perPageNum={ this.state.perPageNum }
                                          nextPage={ this.nextPage }
                                          prePage={ this.prePage }
                            />
                        </div>
                        : null
                }
            </div>
        )
    }
}

export {BriefList}