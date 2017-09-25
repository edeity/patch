/**
 * Created by edeity on 16/8/9.
 */
import React, { Component } from 'react';

class BriefSearch extends Component {
    onChange = (e) => {
        this.props.titleFilter(e.target.value);
    };
    render() {
        return (
            <div id="list-search-bar">
                <div id="list-search">
                    <input onChange={this.onChange} placeholder="标题快查"/>
                </div>
            </div>
        )
    }
}

export {BriefSearch}