

export type TFontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type TFontName = "Urbanist";

export type TFontNWeightName = "400Regular" | "500Medium" | "600SemiBold" | "700Bold" | "800ExtraBold" | "900Black";

export type TFontFamily = Record<TFontWeight, `${TFontName}_${TFontNWeightName}`>