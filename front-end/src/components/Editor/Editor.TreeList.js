/**
 * Created by edeity on 2017/3/6.
 */
import React, {Component} from 'react';

class TreeList extends Component {
    analyze() {

    }
    render() {
        let i = 0;
        return (
            this.props.val ?
                <ul>
                    {
                        this.props.val.map(function (result) {
                            i++;
                            return <li key={i}>{result}</li>
                        })
                    }
                    </ul>
            : <ul>未知</ul>
        )
    }
}
export default TreeList;