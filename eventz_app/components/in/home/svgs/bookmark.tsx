import { iIconProps } from "@/styles/icon";
import { Path, Svg } from "react-native-svg";

const Bookmark = ({ color = "#616161", ...props }: iIconProps) => {
    return (
        <Svg width={props?.width || "16"} height={props?.height || "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M13.1592 4.10229C13.1592 2.26837 11.9054 1.5332 10.1002 1.5332H5.86098C4.11128 1.5332 2.8 2.21825 2.8 3.97999V13.7959C2.8 14.2797 3.32063 14.5845 3.74236 14.3479L7.99699 11.9613L12.2149 14.3439C12.6373 14.5818 13.1592 14.2771 13.1592 13.7925V4.10229Z" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
            <Path opacity="0.4" d="M5.51412 6.01874H10.393" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
        </Svg>

    );
}

export default Bookmark;