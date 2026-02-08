import BackBtn from "@/components/in/events/svg/back-btn";
import Bookmark from "@/components/in/home/svgs/bookmark";
import Send from "@/components/in/home/svgs/send";
import Search from "@/components/in/svgs/search";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { router, Stack } from "expo-router";

const Eventslayout = () => {
    const { insets: { top } } = useSafeAreaView()

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="event"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    header: () => (
                        <Tv className="w-full h-[48px] bg-transparent flex-row items-center gap-[20px] px-[24px] absolute left-0 z-10" style={[{ top: 0, position: 'fixed', paddingTop: 53 }]}>
                            <Pr onPress={() => router.back()} className="flex-1 bg-transparent">
                                <BackBtn />
                            </Pr>

                            <Pr>
                                <Bookmark color="white" width={28} height={28} />
                            </Pr>
                            <Pr>
                                <Send color="white" width={28} height={28} />
                            </Pr>
                        </Tv>
                    )
                }}
            />

            <Stack.Screen name="going"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    header: () => (
                        <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                            <Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>
                            <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                                2,000+ Going
                            </Urbanist>
                            <Search />
                        </Tv>
                    )
                }}
            />
            <Stack.Screen name="gallery"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    header: () => (
                        <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                            <Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>
                            <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                                Gallery (Pre-Event)
                            </Urbanist>
                        </Tv>
                    )
                }}
            />
            <Stack.Screen name="organizer"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    header: () => (
                        <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                            <Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>
                            <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                                Organizer
                            </Urbanist>
                        </Tv>
                    )
                }}
            />
            <Stack.Screen name="followers"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    header: () => (
                        <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                            <Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>
                            <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                                Followers
                            </Urbanist>
                            <Search />
                        </Tv>
                    )
                }}
            />
            <Stack.Screen name="following"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    header: () => (
                        <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                            <Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>
                            <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                                Following
                            </Urbanist>
                            <Search />
                        </Tv>
                    )
                }}
            />
            <Stack.Screen name="search"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    header: () => (
                        <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                            <Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>
                            <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                                Search
                            </Urbanist>
                            <Search />
                        </Tv>
                    )
                }}
            />
            <Stack.Screen name="events"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    header: () => (
                        <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                            <Pr onPress={() => router.back()}>
                                <BackArrow />
                            </Pr>
                            <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                                Events
                            </Urbanist>

                            <Pr onPress={() => router.push('/(in)/home/search')}>
                                <Search />
                            </Pr>
                        </Tv>
                    )
                }}
            />
        </Stack>
    );
}

export default Eventslayout;