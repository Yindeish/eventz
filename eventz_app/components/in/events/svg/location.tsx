import { iIconProps } from "@/styles/icon";
import { Defs, Svg, LinearGradient, Path, Stop } from "react-native-svg";

const Location = (props: iIconProps) => {
    return (
        <Svg width={props?.width || "20"} height={props?.height || "24"} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.70405C0 4.33754 4.48453 0 9.90902 0C15.3488 0 19.8333 4.33754 19.8333 9.70405C19.8333 12.4083 18.8498 14.9189 17.2311 17.0468C15.4453 19.3941 13.2442 21.4392 10.7666 23.0445C10.1996 23.4155 9.68785 23.4435 9.06553 23.0445C6.57386 21.4392 4.37277 19.3941 2.60225 17.0468C0.982314 14.9189 0 12.4083 0 9.70405ZM6.64327 10.0062C6.64327 11.804 8.11027 13.2179 9.90902 13.2179C11.7089 13.2179 13.1901 11.804 13.1901 10.0062C13.1901 8.22243 11.7089 6.73964 9.90902 6.73964C8.11027 6.73964 6.64327 8.22243 6.64327 10.0062Z" fill="#73138C" />
            <Defs>
                <LinearGradient id="paint0_linear_2278_6321" x1="19.8333" y1="23.3333" x2="-4.28557" y2="17.3892" gradientUnits="userSpaceOnUse">
                    <Stop stop-color="#73138C" />
                    <Stop offset="1" stop-color="#B745D4" />
                </LinearGradient>
            </Defs>
        </Svg>

    );
}

export default Location;