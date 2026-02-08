import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tv } from "./view";

export type SheetRef = {
    open: () => void;
    close: () => void;
};

type SheetProps = {
    snapPoints?: (string | number)[];
    children: React.ReactNode;
};

export const useSheetRef = () => {
    const sheetRef = useRef<SheetRef>(null);
    const open = () => sheetRef.current?.open();
    const close = () => sheetRef.current?.close();

    return { ref: sheetRef, open, close }
}

const Sheet = forwardRef<SheetRef, SheetProps>(({ snapPoints = ["50%"], children }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
        open: () => sheetRef.current?.present(),
        close: () => sheetRef.current?.dismiss(),
    }));

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={sheetRef}
                    snapPoints={snapPoints}
                    backgroundStyle={[]}
                >
                    <Tv className={`w-full h-[700px] bg-red-700`}>{children}</Tv>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
});

export default Sheet;
