/**
 * Created by edeity on 16/8/9.
 */
import React, {Component} from 'react';

import date from './../tools/date';
import constants from './../tools/constants';
var baseUrl = constants.URL.BASE_URL;

class BriefBtn extends Component {

    constructor() {
        super();
        this.state = {
            isHover: false
        }
    }

    handleClick = () => {
        this.props.handleClick(this.props.patchId, this.props.highlightField);
    };

    hover = () => {
        this.setState({
            isHover: true
        })
    };

    notHover = () => {
        this.setState({
            isHover: false
        })
    };

    dragStart = (event) => {
        var data = {
            preCategoryId: this.props.activeCategoryId,
            patchId: this.props.patchId
        };
        event.dataTransfer.setData('patch', JSON.stringify(data));
    };

    // 将补丁移除到垃圾箱
    removePatch = () => {
        // 当移动后的目录和补丁当前目录不相等时才执行更新操作
        var postData = {
            patchId: this.props.patchId
        }
        var url = baseUrl + 'lists/remove';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(function (response) {
            return response.json();
        }).then((json)=> {
            if (json.status === 1) {
                this.props.removeListBtn(this.props.element);
            } else if (json.status === 0) {
                alert(json.msg.errmsg)
            }
        })
    }

    render() {
        var patchId = this.props.patchId;
        return (
            <li className={ (this.props.activePatchId === patchId ? 'active' : '')}
                data-patchid={ patchId }
                onClick={ this.handleClick }
                draggable="true"
                onDragStart={ this.dragStart }
            >
                
                <div className="patch-brief">
                    <span className="title">
                        {
                            (() => {
                                switch (this.props.type) {
                                    case 'doc':
                                    case 'docx':
                                        return <i className="fa fa-file-word-o" aria-hidden="hidden"/>
                                    case 'patch':
                                    default: return <i className="fa fa-file" aria-hidden="hidden"/>
                                }
                            })()
                            /*
                            this.props.categoryId === this.props.dustbinId
                                ? <i className="fa fa-trash" aria-hidden="true"/>
                                : <i className="fa fa-file-o" aria-hidden="true"/>
                            */
                        }
                        { this.props.title }
                    </span>
                </div>
                <time className="time">{ date.getFormatDay(this.props.updateTime, "yyyy-MM-dd") }</time>
                    {
                        // 当当前目录为垃圾箱时, 不显示工具栏
                        this.props.categoryId !== this.props.dustbinId
                            ?
                            <div className="list-tools">
                                <a className="delete-btn btn" onClick={this.removePatch}>
                                    <i className="fa fa-trash-o" aria-hidden="true"/>
                                </a>
                            </div>
                            : null
                    }
                
            </li>
        )
    }
}

export {BriefBtn}