import React, { useState, useRef, useCallback, useEffect } from "react";
import PdfViewerComponent from "./PdfViewerComponent";

const SignatureDocument = (props) => {
    const [document, setDocument] = useState("0911-2022_ycdmh-cmg-sps-phuonglinhpk_0911-2022_ycdmh-cmg-sps-phuonglinhpk (1).pdf");

    const handleOpen = () => setDocument("another-example.pdf");

    return (
        <div className="App">
            <button className="App-button" onClick={handleOpen}>
                Open another document
            </button>
            <div className="App-viewer">
                <PdfViewerComponent document={document} />
            </div>
        </div>
    );
};

export default SignatureDocument;