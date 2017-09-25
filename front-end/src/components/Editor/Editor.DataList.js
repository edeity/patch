/**
 * Created by edeity on 16/8/20.
 */
import React, {Component} from 'react';

import TreeList from './Editor.TreeList'
/**
 *
 */
class EditorDataList extends Component {
    constructor() {
        super();
        this.state = {
            isShow: false
        }
    }

    clickHandle = () => {
        this.setState({
            isFileShow: !this.state.isFileShow
        })
    }
    highlight = (htmlText) => {
        return {__html: htmlText}
    }

    render() {
        let i = 0;
        let iconClass = this.state.isFileShow ? 'fa fa-angle-down' : 'fa fa-angle-up';
        let isHighlight = this.props.isHighlight;
        return (
            <div>
                <span className="pst">{ this.props.name }</span>
                <span className="psv"><i className={iconClass} aria-hidden="true" onClick={ this.clickHandle }/></span>
               
                {
                    this.state.isFileShow
                        ?
                            isHighlight ?
                                <ul>
                                    {
                                        this.props.highlightValue.map((result) => {
                                            return <li key={i} dangerouslySetInnerHTML={this.highlight(result)}/>
                                        })
                                    }
                                </ul>
                                :  <TreeList val={this.props.value}/>
                            
                        : ''
                }
            </div>
        )
    }
}

export {EditorDataList}