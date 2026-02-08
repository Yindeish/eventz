import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import { Sav } from "@/components/shared/safe-area-view";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import useAuth from "@/hooks/auth/useAuth";
import { view } from "@/styles/view";
import { router, Stack } from "expo-router";

const OnboardingLayout = () => {
    const { visitedBefore } = useAuth();

    return (
        <Sav>
            <Tv className="w-full h-full">
                <Stack screenOptions={{ headerShown: false, headerShadowVisible: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Protected guard={!visitedBefore}>
                        <Stack.Screen name="walk-through" />
                        <Stack.Screen name="welcome" />
                    </Stack.Protected>
                    <Stack.Screen name="signin" />
                    {/* <Stack.Screen name="(signin)" /> */}
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="forgot-pwd" />
                    <Stack.Screen name="setup" />
                    <Stack.Screen name="profile" options={{
                        headerShown: true,
                        header: () => (
                            <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                                <Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>

                                <Urbanist className="flex-1">Fill Your Profile</Urbanist>
                            </Tv>
                        )
                    }} />
                    <Stack.Screen name="business-info" options={{
                        headerShown: true,
                        header: () => (
                            <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                                <Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>

                                <Urbanist className="flex-1">Fill Your Business Info</Urbanist>
                            </Tv>
                        )
                    }} />
                    <Stack.Screen name="interest" options={{
                        headerShown: true,
                        header: () => (
                            <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                                <Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>

                                <Urbanist className="flex-1">Add Your Interest</Urbanist>
                            </Tv>
                        )
                    }} />
                </Stack>
            </Tv>
        </Sav>
    );
}

export default OnboardingLayout;