"use client";
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
// import Link from "next/link";
export default function QrReader({onSuccess, onData}) {
    const scanner = useRef();
    const videoEl = useRef(null);
    const qrBoxEl = useRef(null);
    const [qrOn, setQrOn] = useState(true);
    const [scannedResult, setScannedResult] = useState("");
    const onScanSuccess = (result) => {
      setScannedResult(result?.data);
      onData(false);
      onSuccess(result?.data);
    };
    const onScanFail = (err) => {
     // console.log(err);
    };
    useEffect(() => {
      
      if (videoEl?.current && !scanner.current) {
        scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
          onDecodeError: onScanFail,
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl?.current || undefined,
        });
        scanner?.current?.start().then(() => setQrOn(true)).catch((err) => {if (err) setQrOn(false);});
      }
      return () => {if (!videoEl?.current) {scanner?.current?.stop();}};
    }, [scannedResult]);
   
  
    useEffect(() => {
      if (!qrOn) alert("Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.");
    }, [qrOn]);

 
    return (
      <div className="qr-reader">
        <video ref={videoEl}></video>
        {/* <Link className="close-qr-reader" href='/dashboard'>X</Link> */}
        <section ref={qrBoxEl}>
          <img src="../assets/images/qr-frame.png" alt="Qr Frame" height={375} width={375}  className="qr-frame" /> 
        </section>
      </div>
    );
  };
  
 