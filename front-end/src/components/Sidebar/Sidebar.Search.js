/**
 * Created by edeity on 2017/3/6.
 */
import React, { Component } from 'react';
class Search extends Component {
    search =(e) =>{
        const ENTER_KEY = 13;
        // 回车: 13
        if(e.keyCode === ENTER_KEY) {
            var searchValue = this.refs["search-class"].value;
            this.props.onEnter(searchValue);
        }
    }
    render(){
        return (
            <div id="search-class-panel">
                <div id="search-panel">
                    <i className="fa fa-search search-logo"/>
                    <input id="search" placeholder="搜索..." ref="search-class" onKeyUp={ this.search }/>
                </div>
            </div>
        )
    }
}
export {Search}