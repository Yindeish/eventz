import { Defs, Svg, LinearGradient, Path, Stop } from "react-native-svg";

const ChevronLeftCurved = () => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M14.9993 20.67C14.8093 20.67 14.6193 20.6 14.4693 20.45L7.9493 13.93C6.8893 12.87 6.8893 11.13 7.9493 10.07L14.4693 3.55002C14.7593 3.26002 15.2393 3.26002 15.5293 3.55002C15.8193 3.84002 15.8193 4.32002 15.5293 4.61002L9.0093 11.13C8.5293 11.61 8.5293 12.39 9.0093 12.87L15.5293 19.39C15.8193 19.68 15.8193 20.16 15.5293 20.45C15.3793 20.59 15.1893 20.67 14.9993 20.67Z" fill="#73138C" />
            <Defs>
                <LinearGradient id="paint0_linear_282_3978" x1="15.7468" y1="20.67" x2="4.88721" y2="19.1095" gradientUnits="userSpaceOnUse">
                    <Stop stop-color="#73138C" />
                    <Stop offset="1" stop-color="#B745D4" />
                </LinearGradient>
            </Defs>
        </Svg>

    );
}

export default ChevronLeftCurved;