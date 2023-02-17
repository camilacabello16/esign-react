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

    openModal = () => {
        var that = this;
        // that.setState({ visible: true });
        that.setState({ visible: true }, function () {
            console.log(this.state.visible);
        });
        this.modal.current.showModal();
    }

    handleDataImage = (dataImage) => {
        var arr = [];
        arr.push(dataImage);
        console.log(dataImage);
        this.setState({ dataImage: arr }, function () {
            console.log(this.state.dataImage);
        });

        document.getElementById("image-sign").src = dataImage;
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
                                // <Draggable
                                //     id='image-sign'
                                //     key={index}
                                //     handle=".handle"
                                //     defaultPosition={{ x: item.position[0], y: item.position[1] }}
                                //     onDrag={(e) => e.preventDefault()}
                                // >
                                //     <button
                                //         className='field-sign'
                                //         onClick={() => this.openModal()}
                                //         style={{
                                //             cursor: 'pointer'
                                //         }}
                                //     >
                                //         <div>
                                //             Chữ ký
                                //         </div>
                                //     </button>
                                // </Draggable>
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        left: item.position[0],
                                        top: item.position[1]
                                    }}
                                    // className="sign-zone"
                                    className='field-sign'
                                >
                                    <div
                                        // className='field-sign'
                                        onClick={() => this.openModal()}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Chữ ký
                                    </div>
                                    <img id='image-sign' />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <ModalSign
                    visible={this.state.visible}
                    onClose={this.closeModal}
                    ref={this.modal}
                    handleDataImage={this.handleDataImage}
                />
            </div>
        );
    }
}

export default SignatureDocument2;