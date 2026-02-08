import Location from "@/components/onboarding/setup/svgs/location";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { Tv } from "@/components/shared/view";
import { ImageSourcePropType } from "react-native";
import { view } from "@/styles/view";
import BookmarkFilled from "./svg/bookmark-filled";
import { postsArr } from "@/constants/posts";
import { img } from "@/styles/img";
import { router } from "expo-router";
import { iEvent } from "@/state/types/create-event";
import { useAppDispatch } from "@/state/hooks/useRtk";
import { setEventState } from "@/state/slices/event";

const TrendingEvent = ({ onPress, event }: { onPress?: () => void, event: iEvent }) => {
    const dispatch = useAppDispatch()

    const attend = () => { }

    return (
        <Pr onPress={onPress ? onPress : () => {
            dispatch(setEventState({ key: 'currentEvent', value: event }))
            router.push({ pathname: '/(in)/events/event', params: { eventId: event?.id } })
        }} className="w-fit h-fit flex-row gap-[16px] p-[14px] pr-[18px] rounded-[16px] bg-white"
            style={[view.bg_white]}

        >
            {/* <Pr onPress={onPress ? onPress : () => {
                dispatch(setEventState({ key: 'currentEvent', value: event }))
                router.push({ pathname: '/(in)/events/event', params: { eventId: event?.id } })
            }} > */}
            <Img source={{ uri: event?.banner }} className="w-[120px] h-[120px] rounded-[20px]" />
            {/* </Pr> */}

            <Tv className="w-full flex-col gap-[10px]">
                <Urbanist className="text-[#212121] text-[20px] font-bold">
                    {(event?.name?.length ?? 0) > 20 ? event?.name.slice(0, 20) + "..." : event?.name}
                </Urbanist>
                <Urbanist className="text-[#73138C] text-[14px] font-semibold text-wrap">
                    {/* {event?.startDate} • {event?.time} - {event?.endDate} */}
                    {event?.startDate} • {event?.time} - {event?.endDate}
                </Urbanist>
                <Tv className="w-full flex-row items-center gap-[4px]">
                    <Location color="#73138C" />
                    <Urbanist className="text-[#616161] text-[14px] font-medium">
                        {event?.location}
                    </Urbanist>
                    <BookmarkFilled />
                </Tv>

                {(event?.goings && event.goings?.length > 0) && (<Tv className="w-full flex-row gap-[6px] ">
                    <Tv className="w-full flex-row items-center gap-[6px]">
                        <Pr onPress={attend} className="w-fit h-[20px] flex-row items-center bg-[#73138C] rounded-[4px] px-[10px]">
                            <Urbanist className="text-white text-[10px] font-medium">
                                Going
                            </Urbanist>
                        </Pr>
                        <Pr onPress={() => router.push('/(in)/events/going')} className="w-auto flex-row">
                            {/* {[postsArr[0]?.authorImg, postsArr[0]?.authorImg, postsArr[0]?.authorImg,].map((imgItem, index) => ( */}
                            {event?.goings?.slice(0, 3)?.map((going, index) => (
                                // <Img source={imgItem as ImageSourcePropType} style={[img.mr(-4)]} className="w-[16px] h-[16px] rounded-full bg-[#D9D9D9]" key={index} />
                                <Img source={{ uri: going?.picture }} style={[img.mr(-4)]} className="w-[16px] h-[16px] rounded-full bg-[#D9D9D9]" key={index} />
                            ))}
                        </Pr>
                        <Urbanist onPress={() => router.push('/(in)/events/going')} className="text-[10px] font-normal pl-1">
                            {/* Olamide and 20+ others. */}
                            Olamide and some others.
                        </Urbanist>
                    </Tv>
                </Tv>)}
            </Tv>
        </Pr>
    );
}

export default TrendingEvent;