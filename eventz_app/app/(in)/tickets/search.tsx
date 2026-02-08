import Container from "@/components/shared/container";
import { Tv } from "@/components/shared/view";
import { Ti } from "@/components/shared/text-input";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Sav } from "@/components/shared/safe-area-view";
import { Img } from "@/components/shared/img";
import { useState } from "react";
import { FlatList, ImageSourcePropType } from "react-native";
import { view } from "@/styles/view";
import { text } from "@/styles/text";
import Btn from "@/components/shared/btn";
import Location from "@/components/in/events/svg/location";
import { Pr } from "@/components/shared/pressable";
import { router } from "expo-router";
import { postsArr } from "@/constants/posts";
import { useSheetRef } from "@/components/shared/sheet";

export default function Search() {
  const sheet = useSheetRef();


  const [tickets, setTickets] = useState([1]);
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

  const viewTicket = () => {
    router.push('/(in)/tickets/ticket')
  }

  const closeSheet = () => {
    sheet.close();
    setSheets({
      cancelBooking: false,
      review: false
    })
  }


  return (
    <Tv className="flex-1 bg-white">
      <Container className="pt-[24px] flex-col gap-[24px] items-center">
        {(tickets.length < 1) && (<Urbanist className="text-[#212121] text-[20px] font-bold">0 found</Urbanist>)}

        {(tickets.length < 1) ? (
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
        ) : (
          <Tv className="w-full flex-1">
            <FlatList
              data={postsArr.concat(postsArr)}
              renderItem={({ index, item: ticket }) => {
                const paid = index <= 3;
                const completed = index > 3 && index <= 6;
                const cancelled = index > 6;

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
                          National Music Festival
                        </Urbanist>
                        <Urbanist className="text-[#73138C] text-[14px] font-semibold">
                          Mon, Dec 24 • 18.00 - 23.00 PM
                        </Urbanist>
                        <Tv className="w-full flex-row items-center gap-[4px]">
                          <Location width={16} height={16} />
                          <Urbanist className="text-[#616161] text-[14px] font-medium">
                            New Avenue, ...
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
                            onPress: viewTicket
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
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[view.flexCol, view.gap(10)]}
              style={[view.wAuto, view.bg_transparent]}
            />
          </Tv>
        )}

      </Container>
    </Tv>
  );
}
