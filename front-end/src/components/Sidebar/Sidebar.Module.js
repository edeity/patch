/**
 * Created by edeity on 16/8/24.
 */
import React, { Component } from 'react';

import {SideBtn} from './SideBar.Btn';

class Module extends Component {

    constructor() {
        super();
        this.state = {
            renderCategories: [],
            isShow: true,
        }
    }

    filter=(categories, filterKind) =>{
        var tempCategories = [];
        categories.forEach((category) => {
            if(category.categoryKind === filterKind) {
                tempCategories.push(category);
            }
        })
       return tempCategories;
    }

    hideCategories = () => {
        this.setState({
            isShow: false
        })
    }

    showCategories = () => {
        this.setState({
            isShow: true
        })
    }
    render() {
        var renderCategories = this.filter(this.props.categories, this.props.filterKind);
        return (
            <div className="category-module">
                <div className="category-title">
                    {
                        this.state.isShow
                            ?   <i className="fa fa-angle-down btn-logo" aria-hidden="true" onClick={this.hideCategories}/>
                            :   <i className="fa fa-angle-right btn-logo" aria-hidden="true" onClick={this.showCategories}/>
                    }
                    { this.props.name }
                </div>
                {
                    this.state.isShow
                        ?
                        <div className="category-module">
                            {
                                renderCategories.map((category) => {
                                    return <SideBtn
                                        handleClick={ this.props.handleClick }
                                        reload={ this.props.reload }
                                        key={ category.categoryId }
                                        categoryId={ category.categoryId }
                                        activeCategoryId={ this.props.activeCategoryId }
                                        isEditable={this.props.isEditable}
                                        hasTools={this.props.hasTools}
                                        editCategoryName={this.props.editCategoryName}
                                        categoryName={ category.categoryName } />
                                })
                            }
                        </div>
                        : null
                }
            </div>
        )
    }
}

export {Module}