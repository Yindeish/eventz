import { Path, Svg } from "react-native-svg";

const Edit = ({ color = "#73138C" }: { color?: string }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><Path fill={color} d="M12.707 1L15 3.292a1 1 0 0 1-.002 1.416l-1.441 1.434l-3.702-3.703L11.293 1a1 1 0 0 1 1.414 0M8.44 3.854L1.5 10.793v3.652h3.706l6.932-6.893z" /></Svg>

    );
}

export default Edit;