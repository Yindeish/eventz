import { Path, Svg } from "react-native-svg";

const RememberChecked = () => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z" fill="#73138C" />
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M18.0607 7.93934C18.6464 8.52513 18.6464 9.47487 18.0607 10.0607L12.0607 16.0607C11.4749 16.6464 10.5251 16.6464 9.93934 16.0607L6.93934 13.0607C6.35355 12.4749 6.35355 11.5251 6.93934 10.9393C7.52513 10.3536 8.47487 10.3536 9.06066 10.9393L11 12.8787L15.9393 7.93934C16.5251 7.35355 17.4749 7.35355 18.0607 7.93934Z" fill="white" />
        </Svg>

    );
}

export default RememberChecked;