import { Defs, Svg, LinearGradient, Path, Stop } from "react-native-svg";

const ChevronRightCurved = () => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M9.0007 20.67C9.1907 20.67 9.3807 20.6 9.5307 20.45L16.0507 13.93C17.1107 12.87 17.1107 11.13 16.0507 10.07L9.5307 3.55002C9.2407 3.26002 8.7607 3.26002 8.4707 3.55002C8.1807 3.84002 8.1807 4.32002 8.4707 4.61002L14.9907 11.13C15.4707 11.61 15.4707 12.39 14.9907 12.87L8.4707 19.39C8.1807 19.68 8.1807 20.16 8.4707 20.45C8.6207 20.59 8.8107 20.67 9.0007 20.67Z" fill="#73138C" />
            <Defs>
                <LinearGradient id="paint0_linear_282_3982" x1="8.2532" y1="20.67" x2="19.1128" y2="19.1095" gradientUnits="userSpaceOnUse">
                    <Stop stop-color="#73138C" />
                    <Stop offset="1" stop-color="#B745D4" />
                </LinearGradient>
            </Defs>
        </Svg>

    );
}

export default ChevronRightCurved;