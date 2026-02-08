import { StyleSheet, ViewStyle } from "react-native";


export const view = {
    ...StyleSheet.create({
        //    flex styles
        flex_1: { flex: 1 },
        flexRow: { flexDirection: 'row' },
        flexCol: { flexDirection: 'column' },
        flexWrap: { flexWrap: 'wrap' },
        flexGrow: { flexGrow: 1 },
        flexShrink: { flexShrink: 1 },
        itemsStart: { alignItems: 'flex-start' },
        itemsCenter: { alignItems: 'center' },
        itemsEnd: { alignItems: 'flex-end' },
        justifyStart: { justifyContent: 'flex-start' },
        justifyCenter: { justifyContent: 'center' },
        justifyEnd: { justifyContent: 'flex-end' },
        justifyBetween: { justifyContent: 'space-between' },
        justifyAround: { justifyContent: 'space-around' },
        centerContent: { justifyContent: 'center', alignItems: 'center' },

        // gaps
        gapXs: { gap: 4 },
        gapSm: { gap: 8 },
        gapMd: { gap: 12 },
        gapLg: { gap: 16 },
        gapXl: { gap: 20 },
        gap2Xl: { gap: 24 },
        // gaps
        //    flex styles

        // bg styles
        bg_black: { backgroundColor: '#000000' },
        bg_red: { backgroundColor: '#FF0000' },
        bg_green: { backgroundColor: '#008000' },
        bg_blue: { backgroundColor: '#0000FF' },
        bg_white: { backgroundColor: '#FFFFFF' },
        bg_gray: { backgroundColor: '#808080' },
        bg_22aacc: { backgroundColor: '#22aacc' },
        bg_73138C: { backgroundColor: '#73138C' },
        bg_F7F7F7: { backgroundColor: '#F7F7F7' },
        bg_transparent: { backgroundColor: 'transparent' },
        // bg styles

        // width and height styles
        wFull: { width: '100%' },
        hFull: { height: '100%' },
        minWFull: { minWidth: '100%' },
        minHFull: { minHeight: '100%' },
        wAuto: { width: 'auto' },
        hAuto: { height: 'auto' },
        // width and height styles

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
    bg: (color: string) => ({ backgroundColor: color } as ViewStyle),
    w: (width: number | `${number}%` | 'auto') => ({ width } as ViewStyle),
    h: (height: number | `${number}%` | 'auto') => ({ height } as ViewStyle),
    minW: (width: number | `${number}%` | 'auto') => ({ minWidth: width } as ViewStyle),
    maxW: (width: number | `${number}%` | 'auto') => ({ maxWidth: width } as ViewStyle),
    minH: (height: number | `${number}%` | 'auto') => ({ minHeight: height } as ViewStyle),
    maxH: (height: number | `${number}%` | 'auto') => ({ maxHeight: height } as ViewStyle),
    gap: (value: number) => ({ gap: value } as ViewStyle),
    m: (value: number) => ({ margin: value } as ViewStyle),
    my: (value: number) => ({ marginTop: value, marginBottom: value } as ViewStyle),
    mt: (value: number) => ({ marginTop: value } as ViewStyle),
    mb: (value: number) => ({ marginBottom: value } as ViewStyle),
    mx: (value: number) => ({ marginLeft: value, marginRight: value } as ViewStyle),
    ml: (value: number) => ({ marginLeft: value } as ViewStyle),
    mr: (value: number) => ({ marginRight: value } as ViewStyle),
    p: (value: number) => ({ padding: value } as ViewStyle),
    py: (value: number) => ({ paddingTop: value, paddingBottom: value } as ViewStyle),
    pt: (value: number) => ({ paddingTop: value } as ViewStyle),
    pb: (value: number) => ({ paddingBottom: value } as ViewStyle),
    px: (value: number) => ({ paddingLeft: value, paddingRight: value } as ViewStyle),
    pl: (value: number) => ({ paddingLeft: value } as ViewStyle),
    pr: (value: number) => ({ paddingRight: value } as ViewStyle),
    rounded: (value: number) => ({ borderRadius: value } as ViewStyle),
    roundedTr: (value: number) => ({ borderTopRightRadius: value } as ViewStyle),
    roundedTl: (value: number) => ({ borderTopLeftRadius: value } as ViewStyle),
    roundedBr: (value: number) => ({ borderBottomRightRadius: value } as ViewStyle),
    roundedBl: (value: number) => ({ borderBottomLeftRadius: value } as ViewStyle),
    roundedT: (value: number) => ({ borderTopLeftRadius: value, borderTopRightRadius: value } as ViewStyle),
    roundedB: (value: number) => ({ borderBottomLeftRadius: value, borderBottomRightRadius: value } as ViewStyle),
    roundedL: (value: number) => ({ borderTopLeftRadius: value, borderBottomLeftRadius: value } as ViewStyle),
    roundedR: (value: number) => ({ borderTopRightRadius: value, borderBottomRightRadius: value } as ViewStyle),
    borderWidth: (value: number) => ({ borderWidth: value } as ViewStyle),
    borderColor: (value: string) => ({ borderColor: value } as ViewStyle),
    border: (value: string) => ({ borderColor: value, borderWidth: 1 } as ViewStyle),
    borderT: (value: string) => ({ borderTopColor: value, borderTopWidth: 1 } as ViewStyle),
    borderB: (value: string) => ({ borderBottomColor: value, borderBottomWidth: 1 } as ViewStyle),
    borderR: (value: string) => ({ borderRightColor: value, borderRightWidth: 1 } as ViewStyle),
    borderL: (value: string) => ({ borderLeftColor: value, borderLeftWidth: 1 } as ViewStyle),
    borderTWidth: (value: number) => ({ borderTopWidth: value } as ViewStyle),
    borderBWidth: (value: number) => ({ borderBottomWidth: value } as ViewStyle),
    borderRWidth: (value: number) => ({ borderRightWidth: value } as ViewStyle),
    borderLWidth: (value: number) => ({ borderLeftWidth: value } as ViewStyle),
    top: (value: number) => ({ top: value } as ViewStyle),
    left: (value: number) => ({ left: value } as ViewStyle),
    right: (value: number) => ({ right: value } as ViewStyle),
    bottom: (value: number) => ({ bottom: value } as ViewStyle),
    zIndex: (value: number) => ({ zIndex: value } as ViewStyle),
    shadowX: (value: number) => ({ shadowOffset: { width: value, height: 0 } } as ViewStyle),
    shadowY: (value: number) => ({ shadowOffset: { width: 0, height: value } } as ViewStyle),
    shadowXY: (xValue: number, yValue: number) => ({ shadowOffset: { width: xValue, height: yValue } } as ViewStyle),
    shadowColor: (color: string) => ({ shadowColor: color } as ViewStyle),
    shadowOpacity: (value: number) => ({ shadowOpacity: value } as ViewStyle),
    shadowRadius: (value: number) => ({ shadowRadius: value } as ViewStyle),
    shadowElevation: (value: number) => ({ elevation: value } as ViewStyle),
    opacity: (value: number) => ({ opacity: value } as ViewStyle),
}
