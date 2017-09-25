/**
 * Created by edeity on 16/8/19.
 */
import React, {Component} from 'react';

/**
 *
 */
class EditorTips extends Component {
    render() {
        var tips = this.props.value;
        return (
            // 提示信息
            <div className="tips">{ tips !== "undefined" && tips !== "" ? tips : "" }</div>
        )
    }
}
export {EditorTips}