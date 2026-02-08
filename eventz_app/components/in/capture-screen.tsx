import { view } from "@/styles/view";
import { ViewProps } from "react-native";
import ViewShot from "react-native-view-shot";

const CaptureScreen = ({ children, ref, style, ...rest }: ViewProps & { ref: React.Ref<ViewShot> | undefined }) => {

    return (
        <ViewShot ref={ref} style={[view.wFull, style]} {...rest}>
            {children}
        </ViewShot>
    );
}

export default CaptureScreen;