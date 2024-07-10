import React, { useEffect, useState,useRef } from 'react';
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "./App.css";
import { drawHand } from "./Utilities/utilities";
import ParticleBg from "./Components/ParticleBg";

import * as fp from "fingerpose";
import thumbs_up from "./thumbs_up.png";
import victory from "./victory.png";


function App() {
  const [dimensions, setDimensions] = useState(getResponsiveStyles());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveStyles());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function getResponsiveStyles() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let width = "640px";
    let height = "480px";

    if (screenWidth < 768) { // small screens
      width = "100%";
      height = `${(screenWidth / 4) * 3}px`; // maintaining 4:3 aspect ratio
    } else if (screenWidth < 1024) { // medium screens
      width = "80%";
      height = `${(screenWidth * 0.8 / 4) * 3}px`; // maintaining 4:3 aspect ratio
    } else { // large screens
      width = "640px";
      height = "480px";
    }

    return {
      border: "5px solid",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "10px",
      width: width,
      height: height,
      zIndex: 9,
    };
  }


  //set references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //load handpose model
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("handpose model loaded");
    setInterval(() => {
      detect(net);
    },100);
  };

  const detect = async (net) => {
    //check availability of data
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //obtain video properties: height and width
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // detections making:
      const hand = await net.estimateHands(video);
      console.log(hand);

      //drawing hands
      const ctx=canvasRef.current.getContext("2d");
      drawHand(hand,ctx);
    }
  };
  runHandpose();

  return (
    <>
      <div>
      <Webcam
      ref={webcamRef}
      style={dimensions}
    />
        <canvas
      ref={canvasRef}
      style={dimensions}
    />
    <ParticleBg/>
      </div>
    </>
  );
}

export default App;
