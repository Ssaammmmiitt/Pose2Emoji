import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "./App.css";
import { drawHand } from "./Utilities/utilities";
import ParticleBg from "./Components/ParticleBg";
import * as fp from "fingerpose";
import thumbs_up from "./thumbs-up.png";
import victory from "./victory.png";

function App() {
  const [emoji, setEmoji] = useState(null);
  const images = { thumbs_up: thumbs_up, victory: victory};
  const [dimensions, setDimensions] = useState(getResponsiveStyles());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveStyles());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("Current emoji:", emoji);
  }, [emoji]);

  function getResponsiveStyles() {
    const screenWidth = window.innerWidth;
    // Remove the declaration of 'screenHeight' since it is not used

    let width = "640px";
    let height = "480px";

    if (screenWidth < 768) {
      // small screens
      width = "100%";
      height = `${(screenWidth / 4) * 3}px`; // maintaining 4:3 aspect ratio
    } else if (screenWidth < 1024) {
      // medium screens
      width = "80%";
      height = `${((screenWidth * 0.8) / 4) * 3}px`; // maintaining 4:3 aspect ratio
    } else {
      // large screens
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
      width,
      height,
      zIndex: 9,
    };
  }

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded");

    const intervalId = setInterval(() => {
      detect(net);
    }, 100);

    // Return the cleanup function
    return () => clearInterval(intervalId);
  };


  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);
      console.log(hand);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);
        const gesture = GE.estimate(hand[0].landmarks, 8);
        await gesture;
        console.log(gesture);

        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(Math.max(...confidence));
          console.log("Confidence score:", gesture.gestures[0].score);
          if (gesture.gestures[0].score>8) {
            console.log("Detected gesture:", gesture.gestures[0].name);
            console.log("Confidence score:", gesture.gestures[0].score);
      
              setEmoji(gesture.gestures[0].name);
          }
             else {
            console.log("No valid gesture detected");
            setEmoji(null);
          }
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <>
      <div>
        <Webcam ref={webcamRef} style={dimensions} />
        <canvas ref={canvasRef} style={dimensions} />
        {emoji!==null ? (
          <img
            src={images[emoji]}
            alt={emoji}
            style={{
              ...getResponsiveStyles(),
              height: "100px",
              width: "100px",
              right: "50px",  // Align to the right edge of the screen
              left: "auto",  // Reset left positioning
              transform: "translateY(-50%)",  // Adjust vertical centering if necessary
            }}
          />
        ):(<></>)}
        <ParticleBg />
      </div>
    </>
  );
}

export default App;