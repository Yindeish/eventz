import TrendingEvent from "@/components/in/events/trending-event";
import { burnt } from "@/components/shared/burnt";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import { iUser } from "@/state/types/auth";
import { iEvent, iFeed, iTrending } from "@/state/types/create-event";
import { view } from "@/styles/view";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch } from "@/state/hooks/useRtk";
import { setSearchState } from "@/state/slices/search";



const Search = () => {
    const { q } = useLocalSearchParams<{ q?: string }>();
    const query = (q || "").toLowerCase();
    const dispatch = useAppDispatch()

    const [feeds, setFeeds] = useState<iFeed[]>([]);
    const [loadingFeeds, setLoadingFeeds] = useState(false);
    const [trending, setTrending] = useState<iTrending[]>([]);
    const [loadingTrending, setLoadingTrending] = useState(false);

    const filteredFeeds = feeds.filter(feed =>
        feed?.headline?.toLowerCase().includes(query)
    );

    const filteredTrending = trending.filter(item =>
        item?.title?.toLowerCase().includes(query)
    );


    const refreshing = loadingFeeds || loadingTrending;

    const fetchFeeds = async () => {
        setLoadingFeeds(true)
        try {
            const res = await fetch('https://eventz-server.vercel.app/api/feeds/all');

            if (!res.ok) {
                burnt.toast({ title: 'Error in fetching feeds' })
            }

            const data = (await res.json())?.data as iFeed[];

            setFeeds(data.slice(0, 5));
        } catch (error) {
            console.log({ error })
        } finally {
            setLoadingFeeds(false)
        }
    }

    const fetchTrending = async () => {
        setLoadingFeeds(true)
        try {
            const res = await fetch('https://eventz-server.vercel.app/api/trending/all');

            if (!res.ok) {
                burnt.toast({ title: 'Error in fetching trending' })
            }

            const data = (await res.json())?.data as iTrending[];

            setTrending(data.slice(0, 5));
        } catch (error) {
            console.log({ error })
        } finally {
            setLoadingFeeds(false)
        }
    }

    const handleRefresh = async () => {
        await fetchFeeds()
        fetchTrending()
    }

    useEffect(() => {
        (async () => {
            await fetchFeeds();
            fetchTrending()
        })()
    }, [])


    return (
        <Tv className="w-full h-full flex-col gap-[20px] px-[20px] bg-white pb-[40px]">
            {/* {(filteredEvents.length > 0) && (<Urbanist className="text-[#212121] text-[20px] font-bold mb-[24px]">{filteredEvents.length} founds</Urbanist>)} */}
            <Urbanist className="text-[#212121] text-[20px] font-bold my-[24px]">
                Trending 🔥
            </Urbanist>

            <FlatList
                refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}
                data={[
                    ...filteredFeeds.map(item => ({ ...item, _type: "feed" })),
                    ...filteredTrending.map(item => ({ ...item, _type: "trending" })),
                ]}
                renderItem={({ item, index }) => {
                    const isFeed = item._type === "feed";
                    const feed = item as iFeed;
                    const isLastFeed = index === feeds.length - 1;
                    const trending = item as iTrending;

                    const selectFeed = () => {
                        dispatch(setSearchState({ key: 'currentFeed', value: feed }));
                        router.push({
                            pathname: "/(in)/home/events-search",
                            params: { q: feed?.headline || "" },
                        });
                    }
                    const selectTrending = () => {
                        dispatch(setSearchState({ key: 'currentTrending', value: trending }));
                        router.push({
                            pathname: "/(in)/home/events-trending",
                            params: { q: trending?.title || "" },
                        });
                    }


                    if (isFeed) return (
                        <Pr
                            onPress={selectFeed}
                            className={`w-full flex-col gap-2 ${isLastFeed ? 'border-b-[1px] border-b-[#6b7280da] pb-[30px]' : ''}`} key={feed?.id}>
                            <Urbanist className="text-gray-900 text-[17px] font-bold">
                                {feed?.headline}
                            </Urbanist>
                            <Tv className="w-full flex-row gap-1.5">
                                {[...feed?.events].map((event, id) => (
                                    <Img className="w-[24px] h-[24px] rounded-full" source={{ uri: event?.organizer?.picture }} key={id} />
                                ))}
                                <Urbanist className="text-gray-900 text-[12px]">{feed?.events?.length} events</Urbanist>
                            </Tv>
                        </Pr>
                    )
                    else return (
                        <Urbanist onPress={selectTrending} className="text-gray-900 text-[15px] font-bold py-2" key={trending?.id}>{trending?.title}</Urbanist>
                    )
                }}
                keyExtractor={(item, index) => `${item._type}-${item.id}-${index}`}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[view.flexCol, view.gap(10)]}
                style={[view.wFull, view.bg_transparent]}
                ListEmptyComponent={
                    <Tv className="w-full py-[40px] items-center justify-center">
                        <Urbanist className="text-[#9E9E9E]">
                            {query ? "No results found" : "No feeds"}
                        </Urbanist>
                    </Tv>
                }
            />
        </Tv>
    );
}

export default Search;