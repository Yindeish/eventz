import { Pr } from "@/components/shared/pressable";
import { Sav } from "@/components/shared/safe-area-view";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import { view } from "@/styles/view";
import { router, Stack } from "expo-router";

const SignupLayout = () => {
    return (
        <Tv className="w-full h-full bg-white" style={[view.bg('white')]}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index"
                    options={{
                        headerShown: true,
                        header: () => (
                            <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                                <Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>
                            </Tv>
                        )
                    }}
                />
                <Stack.Screen name="password"
                    options={{
                        headerShown: true,
                        header: () => (
                            <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                                <Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>
                            </Tv>
                        )
                    }}
                />
            </Stack>
        </Tv>
    );
}

export default SignupLayout;