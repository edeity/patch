/**
 * Created by edeity on 16/8/8.
 */
import React, {Component} from 'react';
import {BriefList} from './BriefList/BriefList';
import {Sidebar} from './Sidebar/Sidebar';
import {Editor} from './Editor/Editor';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


import '../css/animate.css'

import constants from './tools/constants';

// 常用配置设置
var baseUrl = constants.URL.BASE_URL;
var searchUrl = constants.URL.SEARCH_URL;

class Container extends Component {
    constructor() {
        super();

        this.state = {
            // 程序入口url
            categoriesUrl: baseUrl + 'categories',
            isEditor: false,
            isPreview: false,
            dustbinId: '',
            activeCategoryId: '',
            activePatchId: '',// 和后台对接的patchid(后台唯一)
            currentPageNum: 1,// 当前页数
            // 当前补丁的详细信息,
            currentPatchContent: {},
            // 高亮的字段
            highlightField : null,
            // 当前大目录的详细信息
            categories: [],
            // 当前补丁的列表
            patchList: [],
            patchListTips: '',
            patchTips: '',
        };

        this.connectTest();
        this.getDustbinId();
        // 加载链 : loadCategories -> loadPatchList -> loadPatchContent
        this.loadCategories();
    }


    /**
     * 测试并提示是否能连接到后台服务器(和前端代码不是一个端口)
     */
    connectTest = () => {
        fetch(baseUrl).then(function (response) {
            return response.json()
        }).then((json) => {
            if(json.status === 1) {
                console.log('连接后台成功...')
            }
        }).catch(function (err) {
            var str = '无法连接到服务器, 请联系管理员';
            console.error(str);
            alert(str);
        })
    };
    /**
     * 获取垃圾箱分类id
     */
    getDustbinId = () => {
        var url = baseUrl + "categories/dustbin";
        fetch(url).then(function (response) {
            return response.json()
        }).then((json) => {
            if (json.status === 0) {
                console.error(json.msg);
            } else {
                this.setState({
                    dustbinId: json.dustbinId
                })
            }

        })
    };

    /**
     * 列表提示信息
     * @param tips
     * @param lastTime
     */
    showPatchListTips = (tips, lastTime) => {
        this.setState({
            patchListTips: tips
        });
        lastTime && setTimeout(() => {
            this.setState({
                patchListTips: tips
            })
        }, lastTime);
    };

    /**
     * 编辑器提示信息
     * @param tips
     * @param lastTime
     */
    showEditorTips = (tips, lastTime) => {
        lastTime = lastTime || 2000;
        this.setState({
            patchTips: tips
        });
        setTimeout(() => {
            this.setState({
                patchTips: ''
            })
        }, lastTime);
    };


    /**
     * 新建目录
     */
    createCategory = () => {
        var postData = {
            categoryName: "未命名",
        };
        var url = baseUrl + "categories";
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            if (json.status === 1) {
                this.loadCategories();
            } else if (json.status === 0) {
                alert(json.msg.errmsg)
            }
        })
    };

    /**
     * 更改目录名称
     * @param categoryId
     * @param categoryName
     */
    editCategoryName = (categoryId, categoryName) => {
        var postData = {
            categoryId: categoryId,
            categoryName: categoryName
        };
        var url = baseUrl + 'categories/update';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(function (response) {
            return response.json()
        }).then((json)=> {
            if (json.status === 1) {
                this.loadCategories();
            } else if (json.status === 0) {
                alert(json.msg.errmsg)
            }
        })
    };

    /**
     * 加载该所有分类
     * @param categoryId
     */
    loadCategories = (categoryId) => {
        // 根据上级目录加载
        var url = this.state.categoriesUrl;
        fetch(url).then(function (response) {
            return response.json();
        }).then((json) => {
            if(json[0] && json[0].categoryId) {
                // 假如没有设置传入的激活状态的分类, 则默认选取第一个
                // var activeCategoryId = categoryId ? categoryId : json[0].categoryId;
                this.setState({
                    categories: json,
                });
            } else {
                console.error('分类信息为空, 请确保数据库中存在预分类信息');
            }
        })

    };

    /**
     * 在视图上移除当前列表项
     * @param element
     */
    removeListBtn = (element) => {
        var patchList = this.state.patchList;
        var index = patchList.indexOf(element);
        patchList.splice(index, 1);
        this.setState({
            patchList: patchList
        })
    };

    /**
     * 加载补丁列表
     * @param categoryId 加载的分类id
     * @param patchId 加载的补丁id
     * @param pageNum 加载的页数
     */
    loadPatchList = (categoryId, patchId, pageNum) => {
        this.setState({
            highlightField: null,
            activeCategoryId: categoryId
        }, () => {
            categoryId = categoryId || this.state.activeCategoryId;
            pageNum = pageNum || this.state.currentPageNum || 1;
            // 每次加载PatchList时初始化为零
            this.setState({ patchListTips: ''});
            // this.cannotBeEditor();
            var url = baseUrl + "lists?categoryId=" + categoryId + "&pageNum=" + pageNum;
            fetch(url).then(function (response) {
                return response.json()
            }).then((json) => {
                if (json.status === 0) {
                    alert(json.msg.message);
                } else {
                    if (json.length === 0) {
                        // 当为零时,标示未能从后台加载对应的信息(即没有该目录补丁)
                        this.showPatchListTips('该目录下暂时没有文件');
                        this.setState({
                            patchList: json
                        })
                    } else {
                        var activePatchId = patchId ? patchId : json[0].patchId;
                        this.setState({
                            patchList: json,
                            activePatchId: activePatchId
                        });
                        // 当且后台有数据的时候才去加载补丁信息
                        this.loadPatchContent(activePatchId);
                    }
                }

            })
        })
    };

    /**
     * 加载具体补丁内容
     * @param patchId
     */
    loadPatchContent = (patchId) => {
        patchId = patchId || this.state.activePatchId;
        // 恢复到不可编辑状态
        this.isEdit(false);
        this.toPreview(false);
        var url = baseUrl + "patches?patchId=" + patchId;
        fetch(url).then(function (response) {
            return response.json()
        }).then((json) => {
            this.setState({
                currentPatchContent: json
            })
        });
    };

    /**
     * 利用elasticsearch进行关键字段搜索, 该方法的效率较低, 当涉及大量补丁时, 需要优化,
     * 因为原来ui逻辑, 目前从elasticsearch获取补丁信息后, 还是会根据补丁id(patchId)从mongod中读取id信息
     * @param searchValue 类名
     */
    searchClass = (searchValue) => {
        var url = searchUrl + 'patch/patches/_search';
        // var dustbinId = this.state.dustbinId;

        var postData = {
            "query": {
                "bool": {
                    "should": [
                        {"match": {"title": searchValue}},
                        {"match": {"department": searchValue}},
                        {"match": {"author": searchValue}},
                        {"term": {"version": searchValue}},
                        {"term": {"md5": searchValue}},
                        {"match": {"modules": searchValue}},
                        {"match": {"modifiedFiles": searchValue}},
                        {"match": {"describe": searchValue}},
                    ],
                    "minimum_should_match" : 1
                }
            },
            "highlight": {
                "fields": {
                    "title": {},
                    "department": {},
                    "author": {},
                    "modifiedFiles": {},
                    "describe": {},
                    "modules": {},
                    "version": {},
                    "md5": {}
                }
            }
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            // 从elasticsearch中返回的数据
            var listResult = json.hits.hits;
            var needLists = [];
            // 过滤, 一个很糟糕的做法
            listResult.forEach(function (list) {
                var tempPatchList = {
                    patchId: list._id,
                    time: list._source.time,
                    updateTime: list._source.updateTime,
                    title: list._source.title,
                    categoryId: list._source.categoryId,
                    highlightField: list.highlight
                };
                needLists.push(tempPatchList);
            });

            // console.log(needLists);

            if (needLists.length === 0) {
                this.showPatchListTips('未搜到相关补丁');
                this.setState({
                    patchList: needLists,
                    activeCategoryId: -1
                })
            } else {
                this.showPatchListTips('');
                this.setState({
                    patchList: needLists,
                    activePatchId: needLists[0].patchId,
                    highlightField: needLists[0].highlightField,
                    // 因为不对应所有分类, 所以设置为-1
                    activeCategoryId: -1
                })
            }
        })
    };

    /**
     * 店家分类按钮, 请求加载补丁列表
     * @param categoryId
     */
    clickSidebarBtn = (categoryId) => {
        this.setState({activeCategoryId: categoryId});
        this.loadPatchList(categoryId);
    };

    /**
     * 点击补丁列表按钮, 请求加载补丁
     * @param patchId 补丁id
     * @param highlightField 需要高亮的字段
     */
    clickPatchListBtn = (patchId, highlightField) => {
        this.setState({
            activePatchId: patchId,
            highlightField: highlightField
        });
        this.loadPatchContent(patchId);
    };

    isEdit = (isEdit) => {
        this.setState({
            isEditor: isEdit
        })
    };
    toPreview = (isPreview) => {
        this.setState({
            isPreview: isPreview
        })
    }
    
    /**
     * 改变补丁名字
     * @deprecated 因为仅为花哨的同步结果而耗费性能和增加程序复杂度, 现已经被抛弃, 不推荐使用
     * @param title
     */
    changeTitle = (title) => {
        // 同步编辑框和列表框, 但该操作不会直接进行ajax请求, 当且仅当点击提交按钮的时候, 同时改变Patch内容和标题
        var patchList = this.state.patchList;
        var activePatchId = this.state.activePatchId;
        var isGet = false;
        for (var i = 0, len = patchList.length; i < len && !isGet; i++) {
            if (patchList[i].patchId === activePatchId) {
                patchList[i].title = title;
                this.setState({
                    patchList: patchList,
                });
                isGet = true;
            }
        }
    };

    /**
     * 改变当前列表的页数
     * @param pageNum 页数
     */
    changeListPage = (pageNum) => {
        this.setState({
            currentPageNum : pageNum
        })
    };

    /**
     * 完成编辑后, 提交补丁表单
     * @param patchContent
     */
    submit = (patchContent) => {
        var keys = Object.keys(patchContent);
        // 当keys为0时, 证明表单没有被更改, 所以不需要向后台提交表单
        if (keys.length !== 0) {
            var postData = {
                patchId: this.state.activePatchId,
                patchContent: patchContent
            };
            var url = baseUrl + "patches?patchId=" + this.state.activePatchId;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            }).then(function (response) {
                return response.json()
            }).then((json) => {
                if (json.status === 0) {
                    alert(json.msg.message);
                } else if (json.status === 1) {
                    // 重新从服务器中获取信息
                    this.loadPatchContent(this.state.activePatchId);
                    // 设置提示信息, 并更新内容
                    this.showEditorTips("更新成功");
                }
            })
        }
    };
    
    render() {
        return (
            <div id="container">
                {
                    !this.props.isFullScreen &&
                    <Sidebar
                        categories={ this.state.categories }
                        activeCategoryId={this.state.activeCategoryId}
                        dustbinId={ this.state.dustbinId }
                        createCategory={ this.createCategory }
                        editCategoryName={ this.editCategoryName }
                        handleClick={ this.clickSidebarBtn }
                        searchClass={this.searchClass}
                        reload={ this.loadPatchList }
                        setActivePatchId={ this.setActivePatchId }
                    />
                }
                {
                    !this.props.isFullScreen &&
                    // <ReactCSSTransitionGroup transitionName="up-to-down"
                    //                          transitionAppear={true}
                    //                          transitionAppearTimeout={500}
                    //                          transitionEnter={false}
                    //                          transitionLeave={false}>
                        <BriefList
                            patchList={ this.state.patchList }
                            patchListTips={ this.state.patchListTips }
                            activePatchId={ this.state.activePatchId }
                            activeCategoryId={ this.state.activeCategoryId }
                            dustbinId={ this.state.dustbinId }
                            currentPageNum={ this.state.currentPageNum }
                            handleClick={ this.clickPatchListBtn }
                            reload={ this.loadPatchList }
                            changeListPage={ this.changeListPage }
                            removeListBtn={ this.removeListBtn }/>
                    // </ReactCSSTransitionGroup>
                }
                {
                    this.state.patchList.length !== 0 && this.state.activePatchId
                        ?

                            <Editor
                            isEditor={ this.state.isEditor } // 是否处于编辑状态
                            isEdit={ this.isEdit } // 更改编辑状态
                            isPreview={ this.state.isPreview }
                            toPreview={ this.toPreview }
                            patchId={this.state.activePatchId} // 文件id
                            patchContent={ this.state.currentPatchContent } // 文件内容
                            highlightField={ this.state.highlightField } // 高亮字段
                            patchTips={ this.state.patchTips } // 提示(如错误提示)
                            activeCategoryId={this.state.activeCategoryId} // 激活的分类id(用于提交)
                            submit={ this.submit } // 提交
                            changeTitle={ this.changeTitle } // 更改标题的方法
                            showEditorTips={this.showEditorTips} // 编辑状态
                            reload={ this.loadPatchList }
                            isFullScreen={ this.props.isFullScreen }
                            toggleFullScreen={ this.props.toggleFullScreen }
                            /> // 刷新
                        : <div id="editor">
                        <div className="editor-logo"><i className="fa fa-paper-plane-o"/></div>
                    </div>
                }

            </div>
        )
    }
}

export {Container}