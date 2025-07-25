import React from "react";
import { Line, Circle } from "react-native-svg";
import { rgba } from "../../styles/colors";

type Props = {
  height: number;
  color: string;
};

const STROKE_WIDTH = 2;
const FOCUS_RADIUS = 4;

export default function Bar({ height, color }: Props) {
  return (
    <>
      <Line 
        x1={0} 
        x2={0} 
        y1={0} 
        y2={height} 
        stroke={rgba(color, 0.2)} 
        strokeWidth={FOCUS_RADIUS} 
      />
      <Circle 
        cx={0} 
        cy={0} 
        r={5} 
        stroke={color} 
        strokeWidth={STROKE_WIDTH} 
        fill="white" 
      />
    </>
  );
} 