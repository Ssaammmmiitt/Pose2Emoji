//dictionary for mapping of each finger
//Points for fingers:
const fingerJoints = {
    thumb:[0,1,2,3,4],
    indexFinger:[0,5,6,7,8],
    middleFinger:[0,9,10,11,12],
    ringFinger:[0,13,14,15,16],
    pinky:[0,17,18,19,20],
};


//function for drawinf hand
export const drawHand = (predictions,ctx)=>{
    //check for availability of data
    if(predictions.length>0)
        //loop through each prediction
    predictions.forEach((prediction)=> {
        //grab landmarks
        const landmarks=prediction.landmarks;
       
        //loop through each fingers
        for(let i =0;i<Object.keys(fingerJoints).length;i++){
            let finger=Object.keys(fingerJoints)[i];
            //loop through pair of joints
            for(let k=0;k<fingerJoints[finger].length-1;k++){
                //get pair of joints
                const firstJointIndex=fingerJoints[finger][k];
                const secondJointIndex=fingerJoints[finger][k+1];

                //draw Line
                ctx.beginPath();
                ctx.moveTo(
                    landmarks[firstJointIndex][0],
                    landmarks[firstJointIndex][1]
                );
                ctx.lineTo(
                    landmarks[secondJointIndex][0],
                    landmarks[secondJointIndex][1],
                )
                ctx.strokeStyle = "grey";
                ctx.lineWidth=4;
                ctx.stroke();
            }
        }

        //loop throughout each landmark to draw it
        for(let j=0;j<landmarks.length;j++)
        {
            //grab x and y points
            const x=landmarks[j][0];
            const y =landmarks[j][1];

            //start drawing
            ctx.beginPath();
            ctx.arc(x,y,5,0,3*Math.PI);

            //setting color for line
            ctx.fillStyle="teal";
            ctx.fill();
        }
    }
);
}
