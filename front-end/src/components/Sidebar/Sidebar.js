/**
 * Created by edeity on 16/8/8.
 */
import React, {Component} from 'react';

import {Search} from './Sidebar.Search';
import {Module} from './Sidebar.Module';
import {SideBtn} from './SideBar.Btn'

class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            searchContent: ''
        }
    }
    /**
     * 回车搜索类名
     * @param e
     */
    search = (value) =>{
        this.props.searchClass(value);
    }

    render() {
        // 系统分类
        var categories = this.props.categories;
        // 系统分类
        var systemCategories = [];
        // 部门分类
        var departmentCategories = [];
        // 自定义分类
        var userCategories = [];
        // 定义分类的级别
        var CATEGORY_KIND = {
            // 系统级别的, 如垃圾箱
            SYSTEM: 0,
            // 常规类别, 一般不可新增, 如"企业报表"
            DEPARTMENT: 1,
            // 用户新建的, 如"个人文件夹"
            USERS: 9
        };
        // 预处理
        categories.forEach(function (category) {
            switch(category.categoryKind) {
                case CATEGORY_KIND.SYSTEM:
                    systemCategories.push(category);
                    break;
                case CATEGORY_KIND.DEPARTMENT:
                    departmentCategories.push(category);
                    break;
                case CATEGORY_KIND.USERS:
                    userCategories.push(category);
                    break;
                default:
                    console.log('不可辨别分类类型');
            }
        });

        // for(var category of categories) {
        // 去他妈的of, 不支持ie(of 在 ie9下并不能运行)!!!
        // }

        // 暂时隐藏了垃圾箱
        // var dustbin = systemCategories[0];

        return (
            <div id="sidebar">
                <Search onEnter={ this.search }/>
                <div id="categories">
                    <div className="sidebar-btn">
                        <i className="fa fa-plus-square-o btn-logo" aria-hidden="true"/>
                        <a id="create-category-btn" className="btn" onClick={this.props.search}>新建分类</a>
                    </div>
                    <Module name={"预置分类"}
                            categories={this.props.categories}
                            filterKind={CATEGORY_KIND.DEPARTMENT}
                            isEditable={false}
                            editCategoryName={this.props.editCategoryName}
                            reload={this.props.reload}
                            handleClick={this.props.handleClick}
                            activeCategoryId={this.props.activeCategoryId}/>
                    <Module name={"新建分类"}
                            categories={this.props.categories}
                            filterKind={CATEGORY_KIND.USERS}
                            isEditable={true}
                            editCategoryName={this.props.editCategoryName}
                            reload={this.props.reload}
                            handleClick={this.props.handleClick}
                            activeCategoryId={this.props.activeCategoryId}/>
                    <SideBtn className="trash"
                        logoClass={"fa fa-trash-o"}
                        handleClick={ this.props.handleClick }
                        reload={ this.props.reload }
                        key={ this.props.dustbinId }
                        categoryId={ this.props.dustbinId }
                        activeCategoryId={ this.props.activeCategoryId }
                        isEditable={ false }
                        hasTools={ false }
                        categoryName={ "回收站" } />
                </div>
            </div>
        )
    }
}

export { Sidebar}