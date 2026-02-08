import Container from "@/components/shared/container";
import { Tv } from "@/components/shared/view";
import { Ti } from "@/components/shared/text-input";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Sav } from "@/components/shared/safe-area-view";
import { Img } from "@/components/shared/img";
import { useEffect, useState } from "react";
import { FlatList, ImageSourcePropType, RefreshControl } from "react-native";
import { view } from "@/styles/view";
import { text } from "@/styles/text";
import Btn from "@/components/shared/btn";
import Location from "@/components/in/events/svg/location";
import { Pr } from "@/components/shared/pressable";
import { router } from "expo-router";
import { postsArr } from "@/constants/posts";
import { useSheetRef } from "@/components/shared/sheet";
import { useAppDispatch } from "@/state/hooks/useRtk";
import { iEvent } from "@/state/types/create-event";
import { Db } from "@/firebase-web/services/firestore.service";
import { setEventState } from "@/state/slices/event";
import useDay from "@/hooks/use-day";

export default function Search() {
  const dispatch = useAppDispatch();
  const { formatTime } = useDay()

  const [events, setEvents] = useState<(iEvent & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const items = await Db<Partial<iEvent>>("event").getSome(30);

      const normalized = items.map((d: any) => ({
        id: d.id,
        name: d.name || "Untitled event",
        location: d.location || "Unknown location",
        participants: d.participants || 0,
        startDate: d.startDate || "",
        endDate: d.endDate || "",
        time: d.time || "",
        startTimeStamp: d.startTimeStamp || "",
        endTimeStamp: d.endTimeStamp || "",
        category: d.category || "",
        about: d.about || "",
        banner: (d?.banner && !String(d.banner).includes('https://example.com')) ? d.banner : 'https://media.istockphoto.com/id/1481759725/photo/404-error-isolated-on-white-background-page-not-found.webp?a=1&b=1&s=612x612&w=0&k=20&c=queRR4cQt4gV6g-F-CzI0huHd6I0BBPmXH71Gye5wK0=',
        gallery: (d?.gallery && d?.gallery?.length > 0) ? d.gallery : [
          'https://media.istockphoto.com/id/1481759725/photo/404-error-isolated-on-white-background-page-not-found.webp?a=1&b=1&s=612x612&w=0&k=20&c=queRR4cQt4gV6g-F-CzI0huHd6I0BBPmXH71Gye5wK0=',
          'https://media.istockphoto.com/id/1481759725/photo/404-error-isolated-on-white-background-page-not-found.webp?a=1&b=1&s=612x612&w=0&k=20&c=queRR4cQt4gV6g-F-CzI0huHd6I0BBPmXH71Gye5wK0='
        ],
        organizerId: d.organizerId || "",
        organizer: d.organizer || undefined,
        artistsIds: d.artistsIds || [],
        artists: d.artists || [],
        ticketsIds: d.ticketsIds || [],
        tickets: d.tickets || [],
        commentsIds: d.commentsIds || [],
        comments: d.comments || [],
        likesIds: d.likesIds || [],
        likes: d.likes || [],
      })) as (iEvent & { id: string })[];

      setEvents(normalized);
    } catch (err) {
      console.log("fetch events error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      fetchEvents()
    })()
  }, [])


  return (
    <Tv className="flex-1 bg-white">
      <Container className="pt-[24px] flex-col gap-[24px] items-center">
        {(events.length < 1) && (<Urbanist className="text-[#212121] text-[20px] font-bold">{Number(events?.length)} found</Urbanist>)}

        <Tv className="w-full flex-1">
          <FlatList
            data={events}
            keyExtractor={(({ id }) => String(id))}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchEvents} />}
            renderItem={({ index, item: event }) => {

              return (
                <Tv className="w-fit h-fit flex-col gap-[12px] bg--white bg-green-700 p-[14px] rounded-[28px]"
                  style={[view.bg_white]}
                  key={index}
                >
                  <Tv className="w-fit h-fit flex-row gap-[16px]"
                  >
                    <Pr onPress={() => {
                      dispatch(setEventState({ key: 'currentEvent', value: event }))
                      router.push({ pathname: '/(in)/events/event', params: { eventId: event?.id } })
                    }}>
                      <Img source={{ uri: event?.banner }} className="w-[120px] h-[120px] rounded-[20px]" />
                    </Pr>

                    <Tv className="w-full flex-col gap-[10px]">
                      <Urbanist className="text-[#212121] text-[20px] font-bold">
                        {event?.name}
                      </Urbanist>
                      <Urbanist className="text-[#73138C] text-[14px] font-semibold">
                        {String(formatTime(event?.startDate)).charAt(0).toLowerCase().includes('a') ? `${String(formatTime(event?.startDate)).charAt(0).toUpperCase()} ${String(formatTime(event?.startDate)).slice(1)} ago` : `${String(formatTime(event?.startDate))} ago`}
                      </Urbanist>
                      <Tv className="w-full flex-row items-center gap-[4px]">
                        <Location width={16} height={16} />
                        <Urbanist className="text-[#616161] text-[14px] font-medium">
                          {event?.location}
                        </Urbanist>
                      </Tv>
                    </Tv>
                  </Tv>
                </Tv>
              )
            }}
            ListEmptyComponent={() => (
              <Tv className="w-full flex-1 flex-col justify-center items-center gap-[24px]">
                <Img
                  source={require("@/assets/images/in/not-found.png")}
                  className="w-full h-[250px] m-[20px]"
                />

                <Urbanist weight="700" className="text-[#212121] text-[24px] text-center font-bold">
                  Not Found
                </Urbanist>

                <Urbanist className="text-[#212121] text-[18px] text-center">
                  Sorry, the keyword you entered cannot be found. Please check again or
                  search with another keyword.
                </Urbanist>
              </Tv>
            )}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[view.flexCol, view.gap(10), view.pb(150)]}
            style={[view.wAuto, view.bg_transparent]}
          />
        </Tv>

      </Container >
    </Tv >
  );
}
