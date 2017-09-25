import React, {Component} from 'react';
import {Nav} from './Nav.js';
import {Container} from './Container';

import './tools/tbLib/rootSize'
import screen from './tools/fullscreen'

class App extends Component {

    constructor() {
        super();
        this.state = {
            isFullScreen: false
        };
        screen.onFullScreenExit(() => {
            this.toggleFullScreenView();
        })
    }

    toggleFullScreenView =() => {
        if (!screen.isFullScreen()) {
            // 进入全屏状态
            screen.toFullScreen()
        } else {
            // 退出全屏状态
            screen.exitFullScreen()
        }
        this.setState({isFullScreen: !this.state.isFullScreen});
    }

    render() {
        return (
            <div id="patch-app" className={ this.state.isFullScreen && 'full-screen'}>
                {!this.state.isFullScreen && <Nav></Nav>}
                <Container
                    isFullScreen={this.state.isFullScreen}
                    toggleFullScreen={this.toggleFullScreenView}>
                </Container>
            </div>
        )
    }
}
export default App;