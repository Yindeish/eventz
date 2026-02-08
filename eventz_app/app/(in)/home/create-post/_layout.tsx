import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { router, Stack } from "expo-router";

const CreatePostLayout = () => {
    const { insets: { top } } = useSafeAreaView();


    return (
        <Stack screenOptions={{
            headerShown: false,
            headerShadowVisible: false
        }}>
            <Stack.Screen name="index" options={{
                headerShown: true,
                headerShadowVisible: false,
                header: () => (
                    <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                        <Pr onPress={() => router.back()}>
                            <BackArrow />
                        </Pr>
                        <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                            Create a Post
                        </Urbanist>
                    </Tv>
                )
            }} />
        </Stack>
    );
}

export default CreatePostLayout;