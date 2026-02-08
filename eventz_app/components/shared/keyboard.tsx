import { ReactNode } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Tv } from './view';

const Kb = ({ bottomOffset = 62, className, children }: { bottomOffset?: number, className?: string, children: ReactNode }) => {
    return (
        <Tv className={`w-full h-full`}>
            <KeyboardAwareScrollView bottomOffset={bottomOffset}  className={`flex-1 min-h-full ${className}`}>
                {children}
            </KeyboardAwareScrollView>
        </Tv>
    );
}

export default Kb;