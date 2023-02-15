import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from "react";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import SignaturePad from 'react-signature-pad-wrapper';
import './modal.css';

const ModalSign = forwardRef(({ visible, onClose }, ref) => {
    const signatureRef = useRef();

    const [signType, setSignType] = useState(0); //0: draw || 1: upload
    const [show, setShow] = useState(false);

    useImperativeHandle(ref, () => ({
        showModal: () => {
            setShow(true);
        },
        closeModal: () => {
            setShow(false);
        }
    }), [show])

    const signAll = () => {
        console.log(signatureRef.current);
    }

    const clearSign = () => {
        console.log(signatureRef.current);
        signatureRef.current.signaturePad.clear();
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
                                    <button>Vẽ</button>
                                    <input type={"file"} className="custom-file-input" accept=".png,.jpg"></input>
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
                                    options={{ minWidth: 1, maxWidth: 1, penColor: 'rgb(66, 133, 244)' }}
                                />
                            </div>
                        </div>
                        <div className="form-sign-footer">
                            <button onClick={signAll}>Kí tất cả</button>
                            <button>Kí</button>
                            <button>Hủy</button>
                        </div>
                    </Rodal>
                ) : <React.Fragment></React.Fragment>
            }
        </React.Fragment>
    );
})

export default ModalSign;