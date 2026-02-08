import CaptureScreen from "@/components/in/capture-screen";
import FeaturedEvent from "@/components/in/events/featured-event";
import BackBtn from "@/components/in/events/svg/back-btn";
import Calendar from "@/components/in/events/svg/calendar";
import CalendarInner from "@/components/in/events/svg/calendar-inner";
import ChevronRightThin from "@/components/in/events/svg/chevron-right-thin";
import Location from "@/components/in/events/svg/location";
import Ticket from "@/components/in/events/svg/ticket";
import Bookmark from "@/components/in/home/svgs/bookmark";
import Emoji from "@/components/in/home/svgs/emoji";
import Send from "@/components/in/home/svgs/send";
import LocationInner from "@/components/onboarding/setup/svgs/location";
import Btn from "@/components/shared/btn";
import { burnt } from "@/components/shared/burnt";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { Ts } from "@/components/shared/scroll-view";
import Spinner from "@/components/shared/spinner";
import { Ti } from "@/components/shared/text-input";
import { Tv } from "@/components/shared/view";
import { postsArr } from "@/constants/posts";
import { collections } from "@/firebase-web/services/collections";
import useAuth from "@/hooks/auth/useAuth";
import useShare from "@/hooks/use-media-share";
import usePostActions from "@/hooks/use-post-actions";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { setEventState } from "@/state/slices/event";
import { RootState } from "@/state/state";
import { iUser } from "@/state/types/auth";
import { iComment, iEvent, tTicketStatus, tTicketType } from "@/state/types/create-event";
import { img } from "@/styles/img";
import { view } from "@/styles/view";
import { P } from "@expo/html-elements";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, ImageSourcePropType, RefreshControl } from "react-native";
import PagerView from "react-native-pager-view";

const Event = () => {
    const pagerRef = useRef<null | PagerView>(null);
    const { currentEvent } = useAppSelector((s: RootState) => s.event);
    const { user } = useAuth();
    const { eventId } = useLocalSearchParams();
    const dispatch = useAppDispatch()
    const viewRef = useRef<number | React.ReactInstance | React.RefObject<unknown>>(null);
    const { handleShare, sharing } = useShare({ viewRef })
    const navigation = useNavigation()
    const { share, save } = usePostActions({ userId: user?.id as string })

    const eventImages = currentEvent?.gallery?.map((imgUrl) => ({ image: imgUrl })) || [];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [comments, setComments] = useState<(Partial<iComment> & { id: string })[]>([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [sendingComment, setSendingComment] = useState(false)
    const [followingOrg, setFollowingOrg] = useState(false);
    const [relatedEvents, setRelatedEvents] = useState([])
    const [gettingRelatedEvents, setGettingRelatedEvents] = useState(false);
    const [booking, setBooking] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getEvent = async () => {
        try {
            if (!eventId) return;
            const eventDetails = await collections.event.getById(eventId as string);

            dispatch(setEventState({ key: 'currentEvent', value: eventDetails as iEvent }))
        } catch (error) {
            console.log({ error })
        }
    }

    const fetchComments = async () => {
        if (loading) return;

        setLoading(true)
        try {
            const commentsArr = await collections.comment.findByField('eventId', currentEvent?.id);
            setComments(commentsArr)
        } catch (error) {
            console.log({ error })
        } finally {
            setLoading(false)
        }
    }

    const sendComment = async () => {
        if (sendingComment || commentText == '') return;
        try {
            setSendingComment(true)

            await collections.comment.create({
                author: user as iUser,
                authorId: user?.id,
                eventId: currentEvent?.id,
                text: commentText
            })

            const eventDetails = await collections.event.getById(currentEvent?.id as string);
            await collections.event.update(currentEvent?.id as string, { commentsCount: Number(eventDetails?.commentsCount) + 1 })

            setCommentText('')
            fetchComments();
        } catch (error) {
            console.log({ error })
        } finally {
            setSendingComment(false)
        }
    }

    const followOrganizer = async () => {
        if (currentEvent?.organizer?.followersIds && currentEvent?.organizer?.followersIds.find(id => id == user?.id as string)) {
            burnt.toast({ title: `Already following ${currentEvent?.organizer?.userName}` })
            return;
        }
        setFollowingOrg(true)
        try {
            const organizer = currentEvent?.organizer;

            if (currentEvent?.organizer?.followersIds == undefined || currentEvent?.organizer?.followersIds.length == 0) {
                await collections.user.update(organizer?.id as string, { followersIds: [user?.id as string] });

                burnt.toast({ title: `You're now following ${currentEvent?.organizer?.userName}` })

                return;
            }

            await collections.user.update(organizer?.id as string, { followersIds: [...organizer?.followersIds as string[], user?.id as string] });

            await collections.user.update(user?.id as string, { followingsIds: user?.followingsIds ? [...user?.followingsIds, organizer?.id as string] : [organizer?.id as string] })
        } catch (error) {
            console.log({ error })
        } finally {
            setFollowingOrg(false)
        }
    }

    const fetchRelatedEvents = async () => {
        setGettingRelatedEvents(true)
        try {
            const res = await fetch(`https://eventz-server.vercel.app/api/events/related-events/${eventId}`);

            if (!res?.ok) {
                // burnt.toast({ title: 'Error in getting related events' })
                console.log({ 'err': 'Error in getting related events' })
                return;
            }

            const data = await res.json();
            const relatedEventsArr = data?.data;

            console.log({ 'relatedEventsArr': relatedEventsArr })

            setRelatedEvents(relatedEventsArr)
        } catch (error) {
            console.log({ error })
        } finally {
            setGettingRelatedEvents(false)
        }
    }

    const bookEvent = async () => {
        setBooking(true)
        try {
            const eventExist = await collections.event.getById(eventId as string);

            if (!eventExist) {
                burnt.toast({ title: 'Event not found!' })
                return;
            }

            const alreadyGoing = eventExist?.goingsIds?.find((id) => id === String(user?.id));

            if (alreadyGoing) {
                burnt.toast({ title: 'You already booked this event. Stay tunded' })

                return;
            }

            await collections.event.update(eventId as string, {
                goingsCount: Number(eventExist?.goingsCount) + 1,
                goingsIds: [...(eventExist?.goingsIds || []), user?.id as string],
                goings: [...(eventExist?.goings || []), user as iUser],
            })

            await collections.ticket.create({
                eventId: eventId as string,
                event: eventExist as iEvent,
                userId: user?.id as string,
                user: user as iUser,
                price: eventExist?.ticket?.type === 'paid' ? eventExist?.ticket?.vipPrice || eventExist?.ticket?.vipPrice : 0,
                quantity: 1,
                // ! check quantity out later
                status: 'paid',
                type: eventExist?.ticket?.type as tTicketType
            })

            await collections.going.create({
                eventId: eventId as string,
                user: user as iUser,
                userId: user?.id as string
            })

            router.push('/(in)/(tabs)/tickets')
        } catch (error) {
            console.log({ error })
        } finally {
            setBooking(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await getEvent();
        await fetchComments();
        await fetchRelatedEvents()
        setRefreshing(false)
    }

    useEffect(() => {
        (async () => {
            if (comments?.length == 0) await fetchComments()
            if (relatedEvents?.length == 0) fetchRelatedEvents()
        })()
    }, [currentEvent])

    useEffect(() => {
        (async () => {
            if (comments?.length == 0) await fetchComments()
            if (relatedEvents?.length == 0) fetchRelatedEvents()
        })()
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            header: () => (
                <Tv className="w-full h-[48px] bg-transparent flex-row items-center gap-[20px] px-[24px] absolute left-0 z-10" style={[{ top: 0, position: 'fixed', paddingTop: 53 }]}>
                    <Pr onPress={() => router.back()} className="flex-1 bg-transparent">
                        <BackBtn />
                    </Pr>

                    <Pr onPress={() => {
                        save(eventId as string)
                    }}>
                        <Bookmark color="white" width={28} height={28} />
                    </Pr>
                    <Pr onPress={() => {
                        handleShare({
                            onShared: () => {
                                share(eventId as string)
                            }
                        })
                    }}>
                        <Send color="white" width={28} height={28} />
                    </Pr>
                </Tv>
            )
        })
    }, [])

    return (
        <Tv className="w-full h-full flex-col bg-white">
            <Tv className="w-full flex-1">
                <Ts refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                    <Tv className="w-full h-[400px] relative">
                        <PagerView
                            ref={pagerRef}
                            style={[view.wFull, view.hFull]}
                            initialPage={currentSlide}
                            onPageSelected={({ nativeEvent: { position } }) => {
                                setCurrentSlide(position)
                            }}>
                            {eventImages.map(({ image }, index) => (
                                <Img className="flex-1 w-full h-full" style={[img.object('cover')]} source={{ uri: image }} key={index} />
                            ))}
                        </PagerView>

                        {/* Indicators */}
                        <Tv className="w-full h-fit absolute bottom-[16px] left-0 z-10">
                            <Tv className="flex-row gap-[8px] items-center justify-center mt-[24px]">
                                {Array.from({ length: eventImages.length }).map((_, index) => (
                                    <Tv
                                        className={`h-[8px] rounded-full ${index === currentSlide ? "w-[32px] bg-[#5A189A]" : "w-[8px] bg-[#E2E8F0]"
                                            }`} key={index} />
                                ))}
                            </Tv>
                        </Tv>
                        {/* Indicators */}
                    </Tv>

                    <Tv className="w-full flex-col gap-[20px] p-[24px]">
                        <CaptureScreen ref={viewRef as any}>
                            <Tv className="w-full bg-white flex-col gap-[20px] p-[24px]">
                                <Urbanist className="text-[#212121] text-[32px] font-bold">
                                    {currentEvent?.name}
                                </Urbanist>

                                {/* Going */}
                                {(currentEvent?.goings && currentEvent.goings.length > 0) && (<Tv className="w-full flex-row gap-[6px] ">
                                    <Tv className="w-full flex-row items-center gap-[6px]">
                                        <Pr className="w-fit h-[20px] flex-row items-center bg-[#73138C] rounded-[4px] px-[10px]">
                                            <Urbanist className="text-white text-[10px] font-medium">
                                                Going
                                            </Urbanist>
                                        </Pr>
                                        {/* <Pr onPress={() => router.push('/(in)/events/going')} className="w-auto flex-row">
                                    {[postsArr[0]?.authorImg, postsArr[0]?.authorImg, postsArr[0]?.authorImg,].map((imgItem, index) => (
                                        <Img source={imgItem as ImageSourcePropType} style={[img.mr(-4)]} className="w-[16px] h-[16px] rounded-full bg-[#D9D9D9]" key={index} />
                                    ))}
                                </Pr> */}
                                        {currentEvent?.goings?.slice(0, 3)?.map((going, index) => (
                                            // <Img source={imgItem as ImageSourcePropType} style={[img.mr(-4)]} className="w-[16px] h-[16px] rounded-full bg-[#D9D9D9]" key={index} />
                                            <Img source={{ uri: going?.picture }} style={[img.mr(-4)]} className="w-[16px] h-[16px] rounded-full bg-[#D9D9D9]" key={index} />
                                        ))}
                                        <Urbanist onPress={() => router.push('/(in)/events/going')} className="text-[12px] font-normal pl-1">
                                            {/* Olamide and 20+ others. */}
                                            {currentEvent?.goings[0]?.userName} and some others.
                                        </Urbanist>
                                    </Tv>
                                </Tv>)}
                                {/* Going */}

                                {/* Divider */}
                                <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
                                {/* Divider */}

                                {/* Actions */}
                                <Tv className="w-full flex-col gap-[20px]">
                                    {[
                                        {
                                            leadingIcon: <Calendar />,
                                            // title: 'Monday, December 24, 2024',
                                            title: currentEvent?.startDate,
                                            // subtitle: '18.00 - 23.00 PM WAT',
                                            subtitle: `${currentEvent?.time} - ${currentEvent?.endDate}`,
                                            btnIcon: <CalendarInner />,
                                            btnText: 'Add to My Calendar',
                                            action: () => {
                                                burnt.toast({ title: 'Feature is coming soon' })
                                            },
                                        },
                                        {
                                            leadingIcon: <Location />,
                                            // title: 'Grand Park, Lagos, Nigeria',
                                            title: currentEvent?.location,
                                            // subtitle: 'Grand City St. 100, Lagos, Nigeria',
                                            subtitle: currentEvent?.location,
                                            btnIcon: <LocationInner color="white" />,
                                            btnText: 'See Location on Maps',
                                            action: () => {
                                                burnt.toast({ title: 'Feature is coming soon' })
                                            },
                                        },
                                        {
                                            leadingIcon: <Ticket />,
                                            // title: '₦7,000 - ₦25,000',
                                            // title: currentEvent?.ticket?.type === 'free' ? 'Free' : (currentEvent?.ticket?.vipPrice || currentEvent?.ticket?.economyPrice),
                                            title: 'Free',
                                            subtitle: 'Ticket price depends on package.',
                                        },
                                    ].map(({ leadingIcon, title, subtitle, ...rest }, index) => (
                                        <Tv className="w-full flex-row gap-[20px]" key={index}>
                                            <Tv className="w-[60px] h-[60px] flex-row items-center justify-center bg-[#F1E7FD63] rounded-full">
                                                {leadingIcon}
                                            </Tv>

                                            <Tv className="flex-1 flex-col gap-[12px]">
                                                <Urbanist className="text-[#212121] text-[18px] font-bold">
                                                    {title}
                                                </Urbanist>
                                                <Urbanist className="text-[#212121] text-[14px] font-medium">
                                                    {subtitle}
                                                </Urbanist>
                                                {(rest?.btnIcon && rest?.btnText) && (<Pr
                                                    onPress={rest?.action}
                                                    className="w-auto h-[32px] flex-row items-center gap-[8px] px-[16px] bg-[#73138C] rounded-full mr-auto">
                                                    {rest.btnIcon}
                                                    <Urbanist className="text-white text-[14px] font-semibold">
                                                        {rest?.btnText}
                                                    </Urbanist>
                                                </Pr>)}
                                            </Tv>
                                        </Tv>
                                    ))}
                                </Tv>
                                {/* Actions */}

                                {/* Divider */}
                                <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
                                {/* Divider */}

                                {/* Organizer */}
                                <Tv className="w-full flex-row items-center gap-[20px]">
                                    <Pr onPress={() => router.push({ pathname: '/(in)/events/organizer', params: { organizerId: currentEvent?.organizerId } })}>
                                        <Img source={{ uri: currentEvent?.organizer?.picture }} className="w-[60px] h-[60px] rounded-full" />
                                    </Pr>
                                    <Pr
                                        onPress={() => router.push({ pathname: '/(in)/events/organizer', params: { organizerId: currentEvent?.organizerId } })}
                                        className="flex-1 flex-col justify-center gap-[4px]">
                                        <Urbanist className="text-[#212121] text-[18px] font-bold">{currentEvent?.organizer?.userName}</Urbanist>
                                        <Urbanist className="text-[#616161] text-[14px] font-medium">Organizer</Urbanist>
                                    </Pr>
                                    <Btn
                                        leftIcon={followingOrg ? <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                                        container={{
                                            className: 'px-[16px]',
                                            style: [view.wAuto, view.h(32)],
                                            onPress: () => !followingOrg && followOrganizer()
                                        }}
                                        text={{
                                            children: followingOrg ? "Following.." : 'Follow'
                                        }}
                                    />
                                </Tv>
                                {/* Organizer */}

                                {/* About Event */}
                                <Tv className="flex-col gap-[12px]">
                                    <Urbanist className="text-[#212121] text-[20px] font-bold">
                                        About Event
                                    </Urbanist>
                                    <Urbanist className="text-[16px] font-medium">
                                        {currentEvent?.about}
                                    </Urbanist>
                                </Tv>
                                {/* About Event */}
                            </Tv>
                        </CaptureScreen>

                        {/* Gallery (Pre-Event) */}
                        <Tv className="flex-col gap-[20px]">
                            <Tv className="w-full flex-row justify-between items-center">
                                <Urbanist className="text-[#212121] text-[20px] font-bold">Gallery (Pre-Event)</Urbanist>
                                <Urbanist onPress={() => router.push('/(in)/events/gallery')} className="text-[#73138C] text-[16px] font-bold">
                                    See all
                                </Urbanist>
                            </Tv>

                            <Tv className="w-full flex-row gap-[12px]">
                                {currentEvent?.gallery?.
                                    slice(0, 3)
                                    .map((img, index) => (
                                        <Tv className="flex-1 h-[95px] relative" key={index}>
                                            <Img className="w-full h-full rounded-[20px]" source={{ uri: img }} />
                                            {/* {(index === 2) && (
                                                <Tv className="w-full h-full flex-row items-center justify-center absolute top-0 left-0 z-2">
                                                    <Urbanist className="text-white text-[20px] font-bold">20+</Urbanist>
                                                </Tv>
                                            )} */}
                                            {(index === 2 && (currentEvent?.gallery.length > 3)) && (
                                                <Tv className="w-full h-full flex-row items-center justify-center absolute top-0 left-0 z-2">
                                                    <Urbanist className="text-white text-[20px] font-bold">{Number(currentEvent?.gallery.length) - 3}+</Urbanist>
                                                </Tv>
                                            )}
                                        </Tv>
                                    ))}
                            </Tv>
                        </Tv>
                        {/* Gallery (Pre-Event) */}

                        {/* Gallery (Pre-Event) */}
                        <Tv className="flex-col gap-[20px]">
                            <Tv className="w-full flex-row justify-between items-center">
                                <Urbanist className="text-[#212121] text-[20px] font-bold">Artists & Speakers</Urbanist>
                                {/* <Urbanist className="text-[#73138C] text-[16px] font-bold">

                                </Urbanist> */}
                            </Tv>

                            <Tv className="w-full h-fit flex-row flex-wrap gap-[16px]">
                                {currentEvent?.artists?.map((artist, index) => (
                                    <Pr className="w-auto flex-col gap-[4px]" key={index}>
                                        <Img className="w-[40px] h-[40px] rounded-full" source={{ uri: artist?.picture }} />
                                        <Urbanist className="text-[8px] font-medium">
                                            {artist?.userName}
                                        </Urbanist>
                                    </Pr>
                                ))}
                            </Tv>
                        </Tv>
                        {/* Gallery (Pre-Event) */}

                        {/* People's comments */}
                        <Tv className="flex-col gap-[12px]">
                            <Tv className="w-full flex-row items-center gap-[8px]">
                                <Urbanist className="flex-1 text-black text-[12px] font-medium">
                                    People’s comment
                                </Urbanist>
                                {/* <Urbanist className="text-black text-[10px] font-semibold">
                                    See All
                                </Urbanist> */}
                                <ChevronRightThin />
                            </Tv>

                            {(loading) ? (
                                <Tv className="flex-1 flex-row items-center justify-center">
                                    <Spinner style={[view.w(12), view.h(12)]} svgStyle={[view.w(12), view.h(12)]} />
                                </Tv>
                            ) : (<FlatList
                                data={comments}
                                renderItem={(({ index, item: comment }) => (
                                    <Tv className="w-full h-fit flex-row gap-[6px] border-b border-b-[#EEEEEE] pb-[8px]" key={index}>
                                        <Img className="w-[24px] h-[24px] rounded-full" source={{ uri: comment?.author?.picture }} />
                                        <Tv className="flex-1 flex-col gap-[8px]">
                                            <Urbanist className="text-black text-[10px] font-medium">{comment?.author?.userName}</Urbanist>
                                            <Urbanist className="text-[#616161] text-[10px]">
                                                {comment?.text}
                                            </Urbanist>
                                        </Tv>
                                    </Tv>
                                ))}
                                className="w-full"
                                contentContainerClassName="flex-col gap-[8px]"
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                            />)}

                            <Tv className="w-full h-fit flex-row items-center gap-[12px] p-[8px]">
                                <Img source={{ uri: user?.picture }} className="w-[24px] h-[24px] rounded-full" />
                                <Tv className="flex-1 h-auto flex-row items-center gap-[12px] px-[20px] rounded-[4px] bg-[#FAFAFA]">
                                    <Ti
                                        value={commentText}
                                        onChangeText={(text) => setCommentText(text)}
                                        className="flex-1 text-[10px] border-none outline-none" />
                                    {/* <Emoji width={16} height={16} /> */}
                                    {sendingComment ? (<Spinner style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} />) : (
                                        <Pr onPress={sendComment}>
                                            <Send width={16} height={16} />
                                        </Pr>)}
                                </Tv>
                            </Tv>
                        </Tv>
                        {/* People's comments */}

                        {/* More events like this */}
                        <Tv className="w-full flex-row justify-between items-center">
                            <Urbanist className="text-[#212121] text-[20px] font-bold">
                                More Events like this
                            </Urbanist>
                            <Urbanist onPress={() => router.push('/(in)/events/events')} className="text-[#73138C] text-[16px] font-bold">
                                See all
                            </Urbanist>
                        </Tv>

                        {(gettingRelatedEvents) ? (
                            <Tv className="flex-1 min-h-[100px] flex-row justify-center items-center">
                                <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} />
                            </Tv>
                        ) : (<FlatList
                            data={relatedEvents}
                            renderItem={({ index, item: event }) => (
                                <FeaturedEvent key={index} event={event} />
                            )}
                            ListEmptyComponent={(() => (
                                <Tv className="w-full min-h-[100px] flex-col items-center justify-center">
                                    <Urbanist>No Related events found</Urbanist>
                                </Tv>
                            ))}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={[view.flexRow, view.gap(10)]}
                            style={[view.wAuto, view.h(416), view.bg_transparent]}
                        />)}
                        {/* More events like this */}

                    </Tv>
                </Ts>
            </Tv>

            <Tv className="w-full pt-[10px] px-[24px] pb-[24px] bg-white">
                <Btn
                    leftIcon={booking ? <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                    container={{
                        onPress: () => !booking && bookEvent(),
                        className: "w-full h-[58px] flex-row items-center justify-center bg-[#73138C] rounded-full",
                        style: [view.shadowLg]
                    }}
                    text={{
                        className: "text-white text-[16px] font-bold",
                        children: booking ? 'Booking..' : 'Book Event'
                    }}
                />
            </Tv>
        </Tv>
    );
}

export default Event;