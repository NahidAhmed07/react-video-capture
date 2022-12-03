/* eslint-disable react-hooks/exhaustive-deps */
import React, {  useEffect, useState } from "react";
import styled from "styled-components";
import VideoCapture from "./component/VideoCapture";

// import Webcam from "react-webcam";

export default function App() {
  // const [chunk, setChunk] = useState([]);
  const [camera, setCamera] = useState("user");
  const [time, setTime] = useState(0);
  const [intervalID, setIntervalID] = useState(-1);

  // const webcamRef = useRef(null);
  // const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  // const options = {
  //   audioBitsPerSecond: 128000,
  //   videoBitsPerSecond: 2500000,
  //   mimeType: "video/webm",
  // };
  // const forceUpdate = React.useCallback(() => setTime((prev) => prev + 1), []);

  // const Recorder = new MediaRecorder(stream, options)


  // Recorder.ondataavailable = (e) =>{
  //   console.log(e.data);
  //   setChunk(prev => [...prev, e.data])

  // }

  const startRecording = () => {
    setCapturing(true);
    setRecordedChunks([])
    const inter = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    setIntervalID(inter);
  };

  const stopRecording = () => {
    clearInterval(intervalID);
    setIntervalID(-1);
    setTime(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  // const _width = window.innerWidth;
  // const _height = window.innerHeight;

  const handleSwap = () => {
    if (camera === "user") {
      setCamera("environment");
    } else {
      setCamera("user");
    }
  };

  if (time === 31) {
    stopRecording();
  }

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
        <button className="btn-0 border-1 border-secondary text-white">
          Back
        </button>
        {recordedChunks.length > 0 && (
          <button className="download-btn btn btn-secondary">Download</button>
        )}
      </div>

     <VideoCapture/>
      <div className="controls">
        <span className="timer">{time < 10 ? "0" + time : time}</span>
        {capturing ? (
          <button
            className="stop-btn"
            onClick={() => {
              stopRecording();
              // Recorder.stop()
            }}
          >
            Stop
          </button>
        ) : (
          <button
            className="start-btn"
            onClick={() => {
              startRecording();
              // Recorder.start()
            }}
          >
            Start
          </button>
        )}

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
    height: 100vh;
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
