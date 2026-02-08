import { Defs, Svg, LinearGradient, Path, Stop } from "react-native-svg";

const BookmarkFilled = ({ color = "#73138C" }: { color?: string }) => {
    return (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M6.675 1.5H11.3025C13.335 1.5 14.9775 2.3025 15 4.3425V15.7275C15 15.855 14.97 15.9825 14.91 16.095C14.8125 16.275 14.6475 16.41 14.445 16.47C14.25 16.53 14.0325 16.5 13.8525 16.395L8.9925 13.965L4.125 16.395C4.01325 16.4542 3.885 16.4925 3.7575 16.4925C3.3375 16.4925 3 16.1475 3 15.7275V4.3425C3 2.3025 4.65 1.5 6.675 1.5ZM6.165 7.215H11.8125C12.135 7.215 12.3975 6.95175 12.3975 6.6225C12.3975 6.2925 12.135 6.03 11.8125 6.03H6.165C5.8425 6.03 5.58 6.2925 5.58 6.6225C5.58 6.95175 5.8425 7.215 6.165 7.215Z" fill={color} />
            <Defs>
                <LinearGradient id="paint0_linear_295_9468" x1="15" y1="16.5006" x2="0.31095" y2="13.0935" gradientUnits="userSpaceOnUse">
                    <Stop stop-color="#73138C" />
                    <Stop offset="1" stop-color="#B745D4" />
                </LinearGradient>
            </Defs>
        </Svg>

    );
}

export default BookmarkFilled;