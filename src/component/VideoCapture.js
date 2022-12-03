import React, { useRef } from "react";

export default function VideoCapture({ camera = "user", audio = true }) {
  
  const videoRef = useRef(null);
  const options = {
    audio: audio,
    video: {
      aspectRatio: 9 / 16,
      facingMode: camera,
      frameRate: 30,
    },
  };

  function hasGetUserMedia() {
    return !!(
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
  }
  if (hasGetUserMedia()) {
    navigator.getUserMedia(
      options,
      function (localStream) {
        window.stream = localStream;
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      },
      function (err) {
        alert("getUserMedia() is not supported in your browser");
      }
    );
  } else {
    alert("getUserMedia() is not supported in your browser");
  }


  return (
    <>
      <video
        autoPlay
        ref={videoRef}
        style={{ transform: "scaleX(-1)" }}
        muted
      ></video>
    </>
  );
}
