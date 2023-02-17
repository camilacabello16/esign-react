import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Viewer from './Viewer.js';
import Toolbar from './Toolbar.js';
import pdfjsLib from 'pdfjs-dist/webpack';
import Draggable from 'react-draggable';
import SignatureDocument from './SignatureDocument2';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            isSign: false
        }
    }

    componentDidMount() {
        let loadingTask = pdfjsLib.getDocument(this.props.url);
        loadingTask.promise.then((doc) => {
            this.viewer.setState({
                doc,
            });
        }, (reason) => {
            console.error(`Error during ${this.props.url} loading: ${reason}`);
        });
    }

    componentWillUpdate() {
        let loadingTask = pdfjsLib.getDocument(this.props.url);
        loadingTask.promise.then((doc) => {
            console.log(doc);
            this.viewer.setState({
                doc,
            });
        }, (reason) => {
            console.error(`Error during ${this.props.url} loading: ${reason}`);
        });
    }

    zoomIn(e) {
        this.viewer.setState({
            scale: this.viewer.state.scale * 1.1
        });
    }
    zoomOut(e) {
        this.viewer.setState({
            scale: this.viewer.state.scale / 1.1
        });
    }
    displayScaleChanged(e) {
        this.toolbar.setState({
            scale: e.scale
        });
    }

    scrollTopProps(data) {
        console.log(data);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    {/* <h2>Welcome to PDF.js</h2> */}
                    {/* {this.state.showSign ? "a" : "b"} */}
                </div>
                <Toolbar
                    ref={(ref) => this.toolbar = ref}
                    onZoomIn={(e) => this.zoomIn(e)}
                    onZoomOut={(e) => this.zoomOut(e)}></Toolbar>
                <div>
                    {this.state.isSign == false &&
                        <Viewer
                            showSign={this.state.showSign}
                            scrollTopProps={this.scrollTopProps}
                            ref={(ref) => this.viewer = ref}
                            onScaleChanged={(e) => this.displayScaleChanged(e)}
                            onSign={() => {
                                this.setState({
                                    isSign: true
                                })
                            }}
                        />
                    }
                    {this.state.isSign == true &&
                        <SignatureDocument
                            // // ref={(ref) => this.viewer = ref}
                            showSign={this.state.showSign}
                            scrollTopProps={this.scrollTopProps}
                            ref={(ref) => this.viewer = ref}
                            onScaleChanged={(e) => this.displayScaleChanged(e)}
                            onSign={() => {
                                this.setState({
                                    isSign: true
                                })
                            }}
                        />
                    }
                </div>
            </div>
        );
    }
}

App.propTypes = {
    url: PropTypes.string,
};

export default App;
