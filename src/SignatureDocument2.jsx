import React, { Component } from 'react';
import { PDFJS as PDFJSViewer } from 'pdfjs-dist/web/pdf_viewer.js';
import './Viewer.css';
import 'pdfjs-dist/web/pdf_viewer.css';
import Draggable from 'react-draggable';
import './SignatureDocument.css';
import './modal.css';
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
            visible: false
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
                                <Draggable
                                    key={index}
                                    handle=".handle"
                                    defaultPosition={{ x: item.position[0], y: item.position[1] }}
                                    onDrag={(e) => e.preventDefault()}
                                >
                                    <button
                                        className='field-sign'
                                        onClick={() => this.openModal()}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div>
                                            Chữ ký
                                        </div>
                                    </button>
                                </Draggable>
                            );
                        })}
                    </div>
                </div>
                {/* <Modal
                    isOpen={this.state.isOpen}
                    onRequestClose={() => this.closeModal()}
                    contentLabel="Nhập chữ ký của bạn"
                >
                    <h2>Hello</h2>
                    <button onClick={() => this.closeModal()}>close</button>
                </Modal> */}
                {/* <div
                    className="modal-sign"
                    style={this.state.visible == true ? { display: 'block' } : { display: 'none' }}
                >
                    <div className="modal-sign-head">
                        <h3>Nhập chữ ký của bạn</h3>
                    </div>
                    <div className="modal-sign-body">
                        <div>
                            <label>Tên</label>
                            <input />
                        </div>
                        <div>
                            <SignaturePad options={{ minWidth: 1, maxWidth: 1, penColor: 'rgb(66, 133, 244)' }} />
                        </div>
                    </div>
                    <div className="modal-sign-footer"></div>
                </div> */}
                {/* <Rodal visible={this.state.visible} onClose={this.closeModal.bind(this)}>
                    <div>abc</div>
                </Rodal> */}
                <ModalSign
                    visible={this.state.visible}
                    onClose={this.closeModal}
                    ref={this.modal}
                />
            </div>
        );
    }
}

export default SignatureDocument2;