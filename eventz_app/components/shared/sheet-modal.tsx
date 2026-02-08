import { view } from "@/styles/view";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export type SheetModalRef = {
    open: () => void;
    close: () => void;
};

type SheetModalProps = {
    snapPoints?: (string | number)[];
    children: React.ReactNode;
    allowSwipeDown?: boolean;
    closeOnBackdropPress?: boolean;
    onDismiss?: (() => void) | undefined;
};

export const useSheetModalRef = () => {
    const sheetModalRef = useRef<SheetModalRef>(null);
    const open = () => sheetModalRef.current?.open();
    const close = () => sheetModalRef.current?.close();

    return { ref: sheetModalRef, open, close }
}

const SheetModal = forwardRef<SheetModalRef, SheetModalProps>(({ snapPoints = ["50%"], children, allowSwipeDown, closeOnBackdropPress, onDismiss }, ref) => {
    const sheetModalRef = useRef<BottomSheetModal>(null);
    const { close } = useSheetModalRef()

    useImperativeHandle(ref, () => ({
        open: () => sheetModalRef.current?.present(),
        close: () => sheetModalRef.current?.dismiss(),
    }));

    const handleSheetModalChanges = useCallback((index: number) => {
        console.log('handleSheetModalChanges', index);
    }, []);

    return (
        <BottomSheetModal
            ref={sheetModalRef}
            snapPoints={snapPoints}
            onChange={handleSheetModalChanges}
            style={[view.wFull]}
            enablePanDownToClose={allowSwipeDown}
            onDismiss={onDismiss}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior={closeOnBackdropPress ? 'close' : 'none'}
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                />
            )}
        >
            <BottomSheetView>
                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default SheetModal;
