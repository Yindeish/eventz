import { Pr } from "@/components/shared/pressable";
import Search from "@/components/in/svgs/search";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import { router, Stack } from "expo-router";
import { Input, InputField } from "@/components/ui/input";
import { useState } from "react";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { view } from "@/styles/view";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Sav } from "@/components/shared/safe-area-view";

const ProfileLayout = () => {
    const [search, setSearch] = useState("");
    const { insets: { top } } = useSafeAreaView();

    const handleEventSearch = (text: string) => {
        setSearch(text);
        // router.setParams({ q: text || undefined });
    };

    return (
        <Sav>
            <Tv className="w-full h-full">
                <Stack>
                    <Stack.Screen name="events" options={{
                        headerShown: true,
                        headerShadowVisible: false,
                        header: () => (
                            <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                                <Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>
                                <Tv className={`flex-1 h-[50px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px]`}>
                                    <Search />
                                    <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}>
                                        <InputField
                                            className="border-none outline-none focus:border-none focus:outline-none px-[0px]"
                                            placeholder="Search Eventz..."
                                            value={search}
                                            onChangeText={handleEventSearch}
                                        />
                                    </Input>
                                </Tv>
                            </Tv>
                        )
                    }} />
                    <Stack.Screen name="profile" options={{
                        headerShown: true,
                        header: () => (
                            <Tv className="w-full h-[60px] flex-row items-center gap-[12px] bg-white px-[24px]">
                                <Pr onPress={() => router.back()}>
                                    <BackArrow />
                                </Pr>

                                <Urbanist className="flex-1">Profile</Urbanist>
                            </Tv>
                        )
                    }} />
                </Stack>
            </Tv>
        </Sav>
    );
}

export default ProfileLayout;