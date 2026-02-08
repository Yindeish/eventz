import React from "react";
import { TextProps } from "react-native";
import { TFontFamily, TFontWeight } from ".";
import { Tt } from "../text";

type UrbanistProps = TextProps & {
    weight?: TFontWeight;
    children: React.ReactNode;
    themed?: boolean
};

const Urbanist = ({ weight = "400", children, className, style, themed = false, ...rest }: UrbanistProps) => {
    const fontFamilies: TFontFamily = {
        "100": "Urbanist_400Regular",
        "200": "Urbanist_400Regular",
        "300": "Urbanist_400Regular",
        "400": "Urbanist_400Regular",
        "500": "Urbanist_500Medium",
        "600": "Urbanist_600SemiBold",
        "700": "Urbanist_700Bold",
        "800": "Urbanist_800ExtraBold",
        "900": "Urbanist_900Black",
    };
    const fontFamily = fontFamilies[weight];

    return (
        <Tt
            // className="text-[16px] text-black" 
            // style={[{ fontFamily }, style]}
            themed={themed}
            style={[{ fontFamily }, style]}
            className={`${className}`}
            {...rest}>
            {children}
        </Tt>
    );
};

export default Urbanist;
