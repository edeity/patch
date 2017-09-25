/**
 * Created by edeity on 16/8/8.
 */
import React, { Component } from 'react';

class Nav extends Component {
    constructor() {
        super();
        this.state = {
            isLogin: false,
            tobeLogin: false
        }
    }
    render() {
        return (
            <div id="nav">
                <span id="app-title">资源管理系统</span>
                <span className="tips"> 修改操作习惯: 点击分类后才可上传 </span>
                <div className="link-group">
                    <a id="instructions" className="btn" target="_blank"
                       href="./doc/index.html">使用说明
                    </a>
                    <a id="update-content" className="btn" target="_blank"
                       href="http://blog.edeity.me/2016/09/02/patch-doc/">更新详情
                    </a>
                </div>
            </div>
        )
    }
}

export {Nav}