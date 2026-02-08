import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";

const VoteChecked = () => {
    return (
        <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M6.99996 1.1665C3.78579 1.1665 1.16663 3.78567 1.16663 6.99984C1.16663 10.214 3.78579 12.8332 6.99996 12.8332C10.2141 12.8332 12.8333 10.214 12.8333 6.99984C12.8333 3.78567 10.2141 1.1665 6.99996 1.1665ZM9.78829 5.65817L6.48079 8.96567C6.39913 9.04734 6.28829 9.094 6.17163 9.094C6.05496 9.094 5.94413 9.04734 5.86246 8.96567L4.21163 7.31484C4.04246 7.14567 4.04246 6.86567 4.21163 6.6965C4.38079 6.52734 4.66079 6.52734 4.82996 6.6965L6.17163 8.03817L9.16996 5.03984C9.33913 4.87067 9.61913 4.87067 9.78829 5.03984C9.95746 5.209 9.95746 5.48317 9.78829 5.65817Z" fill="url(#paint0_linear_430_8667)" />
            <Defs>
                <LinearGradient id="paint0_linear_430_8667" x1="12.8333" y1="12.8332" x2="-1.04899" y2="8.80813" gradientUnits="userSpaceOnUse">
                    <Stop stop-color="#73138C" />
                    <Stop offset="1" stop-color="#B745D4" />
                </LinearGradient>
            </Defs>
        </Svg>

    );
}

export default VoteChecked;