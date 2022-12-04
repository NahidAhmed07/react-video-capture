/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Webcam from "react-webcam";



export default function App() {
  // const { previewStream, startRecording, stopRecording, mediaBlobUrl } =
  //   useReactMediaRecorder({ video: true });
  const [camera, setCamera] = useState("user");
  const [time, setTime] = useState(0);
  const [intervalID, setIntervalID] = useState(-1);

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // const forceUpdate = React.useCallback(() => setTime((prev) => prev + 1), []);

  const startRecording = () => {
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

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  // const _width = window.innerWidth;
  // const _height = window.innerHeight;

  const startVideoCapturing = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const stopVideoCapturing = useCallback(() => {
    if (mediaRecorderRef.state === "inactive") return;
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

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

  const handleSwap = () => {
    if (camera === "user") {
      setCamera("environment");
    } else {
      setCamera("user");
    }
  };

  if (time === 31) {
    stopVideoCapturing();
    stopRecording();
  }

  const videoConstraints = {
    width: {ideal:480},
    height: {ideal:720},
    aspectRatio:9/16,
    frameRate:{
      min:25,
      ideal:30,
    }
  };
  const audioConstraints = {
    suppressLocalAudioPlayback: false,
    noiseSuppression: true,
    echoCancellation: true,
  };

  return (
    <Wrapper>
      <div className="top-bar py-2 back-button  px-3">
        <button
          className="btn-0 border-1 border-secondary text-white"
        
        >
          
          Back
        </button>
        {recordedChunks.length > 0 && (
          <button
            onClick={handleDownload}
            className="download-btn btn btn-secondary"
          >
             Download
          </button>
        )}
      </div>

      <Webcam
        height={780}
        width={420}
        audio={true}
        mirrored={true}
        ref={webcamRef}
        videoConstraints={{
          ...videoConstraints,
          facingMode: camera,
          aspectRatio: "0.66666",
        }}
        audioConstraints={audioConstraints}
        muted={true}
        className="video_container"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          objectFit: "cover",
          objectPosition: "center",
          aspectRatio: "9/16",
        }}
      />

      {/* <VideoPreview stream={previewStream} />; */}
      <div className="controls">
        <span className="timer">{time < 10 ? "0" + time : time}</span>
        {capturing ? (
          <button
            className="stop-btn"
            onClick={() => {
              stopVideoCapturing();
              stopRecording();
            }}
          >
            Stop
          </button>
        ) : (
          <button
            className="start-btn"
            onClick={() => {
              startVideoCapturing();
              startRecording();
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
    border-color: orange;
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
    display: flex;
    justify-content: space-between;
    background-color: aqua;
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
