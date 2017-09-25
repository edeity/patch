import React, {Component} from 'react';

/**
 * 选项
 */
class EditorDataSelect extends Component {
    constructor() {
        super();
        this.selectVersion = [
            {v: '未知'},
            {v: '通用'},
            {v: 5.7},
            {v: 5.75},
            {v: 6.1},
            {v: 6.3},
            {v: 6.33},
            {v: 6.5},
            {v: 6.7}
        ]
    }

    onChange = () => {
        var value = this.refs[this.props.refName].value;
        this.props.onValueChange(value);
    }
    highlight = (htmlText) => {
        return {__html: htmlText}
    }

    render() {
        return (
            <p className="ps-line">
                <span className="pst">{ this.props.name }</span>
                { this.props.isEditor
                    ?
                    <select ref={this.props.refName}  onChange={ this.onChange }>
                        {
                            this.selectVersion.map((result) =>{
                                return <option key={this.props.refName + result.v}> {result.v }</option>
                            })
                        }
                    </select>
                    : this.props.isHighlight ?
                    <span className="psv" dangerouslySetInnerHTML={this.highlight(this.props.highlightValue)}/>
                    : <span className="psv">{ this.props.value }</span>
                }
            </p>
        )
    }
}

export {EditorDataSelect}