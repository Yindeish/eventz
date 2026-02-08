import { Tv } from "@/components/shared/view";
import { postsArr } from "@/constants/posts";
import { view } from "@/styles/view";
import { FlatList, ImageSourcePropType, RefreshControl } from "react-native";
import { Pr } from "@/components/shared/pressable";
import { router } from "expo-router";
import { Img } from "@/components/shared/img";
import Urbanist from "@/components/shared/fonts/urbanist";
import Location from "../../events/svg/location";
import Btn from "@/components/shared/btn";
import { text } from "@/styles/text";
import SheetModal from "@/components/shared/sheet-modal";
import { useState } from "react";
import { useSheetRef } from "@/components/shared/sheet";
import Review from "../sheets/review";
import CancelBooking from "../sheets/cancel-booking";
import { iTicket } from "@/state/types/create-event";
import Spinner from "@/components/shared/spinner";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import { setTicketState } from "@/state/slices/ticket";

const Upcoming = ({ tickets, loading = false, onRefresh = () => { } }: { tickets: iTicket[], loading?: boolean, onRefresh: () => Promise<void> | void | undefined }) => {
    const sheet = useSheetRef();
    const dispatch = useAppDispatch();
    const { currentTicket } = useAppSelector((s: RootState) => s.ticket)

    const snapoints = {
        info: [158],
        tag: [385],
        comments: [385]
    };
    const [currentSnapoints, setCurrentSnappoints] = useState(snapoints.comments);
    const [sheets, setSheets] = useState({
        review: false,
        cancelBooking: false,
    })

    const cancelBooking = () => {
        sheet.open()
        setSheets({
            cancelBooking: true,
            review: false
        })
    }

    const leaveReview = () => {
        sheet.open()
        setSheets({
            cancelBooking: false,
            review: true
        })
    }

    const viewTicket = (ticket: iTicket) => {
        dispatch(setTicketState({ key: 'currentTicket', value: ticket }))
        router.push({ pathname: '/(in)/tickets/ticket', params: { ticketId: ticket?.id } })
    }

    const closeSheet = () => {
        sheet.close();
        setSheets({
            cancelBooking: false,
            review: false
        })
    }


    return (
        <Tv className="w-full h-full pt-[24px] bg-[#FDFDFD]">
            {loading ? (
                <Tv className="w-full flex-1 flex-col justify-center items-center">
                    <Spinner />
                </Tv>
            ) : (
                <FlatList
                    data={tickets}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
                    renderItem={({ index, item: ticket }) => {
                        const pending = ticket?.status === 'pending';
                        const paid = ticket?.status === 'paid';
                        const completed = ticket?.status === 'completed';
                        const cancelled = ticket?.status === 'cancelled';

                        return (
                            <Tv className="w-fit h-fit flex-col gap-[12px] bg--white bg-green-700 p-[14px] rounded-[28px]"
                                style={[view.bg_white]}
                                key={index}
                            >
                                <Tv className="w-fit h-fit flex-row gap-[16px]"
                                >
                                    <Pr onPress={() => {
                                        router.push('/(in)/events/event')
                                    }}>
                                        <Img source={require('@/assets/images/in/events/trending-event.png') as ImageSourcePropType} className="w-[120px] h-[120px] rounded-[20px]" />
                                    </Pr>

                                    <Tv className="w-full flex-col gap-[10px]">
                                        <Urbanist className="text-[#212121] text-[20px] font-bold">
                                            {/* National Music Festival */}
                                            {ticket?.event?.name}
                                        </Urbanist>
                                        <Urbanist className="text-[#73138C] text-[14px] font-semibold">
                                            {/* Mon, Dec 24 • 18.00 - 23.00 PM */}
                                            {ticket?.event?.startDate} • {ticket?.event?.time} - {ticket?.event?.endDate}
                                        </Urbanist>
                                        <Tv className="w-full flex-row items-center gap-[4px]">
                                            <Location width={16} height={16} />
                                            <Urbanist className="text-[#616161] text-[14px] font-medium">
                                                {/* New Avenue, ... */}
                                                {ticket?.event?.location}
                                            </Urbanist>
                                            {(paid) && (<Btn
                                                container={{
                                                    className: 'flex-row items-center justify-center rounded-[6px] p-[0px] bg-white border border-[#490F89]',
                                                    style: [view.wAuto, view.h(24), view.px(10), view.py(0)]
                                                }}
                                                text={{
                                                    className: 'font-semibold',
                                                    style: [text.size(10), text.color('#490F89')],
                                                    children: 'paid',
                                                }}
                                            />)}
                                            {(completed) && (<Btn
                                                container={{
                                                    className: 'flex-row items-center justify-center rounded-[6px] p-[0px] bg-white border border-[#07BD74]',
                                                    style: [view.wAuto, view.h(24), view.px(10), view.py(0)]
                                                }}
                                                text={{
                                                    className: 'font-semibold',
                                                    style: [text.size(10), text.color('#07BD74')],
                                                    children: 'completed',
                                                }}
                                            />)}
                                            {(cancelled) && (<Btn
                                                container={{
                                                    className: 'flex-row items-center justify-center rounded-[6px] p-[0px] bg-white border border-[#F75555]',
                                                    style: [view.wAuto, view.h(24), view.px(10), view.py(0)]
                                                }}
                                                text={{
                                                    className: 'font-semibold',
                                                    style: [text.size(10), text.color('#F75555')],
                                                    children: 'cancelled'
                                                }}
                                            />)}
                                        </Tv>
                                    </Tv>
                                </Tv>

                                {/* Leave a Review, View E-Ticket */}
                                {(completed || paid) && (
                                    <Tv className="w-full flex-row gap-[12px] pt-[12px] border-t border-t-[#EEEEEE]">
                                        {(paid) && (<Btn
                                            container={{
                                                className: `flex-1 flex-row gap-[8px] items-center px-[16px] border-[2px] border-[#73138C] bg-white`,
                                                style: [view.wAuto, view.h(40)],
                                                onPress: cancelBooking
                                            }}
                                            text={{
                                                children: 'Cancel booking',
                                                style: [text.color('#73138C')]
                                            }}
                                        />)}
                                        {(completed) && (<Btn
                                            container={{
                                                className: `flex-1 flex-row gap-[8px] items-center px-[16px] border-[2px] border-[#73138C] bg-white`,
                                                style: [view.wAuto, view.h(40)],
                                                onPress: leaveReview
                                            }}
                                            text={{
                                                children: 'Leave a Review',
                                                style: [text.color('#73138C')]
                                            }}
                                        />)}
                                        <Btn
                                            container={{
                                                className: `flex-1 flex-row gap-[8px] items-center px-[16px] border-[2px] border-[#73138C] bg-[#73138C]`,
                                                style: [view.wAuto, view.h(40)],
                                                onPress: () => viewTicket(ticket)
                                            }}
                                            text={{
                                                children: 'View E-Ticket',
                                                style: [text.color('white')]
                                            }}
                                        />
                                    </Tv>
                                )}
                                {/* Leave a Review, View E-Ticket */}
                            </Tv>
                        )
                    }}
                    ListEmptyComponent={(() => (
                        <Tv className="w-full flex-1 flex-col justify-center items-center gap-[24px]">
                            <Img
                                source={require("@/assets/images/in/tickets/no-tickets.png")}
                                className="w-full h-[287px] m-[20px]"
                            />

                            <Urbanist weight="700" className="text-[#212121] text-[24px] text-center font-bold">
                                Empty Tickets
                            </Urbanist>

                            <Urbanist className="text-[#212121] text-[18px] text-center">
                                Looks like you don't have a ticket yet.
                                Start searching for events now by clicking the button below.
                            </Urbanist>

                            <Pr onPress={() => router.push('/(in)/(tabs)/events')} className="w-auto h-fit">
                                <Urbanist className="text-[#73138C] text-[20px] text-center font-bold px-3">
                                    Find Events
                                </Urbanist>
                            </Pr>
                            <Urbanist className="text-[14px]">or</Urbanist>
                            <Pr onPress={onRefresh} className="w-auto h-fit">
                                <Urbanist className="text-[#73138C] text-[14px] text-center font-bold px-3">
                                    Refresh
                                </Urbanist>
                            </Pr>
                        </Tv>
                    ))}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[view.flexCol, view.gap(10)]}
                    style={[view.wAuto, view.hAuto, view.minH(500), view.maxH(700), view.bg_transparent]}
                />
            )}

            {/* Sheets */}
            <SheetModal
                ref={sheet.ref}
                snapPoints={currentSnapoints}
                allowSwipeDown={true}
                closeOnBackdropPress={true}
            >
                {sheets.review && (<Review onClose={closeSheet} onSubmit={() => {

                }} />)}
                {sheets.cancelBooking && (<CancelBooking onCancel={() => {
                    closeSheet();
                    router.push('/(in)/tickets/cancel-booking')
                }} onClose={closeSheet} />)}
            </SheetModal>
            {/* Sheets */}
        </Tv>
    );
}

export default Upcoming;