import React, { Component } from 'react';
import { PDFJS as PDFJSViewer } from 'pdfjs-dist/web/pdf_viewer.js';
import './Viewer.css';
import 'pdfjs-dist/web/pdf_viewer.css';
import Draggable from 'react-draggable';
import './SignatureDocument.css';
import ModalSign from './ModalSign';

// Modal.setAppElement('#root');

class SignatureDocument2 extends Component {
    constructor(props) {
        super(props);
        this.initEventBus();
        this.state = {
            doc: null,
            scale: undefined,
            height: 0,
            position: [],
            scrollTop: 0,
            positionSign: [],
            visible: false,
            dataImage: []
        };
        this.myRef = React.createRef();
        this.modal = React.createRef();
        this.openModal = this.openModal.bind(this);
        // this.openModal = this.openModal.bind(this, false);
    }
    initEventBus() {
        let eventBus = new PDFJSViewer.EventBus();
        eventBus.on('pagesinit', (e) => {
            this.setState({
                scale: this._pdfViewer.currentScale * 1.5
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
        let viewerContainer = document.getElementById('viewer');
        this._pdfViewer = new PDFJSViewer.PDFViewer({
            container: viewerContainer,
            eventBus: this._eventBus,
        });

        var dataSign = JSON.parse(localStorage.getItem("pdf-coordinate-history"));
        this.setState({
            positionSign: dataSign
        })
    }

    // //zoom in - zoom out
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

    closeModal = () => {
        var that = this;
        that.setState({ visible: false });
        this.modal.current.closeModal();
    }

    openModal = (index) => {
        var dataImg = "";
        if (this.state.dataImage.find(o => o.index == index)) {
            dataImg = this.state.dataImage.find(o => o.index == index).image
        }
        this.modal.current.showModal(index, dataImg);
    }

    handleDataImage = (dataImage, index) => {
        var arr = this.state.dataImage;
        var item = arr.find(o => o.index == index);
        var object = {
            index: index,
            position: this.state.positionSign.find(o => o.index == index).position,
            image: dataImage
        }
        if (item) {
            const index = arr.indexOf(item);
            arr[index] = object;
        } else {
            arr.push(object);
        }

        this.setState({ dataImage: arr }, function () {
            console.log(this.state.dataImage);
        });

        document.getElementById("image-sign-" + index).src = dataImage;
        document.getElementById("text-sign-" + index).style.display = "none";

        if (this.state.positionSign.length === this.state.dataImage.length) {
            document.getElementById("button-send-file").style.display = "block";
        }
    }

    handleSignAll = (dataImage) => {
        var arr = [];
        for (let i = 0; i < this.state.positionSign.length; i++) {
            var object = {
                index: this.state.positionSign[i].index,
                position: this.state.positionSign[i].position,
                image: dataImage
            }
            arr.push(object);

            document.getElementById("image-sign-" + this.state.positionSign[i].index).src = dataImage;
            document.getElementById("text-sign-" + this.state.positionSign[i].index).style.display = "none";
        }
        this.setState({ dataImage: arr }, function () {
            console.log(this.state.dataImage);
        });

        if (this.state.positionSign.length === this.state.dataImage.length) {
            document.getElementById("button-send-file").style.display = "block";
        }
    }

    sendFile = () => {
        console.log(this.state.dataImage);
    }

    render() {
        return (
            <div className='App-body'>
                <div className="Viewer" onScroll={this.onScroll} ref={this.myRef}>
                    <div className="pdf-wrapper">
                        <div className="pdf-viewer" id='viewer'>
                            <div className="pdf-viewer-inner"></div>
                        </div>
                        {this.state.positionSign.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        left: item.position[0],
                                        top: item.position[1]
                                    }}
                                    // className="sign-zone"
                                    className='field-sign'
                                    onClick={() => this.openModal(item.index)}
                                >
                                    <div
                                        // className='field-sign'
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        id={'text-sign-' + item.index}
                                    >
                                        Chữ ký
                                    </div>
                                    <img id={'image-sign-' + item.index} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    style={{
                        display: "none"
                    }}
                    className='button-send-find'
                    id='button-send-file'
                >
                    <button
                        onClick={() => this.sendFile()}
                    >VALIDATE & SEND COMPLETED DOCUMENT</button>
                </div>
                <ModalSign
                    visible={this.state.visible}
                    onClose={this.closeModal}
                    ref={this.modal}
                    handleDataImage={this.handleDataImage}
                    handleSignAll={this.handleSignAll}
                />
            </div>
        );
    }
}

export default SignatureDocument2;