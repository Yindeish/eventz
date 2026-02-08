import Search from "@/components/in/svgs/search";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { view } from "@/styles/view";
import { router, Stack } from "expo-router";

const TicketsLayout = () => {
    const { insets: { top } } = useSafeAreaView()
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ticket" options={{
                headerShown: true,
                headerShadowVisible: false,
                header: () => (
                    <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                        <Pr onPress={() => router.back()}>
                            <BackArrow />
                        </Pr>
                        <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                            E - Ticket
                        </Urbanist>
                    </Tv>
                )
            }} />
            <Stack.Screen name="search" options={{
                headerShown: true,
                headerShadowVisible: false,
                header: () => (
                    <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                        <Pr onPress={() => router.back()}>
                            <BackArrow />
                        </Pr>
                        <Tv className={`flex-1 h-[50px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px] mt-[2px]`}>
                            <Search />
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                            >
                                <InputField className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Search.." />
                            </Input>
                        </Tv>
                    </Tv>
                )
            }} />
            <Stack.Screen name="cancel-booking" options={{
                headerShown: true,
                headerShadowVisible: false,
                header: () => (
                    <Tv className="w-full h-[52px] bg-white flex-row items-center gap-[16px] px-[24px]" style={[{ marginTop: top }]}>
                        <Pr onPress={() => router.back()}>
                            <BackArrow />
                        </Pr>
                        <Urbanist className="flex-1 text-[#212121] text-[24px] font-bold">
                            Cancel Booking
                        </Urbanist>
                    </Tv>
                )
            }} />
        </Stack>
    );
}

export default TicketsLayout;