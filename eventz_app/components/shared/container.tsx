import { ViewProps } from "react-native";
import { Tv } from "./view";

export type ThemedContainerProps = ViewProps

const Container = ({children, className, ...otherProps}: ThemedContainerProps) => {

    return (
        <Tv className={`w-full h-full px-[24px] bg-transparent ${className}`} {...otherProps}>
            {children}
        </Tv>
    );
}
 
export default Container;