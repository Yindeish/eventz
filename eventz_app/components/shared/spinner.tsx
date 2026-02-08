import SpinnerSvg from "@/components/shared/svgs/spinner";
import { Tv } from "./view";
import { ViewStyle } from "react-native";

const Spinner = ({ className, style=[], svgClassName, svgStyle = [], svgColor }: { className?: string, style?: ViewStyle | ViewStyle[], svgClassName?: string, svgStyle?: ViewStyle | ViewStyle[], svgColor?: string }) => {
    return (
        <Tv className={`w-[60px] h-[60px] animate-spin ease-linear duration-100 ${className}`} style={style}>
            <SpinnerSvg className={svgClassName} style={svgStyle} color={svgColor} />
        </Tv>
    );
}

export default Spinner;