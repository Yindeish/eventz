import TrendingEvent from "@/components/in/events/trending-event";
import Container from "@/components/shared/container";
import { Tv } from "@/components/shared/view";
import { useAppDispatch } from "@/state/hooks/useRtk";
import { setEventState } from "@/state/slices/event";
import { iEvent } from "@/state/types/create-event";
import { view } from "@/styles/view";
import { router, useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { FlatList } from "react-native";

const Events = () => {
    const { eventsStr } = useLocalSearchParams();
    const dispatch = useAppDispatch()

    const [events, setEvents] = useState<iEvent[]>([])

    useLayoutEffect(() => {
        if (eventsStr) {
            const parsedEvents = JSON.parse(eventsStr as string);
            setEvents(parsedEvents)
        }
    }, [eventsStr])

    return (
        <Tv className="w-full h-full bg-white pt-[24px]">
            <Container className="">
                <FlatList
                    data={events}
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
            </Container>
        </Tv>
    );
}

export default Events;