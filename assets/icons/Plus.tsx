import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface PlusProps {
  strokeWidth?: number;
  color?: string;
  size?: number;
  [key: string]: any;
}

const Plus: React.FC<PlusProps> = (props) => (
  <Svg  viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} color={props.color || "#000000"} fill="none" {...props}>
    <Path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinejoin="round" />
    <Path d="M12 8V16M16 12H8" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default Plus;
