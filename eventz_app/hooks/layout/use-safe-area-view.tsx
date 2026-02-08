import { useSafeAreaInsets } from "react-native-safe-area-context";

const useSafeAreaView = () => {

    const insets = useSafeAreaInsets();

    return { insets }
}

export default useSafeAreaView;