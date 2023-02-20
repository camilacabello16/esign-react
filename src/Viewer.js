import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { PDFJS as PDFJSViewer } from 'pdfjs-dist/web/pdf_viewer.js';
import './Viewer.css';
import 'pdfjs-dist/web/pdf_viewer.css';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import { calculateCoordicate } from './calculateCoordinatePdf';

class Viewer extends Component {
    constructor(props) {
        super(props);
        this.initEventBus();
        this.state = {
            doc: null,
            scale: undefined,
            height: 0,
            position: [],
            scrollTop: 0,
            showSign: false,
            listSign: [],
            listSignData: [],
            listKey: [],
            signData: [],
        };
        this.myRef = React.createRef();
    }
    initEventBus() {
        let eventBus = new PDFJSViewer.EventBus();
        eventBus.on('pagesinit', (e) => {
            this.setState({
                scale: this._pdfViewer.currentScale
            });
            if (this.props.onInit) {
                this.props.onInit({});
            }
            if (this.props.onScaleChanged) {
                this.props.onScaleChanged({ scale: this.state.scale });
            }
        });
        eventBus.on('scalechange', (e) => {
            if (this.props.onScaleChanged) {
                this.props.onScaleChanged({ scale: e.scale });
            }
        });
        this._eventBus = eventBus;
    }

    // generate pdf view
    componentDidMount() {
        // console.log(calculateCoordicate(516, 2238));
        let viewerContainer = document.getElementById('viewer');
        this._pdfViewer = new PDFJSViewer.PDFViewer({
            container: viewerContainer,
            eventBus: this._eventBus,
        });
    }

    //zoom in - zoom out
    componentWillUpdate(nextProps, nextState) {
        if (this.state.doc !== nextState.doc) {
            this._pdfViewer.setDocument(nextState.doc);
        }
        if (this.state.scale !== nextState.scale) {
            this._pdfViewer.currentScale = nextState.scale;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.doc !== nextState.doc ||
            this.state.scale !== nextState.scale) {
            return true;
        }
        return false;
    }

    // get last key để drage
    findLast(key) {
        const arrKeys = this.state.signData.map(el => el.index);
        return arrKeys.lastIndexOf(key);
    }

    findKeyIsExits(key) {
        return this.state.listKey.indexOf(key);
    }


    //check key hiện tại, là tạo mới hay key đã có => handle multiple sign
    checkDuplicateKey(key) {
        return this.state.signData.indexOf(key);
    }

    // handle data
    handleData(e, key) {
        if (this.checkDuplicateKey(key) == -1) {
            this.state.listKey.push(key);
        }
        this.state.signData.push({
            position: e,
            index: key,
        })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    // lay ra vi tri scroll ở trên cùng của màn hình hiện tại
    onScroll = () => {
        const scrollTop = this.myRef.current.scrollTop
        this.setState({
            scrollTop: scrollTop
        })
    }

    onStop = (e) => {
    }

    // tạo ra sign mới, khi click vào add sign
    signButton = () => {
        this.setState({
            showSign: true,
            listSign: this.state.listSign.concat(
                <Draggable
                    key={uuidv4()}
                    handle=".handle"
                    defaultPosition={{ x: 0, y: this.state.scrollTop }}
                    // onStop => get position cuoi cung sau khi keo tha
                    onStop={(e) => {
                        this.state.position = [e.lastX, e.lastY], this.handleData(this.state.position);
                    }}
                >
                    <div className='drag__button'>
                        <div className="handle">
                            <i className="fa-solid fa-arrows-up-down-left-right"></i>
                        </div>
                        <div className='signZone'>
                            Sign
                        </div>
                    </div>
                </Draggable>
            )
        })
        this.forceUpdate();
    }

    confirmSignArea = () => {
        var listSign = [];
        var newData = [];
        for (var i = 0; i < this.state.signData.length; i++) {
            newData.push(this.state.signData[this.state.signData.length - i - 1]);
        }
        var keyDistinct = ([...new Set(this.state.listKey)]);
        for (let i = 0; i < keyDistinct.length; i++) {
            var key = keyDistinct[i];
            var dataCoordinate = newData.find(x => x.index == key);
            listSign.push(dataCoordinate);
        }
        console.log(listSign);
        for (var i = 0; i < listSign.length; i++) {
            listSign[i].coordinateObject = calculateCoordicate(listSign[i].position[0], listSign[i].position[1]);
        }
        console.log(listSign);
        localStorage.setItem("pdf-coordinate-history", JSON.stringify(listSign));
        this.props.onSign();
    }

    // đa phần đều dùng những func có sẵn của dragable react
    // link: https://www.npmjs.com/package/react-draggable

    render() {
        return (
            <div>
                <div className="toolbar">
                    <div className="toolbar__sign">
                        <button className="toolbar__button" onClick={() => this.signButton()}>Chữ ký</button>
                    </div>
                    {/* <div className="toolbar__text">
                        <button className="toolbar__button">text</button>
                    </div> */}
                    <div className="toolbar__text">

                        <button className="toolbar__button" onClick={() => this.confirmSignArea()}>
                            Lưu
                        </button>
                    </div>
                </div>

                <div className='App-body'>
                    <div className="Viewer" onScroll={this.onScroll} ref={this.myRef}>
                        <div className="pdf-wrapper">
                            <div className="pdf-viewer" id='viewer'>
                                <div className="pdf-viewer-inner"></div>
                            </div>
                            {

                                // lấy ra sign khi tạo mới, nếu find thấy key, thì tự động gán lại vị trí cũ
                                this.state.listSign.map((x, i) => {
                                    if (this.findKeyIsExits(x.key) != -1) {

                                        const dataLast = this.state.signData[this.findLast(x.key)]

                                        return (<Draggable
                                            key={dataLast.index}
                                            handle=".handle"
                                            defaultPosition={{ x: dataLast.position[0], y: dataLast.position[1] }}
                                            onStop={(e, data) => { this.state.position = [data.lastX, data.lastY], this.handleData(this.state.position, x.key) }}
                                        >
                                            <div className='drag__button'>
                                                <div className="handle">
                                                    <i className="fa-solid fa-arrows-up-down-left-right"></i>
                                                </div>
                                                <div className='signZone'>
                                                    Chữ ký
                                                </div>
                                            </div>
                                        </Draggable>
                                        )
                                    }
                                    else {
                                        return (<Draggable
                                            key={uuidv4()}
                                            handle=".handle"
                                            defaultPosition={{ x: 0, y: this.state.scrollTop }}
                                            onStop={(e, data) => { this.state.position = [data.lastX, data.lastY], this.handleData(this.state.position, x.key) }}
                                        >
                                            <div className='drag__button'>
                                                <div className="handle">
                                                    <i className="fa-solid fa-arrows-up-down-left-right"></i>
                                                </div>
                                                <div className='signZone'>
                                                    Chữ ký
                                                </div>
                                            </div>
                                        </Draggable>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Viewer.propTypes = {
    onInit: PropTypes.func,
    onScaleChanged: PropTypes.func,
};

export default Viewer;