import { useRef, useState } from "react";
import { findNodeHandle, View } from "react-native";

const usePopupMenu = () => {
    const anchorRef = useRef<View>(null);

    const [anchorLayout, setAnchorLayout] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const hideMenu = () => setMenuVisible(false);

    const showMenu = () => setMenuVisible(true);

    const openMenu = () => {
        if (!anchorRef.current) return;

        const handle = findNodeHandle(anchorRef.current);
        anchorRef.current.measure((x, y, width, height, pageX, pageY) => {
            setAnchorLayout({ x: pageX, y: pageY, width, height });
            showMenu();
        });
    };

    return {
        anchorRef, anchorLayout, menuVisible,
        showMenu, hideMenu, setAnchorLayout, openMenu,
    }
}

export default usePopupMenu;