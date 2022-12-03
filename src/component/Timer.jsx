import React, { useEffect, useState } from 'react'

export default function Timer() {
    const [time, setTime] = useState(0);
  const [intervalID, setIntervalID] = useState(-1);

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

  if (time === 31) {
    stopRecording();
  }
  return (
    <span className="timer">{time < 10 ? "0" + time : time}</span>
  )
}
