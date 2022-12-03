import React, { useRef } from "react";

export default function VideoCapture({ camera = "user", audio = true }) {
  const videoRef = useRef(null);
  const options = {
    audio: audio,
    video: {
      height: {
        max: 1080,
        ideal: 780,
        min: 720,
      },
      width: {
        max: 500,
        ideal: 480,
        min: 420,
      },
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
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  } else {
    alert("getUserMedia() is not supported in your browser");
  }

  //   navigator.mediaDevices.getUserMedia();

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
