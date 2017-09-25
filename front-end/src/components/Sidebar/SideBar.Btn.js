/**
 * Created by edeity on 16/8/9.
 */
import React, { Component} from 'react';

import constants from './../tools/constants';
var baseUrl = constants.URL.BASE_URL;

class SideBtn extends Component {
    constructor() {
        super();
        this.state = {
            isEdit : false,
            isDragPatchIn: false
        }
    }
    loadPatchList = () => {
        this.props.handleClick(this.props.categoryId);
    }

    tobeEdit =(e) => {
        // 判断目录名称是否可以修改,
        if(this.props.isEditable) {
            this.setState({
                isEdit: true
            });
        }
    }
    componentDidUpdate = () => {
        // input未被初始化时,是不能通过this.refs.cate获取到input的
        if(this.state.isEdit === true) {
            this.refs.cate.focus();
        }
    }
    preventDefault = (event) => {
        event.preventDefault();
    }
    dragPatchIn = (event) => {
        // event.preventDefault();
        this.setState({
            isDragPatchIn: true
        })
    }
    dragPatchOut = (event) => {
        // event.preventDefault();
        this.setState({
            isDragPatchIn: false
        })
    }
    /**
     * 改变patch的分类
     * @param event
     */
    changePatchCategory = (event) => {
        event.preventDefault();
        var data;
        try {
            data = JSON.parse(event.dataTransfer.getData('patch'));
        } catch(e) {
            return;
        }
        this.setState({
            isDragPatchIn: false
        })
        var currentCategoryId = this.props.categoryId;
        // 当移动后的目录和补丁当前目录不相等时才执行更新操作
        if(currentCategoryId !== data.preCategoryId) {
            var postData = {
                categoryId: currentCategoryId,
                patchId: data.patchId
            }
            var url = baseUrl + 'lists/update';
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
                if(json.status === 1) {
                    this.props.reload( currentCategoryId );
                } else if(json.status === 0){
                    alert(json.msg.errmsg)
                }
            })
        }
    }

    editCategoryName = () => {
        if(this.refs.cate.value !== this.props.categoryName) {
            // 当标题有变动时,才请求后台
            this.props.editCategoryName(this.props.categoryId, this.refs.cate.value);
        }
        this.setState({
            isEdit: false
        });
    }
    render() {
        var isActive = (this.props.activeCategoryId === this.props.categoryId);
        return (
            <div className={  (isActive ? 'is-active' : '')  + (this.state.isDragPatchIn ? ' drag-in': '') + ' category ' + this.props.className}
                onClick={ this.loadPatchList }
                onDragEnter={ this.dragPatchIn }
                onDragLeave={ this.dragPatchOut }
                onDragOver={ this.preventDefault }
                onDrop={ this.changePatchCategory }
            >
                <i className={(this.props.logoClass || "fa fa-folder") + " category-logo " } aria-hidden="true"/>
                {
                    this.state.isEdit
                        ? <input className="category-editor category-name"
                                 defaultValue={ this.props.categoryName }
                                 onBlur={ this.editCategoryName }
                                 ref="cate"/>
                        : <a className="category-name" onDoubleClick={ this.tobeEdit }>{ this.props.categoryName }</a>
                }
            </div>
        )
    }
}

export { SideBtn }