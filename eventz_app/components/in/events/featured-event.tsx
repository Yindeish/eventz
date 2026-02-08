import Location from "@/components/onboarding/setup/svgs/location";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { Tv } from "@/components/shared/view";
import Bookmark from "../home/svgs/bookmark";
import { view } from "@/styles/view";
import { router } from "expo-router";
import { iEvent } from "@/state/types/create-event";
import { useAppDispatch } from "@/state/hooks/useRtk";
import { setEventState } from "@/state/slices/event";

const FeaturedEvent = ({ event }: { event: iEvent }) => {
    const dispatch = useAppDispatch();


    return (
        <Pr className="w-fit h-fit flex flex-col gap-[12px] p-[16px] rounded-[20px] bg-white"
            style={[view.bg_white]}
            onPress={() => {
                dispatch(setEventState({ key: 'currentEvent', value: event }))
                router.push({ pathname: '/(in)/events/event', params: { eventId: event?.id } });
            }}
        >
            {/* <Img source={require('@/assets/images/in/events/event.png') as ImageSourcePropType} className="w-[330px] h-[250px] rounded-[32px]" /> */}
            <Img source={{ uri: event?.banner }} className="w-[330px] h-[250px] rounded-[32px]" />

            <Tv className="w-full flex-col gap-[14px]">
                <Urbanist className="text-[#212121] text-[24px] font-bold">
                    {event?.name}
                </Urbanist>
                <Urbanist className="text-[#73138C] text-[18px] font-semibold">
                    {/* Mon, Dec 24 • 18.00 - 23.00 PM */}
                    {event?.startDate} • {event?.endDate} - {event?.time}
                </Urbanist>
                <Tv className="w-full flex-row items-center gap-[12px]">
                    <Location color="#73138C" />
                    <Urbanist className="text-[#616161] text-[18px] font-medium">
                        {event?.location}
                    </Urbanist>
                    <Bookmark color="#73138C" />
                </Tv>
            </Tv>
        </Pr>
    );
}

export default FeaturedEvent;