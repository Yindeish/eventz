import { Urbanist_100Thin, Urbanist_200ExtraLight, Urbanist_300Light, Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold, Urbanist_800ExtraBold, Urbanist_900Black, useFonts } from "@expo-google-fonts/urbanist";

export default function useUrbanist() {
    const [fontsLoaded] = useFonts({
        Urbanist_100Thin, Urbanist_200ExtraLight, Urbanist_300Light, Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold, Urbanist_800ExtraBold, Urbanist_900Black
    });

    return {
        urbanistLoaded: fontsLoaded,
    }
}
