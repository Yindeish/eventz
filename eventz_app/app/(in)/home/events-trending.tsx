import FeaturedEvent from "@/components/in/events/featured-event";
import TrendingEvent from "@/components/in/events/trending-event";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Ts } from "@/components/shared/scroll-view";
import { Tv } from "@/components/shared/view";
import { view } from "@/styles/view";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import Spinner from "@/components/shared/spinner";
import { Db } from "@/firebase-web/services/firestore.service";
import { iEvent, iTrending } from "@/state/types/create-event";
import { router } from "expo-router";
import { postsArr } from "@/constants/posts";
import { RefreshControl } from "react-native";
import { setEventState } from "@/state/slices/event";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { burnt } from "@/components/shared/burnt";
import { baseUrl } from "@/constants/ai.config";
import { RootState } from "@/state/state";


const EventsTrending = () => {
    const dispatch = useAppDispatch()
    const { currentTrending } = useAppSelector((s: RootState) => s.search)


    return (
        <Tv className="w-full h-full bg-white pt-[24px] px-[20px]">
            {Number(currentTrending?.events?.length) < 1 ? (
                <Tv className="w-full h-auto flex-col items-center justify-center py-8">
                    <Urbanist className="text-[#9E9E9E]">No trending events yet</Urbanist>
                </Tv>
            ) : (
                <FlatList
                    data={currentTrending?.events}
                    renderItem={({ item: event, index }) => (
                        <TrendingEvent
                            event={event}
                            onPress={() => {
                                dispatch(setEventState({ key: 'currentEvent', value: event }))
                                router.push({ pathname: "/(in)/events/event", params: { eventId: event?.id } })
                            }
                            }
                            key={index}
                        />
                    )}
                    horizontal={false}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[view.flexCol, view.gap(10), { paddingBottom: 60 }]}
                    keyExtractor={(item) => item.id}
                />
            )}
        </Tv>
    );
}

export default EventsTrending;