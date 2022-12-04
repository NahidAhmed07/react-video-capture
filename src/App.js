/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import Timer from "./component/Timer";
import VideoCapture from "./component/VideoCapture";

// import Webcam from "react-webcam";

export default function App() {
  const [camera, setCamera] = useState("user");
  const mediaRecorder = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const options = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: "video/webm",
  };

window.screen.orientation.lock("portrait")
const sct = window.screen.orientation.type
console.log(sct)
  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const handleStartCapturing = useCallback(() => {
    try {
      mediaRecorder.current = new MediaRecorder(window.stream, options);
    } catch (err) {
      alert("Exception while creating MediaRecorder");
      console.log(err);
      return;
    }
    mediaRecorder.current.addEventListener("error", function (err) {
      alert("get error");
      console.log(err);
    });

    mediaRecorder.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorder.current.start();
    console.log("media recorder started ");
  }, [mediaRecorder, handleDataAvailable]);

  console.log(mediaRecorder);
  function handleStopCapturing() {
    console.log(mediaRecorder);
    mediaRecorder.current.stop();
    handleDownload();
  }

  // const _width = window.innerWidth;
  // const _height = window.innerHeight;

  const handleSwap = () => {
    if (camera === "user") {
      setCamera("environment");
    } else {
      setCamera("user");
    }
  };

  // const videoConstraints = {
  //   width: 420,
  //   height: 720,
  // };
  // const audioConstraints = {
  //   suppressLocalAudioPlayback: false,
  //   noiseSuppression: true,
  //   echoCancellation: true,
  // };

  return (
    <Wrapper>
      <div className="top-bar py-2 back-button d-flex justify-content-between px-3">
        <p>change 7 portrait</p>
        <button className="btn-0 border-1 border-secondary text-white">
          Back
        </button>
        {recordedChunks.length > 0 && (
          <button
            className="download-btn btn btn-secondary"
            onClick={handleDownload}
          >
            Download
          </button>
        )}

     
         <h5> screen mode: {sct}</h5>
        
      </div>

      <VideoCapture />
      <div className="controls">
        <Timer />

        <button
          className="stop-btn"
          onClick={() => {
            handleStopCapturing();
          }}
        >
          Stop
        </button>
        <button
          className="stop-btn"
          onClick={() => {
            const spc = navigator.mediaDevices.getSupportedConstraints();
            const ale  = JSON.stringify(spc)
            navigator.clipboard.writeText(ale);

          }}
        >
          copy
        </button>

        <button
          className="start-btn"
          onClick={() => {
            handleStartCapturing();
          }}
        >
          Start
        </button>

        <button className="toggleCamera" onClick={handleSwap}>
          Flip
        </button>
      </div>
      {/* <video src={mediaBlobUrl} width="200px" height="200px" controls></video> */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow: hidden !important;
  position: fixed;
  inset: 0;
  min-height: 100vh;
  max-height: 100vh;
  min-width: 100vw;
  max-width: 100vw;
  background-color: var(--bg-secondary);
  z-index: 12000;

  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    color: white;
    background-color: var(--Body-dark);
  }

  .video_container {
    position: absolute;
    inset: 0;
    height: 80vh;
    widows: 100vw;
  }

  .start-btn,
  .stop-btn {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: var(--bg-secondary);
    border-color: var(--text-success);
    border-width: 3px;
    border-style: solid;
    font-size: 1rem;
  }

  .toggleCamera {
    font-size: 25px;
    border: none;
    background-color: transparent;
    color: white;
  }

  .back-button {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1200;
  }

  .timer {
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 2px;
  }

  .top-bar {
    background-color: var(--Body-dark);
  }
`;
