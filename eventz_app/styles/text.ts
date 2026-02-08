import { StyleSheet, TextStyle } from "react-native";


export const text = {
    ...StyleSheet.create({
        // text sizes   
        xxs: { fontSize: 8 },
        xs: { fontSize: 10 },
        ss: { fontSize: 12 },
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
        xl: { fontSize: 20 },
        xxl: { fontSize: 22 },
        xxxl: { fontSize: 24 },
        // text sizes

        // text colors
        _black: { color: '#000000' },
        _white: { color: '#FFFFFF' },
        _gray: { color: '#808080' },
        _22aacc: { color: '#22aacc' },
        _73138C: { color: '#73138C' },
        // text colors

        // font weights
        thin: { fontWeight: '100' },
        extraLight: { fontWeight: '200' },
        light: { fontWeight: '300' },
        regular: { fontWeight: '400' },
        medium: { fontWeight: '500' },
        semiBold: { fontWeight: '600' },
        bold: { fontWeight: '700' },
        extraBold: { fontWeight: '800' },
        black: { fontWeight: '900' },
        // font weights

        // text alignments
        left: { textAlign: 'left' },
        center: { textAlign: 'center' },
        right: { textAlign: 'right' },
        justify: { textAlign: 'justify' },
        // text alignments

        // text decorations
        underline: { textDecorationLine: 'underline' },
        lineThrough: { textDecorationLine: 'line-through' },
        noDecoration: { textDecorationLine: 'none' },
        // text decorations

        // line heights
        leadingTight: { lineHeight: 14 },
        leadingSnug: { lineHeight: 18 },
        leadingNormal: { lineHeight: 22 },
        leadingRelaxed: { lineHeight: 26 },
        leadingLoose: { lineHeight: 30 },
        // line heights

        // letter spacings
        trackingTight: { letterSpacing: -0.5 },
        trackingNormal: { letterSpacing: 0 },
        trackingWide: { letterSpacing: 0.5 },
        trackingWider: { letterSpacing: 1 },
        trackingWidest: { letterSpacing: 2 },
        // letter spacings

        // text transformations
        uppercase: { textTransform: 'uppercase' },
        lowercase: { textTransform: 'lowercase' },
        capitalize: { textTransform: 'capitalize' },
        noneTransform: { textTransform: 'none' },
        // text transformations

        // miscellaneous text styles
        italic: { fontStyle: 'italic' },
        notItalic: { fontStyle: 'normal' },
        // miscellaneous text styles

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

    }),
    color: (value: string): TextStyle => ({
        color: value,
    }),
    size: (value: number): TextStyle => ({
        fontSize: value,
    }),
    weight: (value: TextStyle['fontWeight']): TextStyle => ({
        fontWeight: value,
    }),
    lineHeight: (value: number): TextStyle => ({
        lineHeight: value,
    }),
    letterSpacing: (value: number): TextStyle => ({
        letterSpacing: value,
    }),
    align: (value: TextStyle['textAlign']): TextStyle => ({
        textAlign: value,
    }),
    decorationLine: (value: TextStyle['textDecorationLine']): TextStyle => ({
        textDecorationLine: value,
    }),
    transform: (value: TextStyle['textTransform']): TextStyle => ({
        textTransform: value,
    }),
    m: (value: number) => ({ margin: value } as TextStyle),
    my: (value: number) => ({ marginTop: value, marginBottom: value } as TextStyle),
    mx: (value: number) => ({ marginLeft: value, marginRight: value } as TextStyle),
    p: (value: number) => ({ padding: value } as TextStyle),
    py: (value: number) => ({ paddingTop: value, paddingBottom: value } as TextStyle),
    px: (value: number) => ({ paddingLeft: value, paddingRight: value } as TextStyle),
}
