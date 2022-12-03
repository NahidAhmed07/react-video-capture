import React, { useRef } from "react";

export default function VideoCapture({ camera = "user", audio = true }) {
  
  const videoRef = useRef(null);
  const options = {
    audio: audio,
    video: {
      aspectRatio:{ exact: 0.5625 },
      facingMode: camera,
      frameRate: 30,
    },
  };

  async function  hasGetUserMedia() {
    
    // const sg = await navigator.mediaDevices.enumerateDevices()
    // console.log(JSON.stringify(sg))
    // const mst =  MediaStreamTrack();
    // console.log(mst)
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
        // console.log(localStream.getVideoTracks())
        // alert(JSON.stringify(localStream.getVideoTracks()[0]))
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
