import { ImageStyle, StyleSheet } from "react-native";


export const img = {
    ...StyleSheet.create({
        // bg styles
        _black: { backgroundColor: '#000000' },
        _white: { backgroundColor: '#FFFFFF' },
        _gray: { backgroundColor: '#808080' },
        _transparent: { backgroundColor: 'transparent' },
        // bg styles

        // width and height styles
        wFull: { width: '100%' },
        hFull: { height: '100%' },
        minWFull: { minWidth: '100%' },
        minHFull: { minHeight: '100%' },
        wAuto: { width: 'auto' },
        hAuto: { height: 'auto' },
        // width and height styles

        // Object styles
        objectCover: { objectFit: 'cover' },
        objectContain: { objectFit: 'contain' },
        objectFill: { objectFit: 'fill' },
        objectScaleDown: { objectFit: 'scale-down' },
        objectNone: { objectFit: 'none' },
        // Object styles

        // margin styles
        m0: { margin: 0 },
        m1: { margin: 4 },
        m2: { margin: 8 },
        m3: { margin: 12 },
        m4: { margin: 16 },
        m5: { margin: 20 },
        m6: { margin: 24 },
        m7: { margin: 28 },
        m8: { margin: 32 },
        m9: { margin: 36 },
        m10: { margin: 40 },
        // margin styles

        // padding styles
        p0: { padding: 0 },
        p1: { padding: 4 },
        p2: { padding: 8 },
        p3: { padding: 12 },
        p4: { padding: 16 },
        p5: { padding: 20 },
        p6: { padding: 24 },
        p7: { padding: 28 },
        p8: { padding: 32 },
        p9: { padding: 36 },
        p10: { padding: 40 },
        // padding styles

        // border styles
        roundedSm: { borderRadius: 4 },
        roundedMd: { borderRadius: 8 },
        roundedLg: { borderRadius: 12 },
        roundedFull: { borderRadius: '100%' },
        borderWidthThin: { borderWidth: 1 },
        borderWidthThick: { borderWidth: 2 },
        borderColorBlack: { borderColor: '#000000' },
        borderColorWhite: { borderColor: '#FFFFFF' },
        borderColorGray: { borderColor: '#808080' },
        // border styles

        // position styles
        absolute: { position: 'absolute' },
        relative: { position: 'relative' },
        top0: { top: 0 },
        left0: { left: 0 },
        right0: { right: 0 },
        bottom0: { bottom: 0 },
        // position styles

        // shadow styles
        shadowSm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
        },
        shadowMd: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
        },
        shadowLg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 6,
        },
        shadowXl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 12,
        },
        shadow2Xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 16,
        },
        // shadow styles

        // Opacity
        opacity_1: { opacity: 1 },
        opacity_0_5: { opacity: 0.5 },
        opacity_0: { opacity: 0 },
        // Opacity

        // other styles
        hidden: { display: 'none' },
        // other styles
    }),
    bg: (color: string) => ({ backgroundColor: color } as ImageStyle),
    w: (width: number | `${number}%` | 'auto') => ({ width } as ImageStyle),
    h: (height: number | `${number}%` | 'auto') => ({ height } as ImageStyle),
    minW: (width: number | `${number}%` | 'auto') => ({ minWidth: width } as ImageStyle),
    minH: (height: number | `${number}%` | 'auto') => ({ minHeight: height } as ImageStyle),
    object: (value: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none') => ({ objectFit: value } as ImageStyle),
    m: (value: number) => ({ margin: value } as ImageStyle),
    my: (value: number) => ({ marginTop: value, marginBottom: value } as ImageStyle),
    mt: (value: number) => ({ marginTop: value } as ImageStyle),
    mb: (value: number) => ({ marginBottom: value } as ImageStyle),
    mx: (value: number) => ({ marginLeft: value, marginRight: value } as ImageStyle),
    ml: (value: number) => ({ marginLeft: value } as ImageStyle),
    mr: (value: number) => ({ marginRight: value } as ImageStyle),
    p: (value: number) => ({ padding: value } as ImageStyle),
    py: (value: number) => ({ paddingTop: value, paddingBottom: value } as ImageStyle),
    pt: (value: number) => ({ paddingTop: value } as ImageStyle),
    pb: (value: number) => ({ paddingBottom: value } as ImageStyle),
    px: (value: number) => ({ paddingLeft: value, paddingRight: value } as ImageStyle),
    pl: (value: number) => ({ paddingLeft: value } as ImageStyle),
    pr: (value: number) => ({ paddingRight: value } as ImageStyle),
    rounded: (value: number) => ({ borderRadius: value } as ImageStyle),
    borderWidth: (value: number) => ({ borderWidth: value } as ImageStyle),
    borderColor: (value: string) => ({ borderColor: value } as ImageStyle),
    border: (value: string) => ({ borderColor: value, borderWidth: 1 } as ImageStyle),
    top: (value: number) => ({ top: value } as ImageStyle),
    left: (value: number) => ({ left: value } as ImageStyle),
    right: (value: number) => ({ right: value } as ImageStyle),
    bottom: (value: number) => ({ bottom: value } as ImageStyle),
    zIndex: (value: number) => ({ zIndex: value } as ImageStyle),
    opacity: (value: number) => ({ opacity: value } as ImageStyle),
}
