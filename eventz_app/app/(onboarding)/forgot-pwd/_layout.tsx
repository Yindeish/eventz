import { Sav } from "@/components/shared/safe-area-view";
import { Tv } from "@/components/shared/view";
import { Stack } from "expo-router";

const ForgotPwdLayout = () => {
    return (
        <Sav>
            <Tv className="w-full h-full">
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="password" />
                </Stack>
            </Tv>
        </Sav>
    );
}

export default ForgotPwdLayout;