import React, { ReactNode, } from "react";
import {
    View,
    Pressable,
    StyleSheet,
    LayoutRectangle,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    ViewStyle,
} from "react-native";
import { Tv } from "./view";

export type DropMenuItem = {
    label: string;
    onPress: () => void;
};

interface DropMenuProps {
    visible: boolean;
    anchorLayout: LayoutRectangle | null;
    onClose: () => void;
    children: ReactNode
}

export const DropMenu = ({ visible, anchorLayout, onClose, children, containerStyle, containerClassName }: DropMenuProps & { containerStyle?: ViewStyle | ViewStyle[], containerClassName?: string }) => {
    if (!visible || !anchorLayout) return null;

    const screenWidth = Dimensions.get("window").width;

    const left = Math.min(anchorLayout.x, screenWidth - 180);

    return (
        <Modal transparent animationType="none" visible={visible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <Tv className={`bg-transparent flex-1`}>
                    <Tv
                        className={`absolute w-[180px] bg-white rounded-[12px] py-[8px] ${containerClassName}`}
                        style={[
                            {
                                top: anchorLayout.y + anchorLayout.height,
                                shadowColor: "#000",
                                shadowOpacity: 0.12,
                                shadowRadius: 12,
                                elevation: 6,
                            },
                            containerStyle
                        ]}
                    >
                        {children}
                    </Tv>
                </Tv>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
