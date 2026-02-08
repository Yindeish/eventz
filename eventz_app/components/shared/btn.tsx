import { Pressable } from "react-native";
import { ThemedTextProps, Tt } from "./text";
import { ThemedTouchableOpacityProps } from "./touchable-opacity";
import { ReactNode } from "react";

const Btn = ({ container: { onPress, className: containerClassname, ...otherContainerProps }, text: { className: textClassname, children: textChild, themed, ...otherTextProps }, leftIcon, rightIcon }: { container: ThemedTouchableOpacityProps, text: ThemedTextProps, leftIcon?: ReactNode, rightIcon?: ReactNode }) => {
    return (
        <Pressable onPress={onPress} className={`w-full h-[46px] flex-row items-center justify-center gap-[8px] bg-[#73138C] rounded-full shadow-lg shadow-[#5A189A] ${containerClassname}`} {...otherContainerProps}>
            {leftIcon && leftIcon}
            <Tt themed={themed} className={`text-[14px] text-white font-semibold ${textClassname}`} {...otherTextProps}>{textChild}</Tt>
            {rightIcon && rightIcon}
        </Pressable>
    );
}

export default Btn;