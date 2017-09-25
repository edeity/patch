/**
 * Created by edeity on 16/8/19.
 */
import React, {Component} from 'react';

/**
 *
 */
class EditorDataArea extends Component {
    onChange = () => {
        var value = this.refs[this.props.refName].value;
        this.props.onValueChange(value);
    }
    highlight = (htmlText) => {
        return {__html: htmlText}
    }
    render() {
        var value = this.props.value;
        var isEditor = this.props.isEditor;
        return (
            <div>
            <p><span className="pst">{ this.props.name }</span></p>
            {
                isEditor
                ? <textarea 
                    value={ value }
                    ref={ this.props.refName }
                    onChange={ this.onChange }/>
                : this.props.isHighlight
                    ? <p className="paraLike" dangerouslySetInnerHTML={this.highlight(this.props.highlightValue)}/>
                    : <textarea className="paraLike" value={ value } disabled="disabled"/>
            }
            </div>
        )
    }
}

export {EditorDataArea}