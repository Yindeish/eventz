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
import { useAppDispatch } from "@/state/hooks/useRtk";
import { burnt } from "@/components/shared/burnt";
import { baseUrl } from "@/constants/ai.config";

const Events = () => {
  const dispatch = useAppDispatch()

  const [events, setEvents] = useState<(iEvent & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingTrending, setFetchingTrending] = useState(true);
  const [trendingEvents, setTrendingEvents] = useState<iEvent[]>([])

  const fetchEvents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const items = await Db<Partial<iEvent>>("event").getAll();

      // Normalize items to iEvent-ish shape where possible
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

      // setEvents(normalized);
      setEvents(normalized.slice(0, 7));
    } catch (err) {
      console.log("fetch events error", err);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  const fetchTrendingEvents = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setFetchingTrending(true);

      const res = await fetch(`${baseUrl}/trending/all`);

      if (!res?.ok) {
        burnt.toast({ title: 'Error in getting trending events' })
        return;
      }

      const data = await res.json();
      const trendingGroups = data?.data as iTrending[];

      const trending = trendingGroups.map((trendGroup) => (trendGroup?.events[0]))

      setTrendingEvents(trending)
    } catch (err) {
      console.log("fetch events error", err);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchEvents();
      fetchTrendingEvents();
    })()
  }, []);

  // const handleRefresh = async () => {
  //   await fetchEvents(true);
  // };
  const handleRefresh = async () => {
    await fetchEvents(true);
    fetchTrendingEvents();
  };

  // const featured = events.slice(0, 5);
  // const trending = events.slice(5);

  return (
    <Tv className="w-full h-full flex-col gap-[20px] bg-[#fefefe]">
      <Ts refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}>
        {/* Featured Events */}
        <Tv className="w-full h-fit flex-col gap-[16px] pl-[24px]">
          <Urbanist className="text-[#212121] text-[24px] font-bold">
            Featured Events
          </Urbanist>

          {loading ? (
            <Tv className="w-full h-[240px] flex-row items-center justify-center">
              <Spinner style={[view.w(20), view.h(20)]} svgStyle={[view.w(20), view.h(20)]} />
            </Tv>
            // ) : featured.length < 1 ? (
          ) : events?.length < 1 ? (
            <Tv className="w-full h-[240px] flex-row items-center justify-center">
              <Urbanist className="text-[#9E9E9E]">No featured events yet</Urbanist>
            </Tv>
          ) : (
            <FlatList
              // data={featured}
              data={[...events].sort(
                (a, b) =>
                  // new Date(b.startTimeStamp).getTime() -
                  // new Date(a.startTimeStamp).getTime()
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
              )}
              renderItem={({ item }) => <FeaturedEvent key={item.id} event={item} />}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[view.flexRow, view.gap(10), { paddingRight: 24 }]}
              style={[view.wAuto, view.h(416), view.bg_transparent]}
              keyExtractor={(item) => String(item?.id)}
            />
          )}
        </Tv>
        {/* Featured Events */}

        {/* 🔥Trending Events */}
        <Tv className="w-full flex-1 flex-col gap-[16px] pl-[24px]">
          <Tv className="w-full flex-row items-center justify-between pr-[20px]">
            <Urbanist className="text-[#212121] text-[24px] font-bold">
              🔥 Trending Events
            </Urbanist>

            <Urbanist onPress={() => router.push('/(in)/events/events')} className="text-[#73138C] text-[14px] font-bold">
              View all
            </Urbanist>
          </Tv>

          {loading ? (
            <Tv className="w-full h-[300px] flex-row items-center justify-center">
              <Spinner style={[view.w(20), view.h(20)]} svgStyle={[view.w(20), view.h(20)]} />
            </Tv>
            // ) : trending.length < 1 ? (
          ) : trendingEvents?.length < 1 ? (
            <Tv className="w-full h-auto flex-col items-center justify-center py-8">
              <Urbanist className="text-[#9E9E9E]">No trending events yet</Urbanist>
            </Tv>
          ) : (
            <FlatList
              data={trendingEvents}
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
              // style={[view.wAuto, view.hAuto, view.minH(500), view.maxH(700), view.bg_transparent]}
              keyExtractor={(item) => String(item?.id)}
            />
          )}
        </Tv>
        {/* 🔥Trending Events */}
      </Ts>
    </Tv>
  );
};

export default Events;