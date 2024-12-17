import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface ArrowLeftProps {
  strokeWidth?: number;
  color?: string;
  size?: number;
  [key: string]: any;
}

const ArrowLeft: React.FC<ArrowLeftProps> = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 24}
    height={props.size || 24}
    color={props.color || "#000000"}
    fill="none"
    {...props}
  >
    <Path
      d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowLeft;
