import { Sav } from "@/components/shared/safe-area-view";
import { Tv } from "@/components/shared/view";
import { Stack } from "expo-router";

const SetupLayout = () => {
    return (
        <Sav>
            <Tv className="w-full h-full">
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="interest" />
                    <Stack.Screen name="face" />
                    <Stack.Screen name="location" />
                </Stack>
            </Tv>
        </Sav>
    );
}

export default SetupLayout;