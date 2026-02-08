import { Pr } from "@/components/shared/pressable";
import { Sav } from "@/components/shared/safe-area-view";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import { router, Stack } from "expo-router";

const SigninLayout = () => {
    return (
        <Tv className="w-full h-full">
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{
                    headerShown: true,
                    header: () => (
                        <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                            {router.canGoBack() && (<Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>)}
                        </Tv>
                    )
                }} />
                <Stack.Screen name="password"
                    options={{
                        headerShown: true,
                        header: () => (
                            <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                                {router.canGoBack() && (<Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>)}
                            </Tv>
                        )
                    }}
                />
            </Stack>
        </Tv>
    );
}

export default SigninLayout;