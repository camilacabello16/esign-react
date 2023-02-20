import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from "react";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import SignaturePad from 'react-signature-pad-wrapper';
import './modal.css';
import { calculateImageSize } from "./calculateCoordinatePdf";

const ModalSign = forwardRef(({ visible, onClose, handleDataImage, handleSignAll }, ref) => {
    const signatureRef = useRef();

    const [signType, setSignType] = useState(0); //0: draw || 1: upload
    const [show, setShow] = useState(false);
    const [signIndex, setSignIndex] = useState('');
    // const []

    useEffect(() => {
        console.log(signatureRef);
    }, [show])

    useImperativeHandle(ref, () => ({
        showModal: (index, dataImg) => {
            setSignIndex(index);

            setShow(true);
            if (dataImg) {
                // signatureRef.current.canvasRef.current.getContext("2d").drawImage(dataImg, 0, 0);
                console.log(signatureRef.current);
            }
        },
        closeModal: () => {
            setShow(false);
        }
    }), [show])

    const signAll = () => {
        var img = signatureRef.current.canvasRef.current.toDataURL('image/png');
        handleSignAll(img);
        setShow(false);
    }

    const sign = () => {
        // console.log(signatureRef.current);
        // console.log(signatureRef.current.canvasRef.current.getContext("2d").getImageData(0, 0, signatureRef.current.canvasRef.current.width, signatureRef.current.canvasRef.current.height));
        // handleDataImage(signatureRef.current.canvasRef.current.getContext("2d").getImageData(0, 0, signatureRef.current.canvasRef.current.width, signatureRef.current.canvasRef.current.height).data)
        var img = signatureRef.current.canvasRef.current.toDataURL('image/png');
        handleDataImage(img, signIndex);
        setShow(false);
    }

    const clearSign = () => {
        console.log(signatureRef.current);
        signatureRef.current.signaturePad.clear();
    }

    const getBase64 = (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result);
            return reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const uploadImageSign = (event) => {
        clearSign();
        signatureRef.current.penColor = 'transparent';

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            const canvas = signatureRef.current;
            const context = canvas.canvasRef.current.getContext('2d');
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, signatureRef.current.canvasRef.current.width / 2 - calculateImageSize(img.width, img.height, signatureRef.current.canvasRef.current.height) / 2, 0, calculateImageSize(img.width, img.height, signatureRef.current.canvasRef.current.height), signatureRef.current.canvasRef.current.height);
            };
            img.src = reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const drawSign = () => {
        clearSign();
        signatureRef.current.penColor = '#00008b';
    }

    return (
        <React.Fragment>
            {
                show ? (
                    <Rodal visible={true} onClose={() => onClose()} width={650} height={480} className="modal-canvas">
                        <div className="input-name">
                            <label>Tên đầy đủ</label>
                            <input />
                        </div>
                        <div className="sign-type-input">
                            <div className="button-sign-type">
                                <div>
                                    <button onClick={drawSign}>Vẽ</button>
                                    <input
                                        type={"file"}
                                        className="custom-file-input"
                                        accept=".png,.jpg"
                                        onChange={uploadImageSign}
                                    ></input>
                                </div>
                                <div>
                                    <button onClick={clearSign}>Xóa</button>
                                </div>
                            </div>
                            <div style={{ marginBottom: -5 }}>
                                <SignaturePad
                                    ref={signatureRef}
                                    width={600}
                                    height={200}
                                    options={{ minWidth: 1, maxWidth: 1, penColor: '#00008b' }}
                                />
                            </div>
                        </div>
                        <div className="form-sign-footer">
                            <button onClick={signAll}>Kí tất cả</button>
                            <button onClick={sign}>Kí</button>
                            <button>Hủy</button>
                        </div>
                    </Rodal>
                ) : <React.Fragment></React.Fragment>
            }
        </React.Fragment>
    );
})

export default ModalSign;