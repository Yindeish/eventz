import { Ts } from "@/components/shared/scroll-view";
import { Tv } from "@/components/shared/view";
import { postsArr } from "@/constants/posts";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { view } from "@/styles/view";
import { FlatList, ImageSourcePropType } from "react-native";
import TrendingEvent from "../trending-event";
import { Pr } from "@/components/shared/pressable";
import { router } from "expo-router";
import { Img } from "@/components/shared/img";
import Urbanist from "@/components/shared/fonts/urbanist";
import Location from "@/components/onboarding/setup/svgs/location";
import BookmarkFilled from "../svg/bookmark-filled";
import { img } from "@/styles/img";


const Events = () => {
    const { insets } = useSafeAreaView();

    const attend = () => { }

    return (
        <Tv className="flex-1 bg-[#FDFDFD]">
            <FlatList
                data={postsArr.concat(postsArr)}
                renderItem={({ index, item: community }) => (
                    <Tv className="w-fit h-fit flex-row items-center gap-[16px] p-[14px] pr-[18px] rounded-[16px] bg-white"
                        style={[view.bg_white]}
                        key={index}>
                        <Pr onPress={() => {
                            router.push('/(in)/events/event')
                        }}>
                            <Img source={require('@/assets/images/in/events/trending-event.png') as ImageSourcePropType} className="w-[90px] h-[90px] rounded-[20px]" />
                        </Pr>

                        <Tv className="w-full flex-col gap-[8px]">
                            <Urbanist className="text-[#212121] text-[16px] font-bold">
                                National Music Festival
                            </Urbanist>
                            <Urbanist className="text-[#73138C] text-[12px] font-semibold">
                                Mon, Dec 24 • 18.00 - 23.00 PM
                            </Urbanist>
                            <Tv className="w-full flex-row items-center gap-[3px]">
                                <Location color="#73138C" />
                                <Urbanist className="text-[#616161] text-[12px] font-medium">
                                    Grand Park, Ajah, Lagos State
                                </Urbanist>
                                <BookmarkFilled />
                            </Tv>

                            <Tv className="w-full flex-row gap-[3px] ">
                                <Tv className="w-full flex-row items-center gap-[6px]">
                                    <Pr onPress={attend} className="w-fit h-[20px] flex-row items-center bg-[#73138C] rounded-[4px] px-[10px]">
                                        <Urbanist className="text-white text-[10px] font-medium">
                                            Going
                                        </Urbanist>
                                    </Pr>
                                    <Pr onPress={() => router.push('/(in)/events/going')} className="w-auto flex-row">
                                        {[postsArr[0]?.authorImg, postsArr[0]?.authorImg, postsArr[0]?.authorImg,].map((imgItem, index) => (
                                            <Img source={imgItem as ImageSourcePropType} style={[img.mr(-4)]} className="w-[16px] h-[16px] rounded-full bg-[#D9D9D9]" key={index} />
                                        ))}
                                    </Pr>
                                    <Urbanist onPress={() => router.push('/(in)/events/going')} className="text-[10px] font-normal pl-1">
                                        Olamide and 20+ others.
                                    </Urbanist>
                                </Tv>
                            </Tv>
                        </Tv>
                    </Tv>
                )}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[view.flexCol, view.gap(10)]}
                style={[view.wAuto,]}
            />

            {/* <Tv className="w-full h-[100px] bg-white" /> */}
        </Tv>
    );
}

export default Events;