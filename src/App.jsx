// import React, { useEffect, useState, useRef } from "react";
// import Webcam from "react-webcam";
// import * as tf from "@tensorflow/tfjs";
// import * as handpose from "@tensorflow-models/handpose";
// import "./App.css";
// import { drawHand } from "./Utilities/utilities";
// import ParticleBg from "./Components/ParticleBg";

// import * as fp from "fingerpose";
// import thumbs_up from "./thumbs-up.png";
// import victory from "./victory.png";

// function App() {
//   const [emoji, setEmoji] = useState();
//   const images = { thumbs_up: thumbs_up, victory: victory };
//   const [dimensions, setDimensions] = useState(getResponsiveStyles());

//   useEffect(() => {
//     const handleResize = () => {
//       setDimensions(getResponsiveStyles());
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);


//   useEffect(() => {
//     console.log("Current emoji:", emoji);
//   }, [emoji]);
  

//   function getResponsiveStyles() {
//     const screenWidth = window.innerWidth;
//     const screenHeight = window.innerHeight;

//     let width = "640px";
//     let height = "480px";

//     if (screenWidth < 768) {
//       // small screens
//       width = "100%";
//       height = `${(screenWidth / 4) * 3}px`; // maintaining 4:3 aspect ratio
//     } else if (screenWidth < 1024) {
//       // medium screens
//       width = "80%";
//       height = `${((screenWidth * 0.8) / 4) * 3}px`; // maintaining 4:3 aspect ratio
//     } else {
//       // large screens
//       width = "640px";
//       height = "480px";
//     }

//     return {
//       border: "5px solid",
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       padding: "10px",
//       width: width,
//       height: height,
//       zIndex: 9,
//     };
//   }

//   //set references
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   //load handpose model
//   const runHandpose = async () => {
//     const net = await handpose.load();
//     console.log("handpose model loaded");
//     const intervalId = setInterval(() => {
//       detect(net);
//     }, 100);

//     return () => clearInterval(intervalId);
//   };

//   const detect = async (net) => {
//     //check availability of data
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       //obtain video properties: height and width
//       const video = webcamRef.current.video;
//       const videoWidth = video.videoWidth;
//       const videoHeight = video.videoHeight;

//       // set video height and width
//       webcamRef.current.video.width = videoWidth;
//       webcamRef.current.video.height = videoHeight;

//       //set canvas height and width
//       canvasRef.current.width = videoWidth;
//       canvasRef.current.height = videoHeight;

//       // detections making:
//       const hand = await net.estimateHands(video);
//       console.log(hand);

//       if (hand.length > 0) {
//         const GE = new fp.GestureEstimator([
//           fp.Gestures.VictoryGesture,
//           fp.Gestures.ThumbsUpGesture,
//         ]);
//         const gesture = await GE.estimate(hand[0].landmarks, 8);
//          console.log(gesture);
//         if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
//           const confidence = gesture.gestures.map(
//             (prediction) => prediction.confidence
//           );
//           const maxConfidence = confidence.indexOf(
//             Math.max.apply(null, confidence)
//           );
//           if (
//             gesture.gestures[maxConfidence] &&
//             gesture.gestures[maxConfidence].score>8
//           ) {
//             setEmoji(gesture.gestures[maxConfidence].name);
//             console.log(gesture.gestures[maxConfidence].name);
            
//           }
          
//         }
//       }
//       //drawing hands
//       const ctx = canvasRef.current.getContext("2d");
//       drawHand(hand, ctx);
//     }
//   };
//   useEffect(()=>{runHandpose()},[]);

//   return (
//     <>
//       <div>
//         <Webcam ref={webcamRef} style={dimensions} />
//         <canvas ref={canvasRef} style={dimensions} />4
//         {emoji!==null ? <img src={images[emoji]} style={
//           getResponsiveStyles(),
//           height="100px",
//           width="100px",
//         }/> : ""}
//         <ParticleBg />
//       </div>
//     </>
//   );
// }

// export default App;


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
  const images = { thumbs_up, victory };
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
    const screenHeight = window.innerHeight;

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
        const gesture = await GE.estimate(hand[0].landmarks, 8);
        console.log(gesture);

        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(Math.max(...confidence));

          if (
            gesture.gestures[maxConfidence] &&
            gesture.gestures[maxConfidence].score > 8
          ) {
            setEmoji(gesture.gestures[maxConfidence].name);
            console.log(gesture.gestures[maxConfidence].name);
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
        {emoji && (
          <img
            src={images[emoji]}
            alt={emoji}
            style={{ ...getResponsiveStyles(), height: "100px", width: "100px" }}
          />
        )}
        <ParticleBg />
      </div>
    </>
  );
}

export default App;