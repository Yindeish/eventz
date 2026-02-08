import Search from "@/components/in/svgs/search";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import { view } from "@/styles/view";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const HomeLayout = () => {
    const params = useLocalSearchParams<{ q?: string }>();
    const { insets: { top } } = useSafeAreaView();
    const {currentFeed, currentTrending} = useAppSelector((s: RootState) => s.search)

    const [search, setSearch] = useState(params.q ?? "");


    const handleEventSearch = (text: string) => {
        setSearch(text);
        router.setParams({ q: text || undefined });
    };

    useEffect(() => {
        setSearch(params.q ?? "");
    }, [params.q]);



    return (
        <Stack screenOptions={{
            headerShown: false,
            headerShadowVisible: false
        }}>
            <Stack.Screen name="communities" options={{

            }} />
            <Stack.Screen name="create-event" options={{

            }} />
            <Stack.Screen name="create-post" options={{

            }} />
            <Stack.Screen name="search" options={{
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
            <Stack.Screen name="events-search" options={{
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
                                    value={search || currentFeed?.headline}
                                    onChangeText={handleEventSearch}
                                />
                            </Input>
                        </Tv>
                    </Tv>
                )
            }} />
            <Stack.Screen name="events-trending" options={{
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
                                    value={search || currentTrending?.title}
                                    onChangeText={handleEventSearch}
                                />
                            </Input>
                        </Tv>
                    </Tv>
                )
            }} />
        </Stack>
    );
}

export default HomeLayout;