import { ReactNode } from "react";
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';


const Keyboard = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <KeyboardAwareScrollView bottomOffset={62} className={`gap-[16px] p-[16px]`}>
                {children}
            </KeyboardAwareScrollView>
            <KeyboardToolbar />
        </>
    );
}

export default Keyboard;