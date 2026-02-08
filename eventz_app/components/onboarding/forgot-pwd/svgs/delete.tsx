import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";

const Delete = () => {
    return (
        <Svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G clip-path="url(#clip0_2209_5660)">
                <Path d="M23.3332 7C23.6427 7 23.9394 7.12292 24.1582 7.34171C24.377 7.5605 24.4999 7.85725 24.4999 8.16667V19.8333C24.4999 20.1428 24.377 20.4395 24.1582 20.6583C23.9394 20.8771 23.6427 21 23.3332 21H10.4999L4.66657 15.1667C4.3796 14.8458 4.22095 14.4305 4.22095 14C4.22095 13.5695 4.3796 13.1542 4.66657 12.8333L10.4999 7H23.3332Z" stroke="#2C3E50" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <Path d="M18.6667 11.6667L14 16.3334M14 11.6667L18.6667 16.3334L14 11.6667Z" stroke="#2C3E50" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </G>
            <Defs>
                <ClipPath id="clip0_2209_5660">
                    <Rect width="28" height="28" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>

    );
}

export default Delete;