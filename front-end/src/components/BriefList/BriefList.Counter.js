/**
 * Created by edeity on 16/8/22.
 */
import React, {Component} from 'react';

class BriefCounter extends Component {
    render() {
        return (
            <div id="patch-counter">
                <div id="patch-brief">
                    <span>总共 {this.props.value} 项</span>
                    {
                        this.props.pageNum === 1 &&
                        (typeof this.props.value === 'undefined' ||  this.props.value < this.props.perPageNum)
                            ? null
                            :
                            <div id="list-page-controller">
                                <a id="prePage" className="pageNumBtn" onClick={ this.props.prePage }>
                                    <i className="fa fa-arrow-circle-left"/>
                                </a>
                                    <span id="pageNum">{ this.props.pageNum }</span>
                                <a id="nextPage" className="pageNumBtn" onClick={ this.props.nextPage }>
                                    <i className="fa fa-arrow-circle-right"/>
                                </a>
                            </div>

                    }
                </div>
            </div>
        )
    }
}

export {BriefCounter}