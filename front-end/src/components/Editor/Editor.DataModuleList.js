/**
 * Created by edeity on 16/8/24.
 */
import React, {Component} from 'react';
/**
 *
 */
class DataModuleList extends Component {
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
    };

    highlight = (htmlText) => {
        return {__html: htmlText}
    };

    render() {
        var isHighlight = this.props.isHighlight;
        return (
            <div>
                <span className="pst">{ this.props.name }</span>
                <span className="psv">
                    {
                        isHighlight
                            ?
                            this.props.highlightValue.map((module) => {
                                return <a key={module} className="module-name"
                                          dangerouslySetInnerHTML={this.highlight(module)}/>
                            })
                            : this.props.value ?

                            this.props.value.map((module) => {
                                return <a key={module} className="module-name">{module}</a>
                            })
                            : "未知"

                    }
                </span>
            </div>
        )
    }
}

export {DataModuleList}