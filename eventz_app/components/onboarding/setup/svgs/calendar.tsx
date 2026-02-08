import { Path, Svg } from "react-native-svg";

const Calendar = ({color = "#9E9E9E"}:{color?: string}) => {
    return (
        <Svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M0.75 9.68793C0.75 3.89126 2.6825 1.95959 8.47833 1.95959C14.275 1.95959 16.2075 3.89126 16.2075 9.68793C16.2075 15.4846 14.275 17.4163 8.47833 17.4163C2.6825 17.4163 0.75 15.4846 0.75 9.68793Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M0.9795 6.81156H15.9862" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M12.1489 10.0924H12.1564" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M8.48275 10.0924H8.49025" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M4.80967 10.0924H4.81717" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M12.1489 13.3024H12.1564" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M8.48275 13.3024H8.49025" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M4.80967 13.3024H4.81717" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M11.8193 0.75V3.46833" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <Path d="M5.14575 0.75V3.46833" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </Svg>

    );
}

export default Calendar;