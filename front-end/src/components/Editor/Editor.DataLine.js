/**
 * Created by edeity on 16/8/19.
 */
import React, {Component} from 'react';

/**
 *
 */
class EditorDataLine extends Component {
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
                    ? <input className="psv"
                             defaultValue={this.props.value }
                             ref={this.props.refName}
                             disabled={ this.props.disable }
                             onChange={ this.onChange }/>
                    : this.props.isHighlight ?
                    <span className="psv" dangerouslySetInnerHTML={this.highlight(this.props.highlightValue)}/>
                    : <span className="psv">{ this.props.value }</span>
                }
            </p>
        )
    }
}

export {EditorDataLine}