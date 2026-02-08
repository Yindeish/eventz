import Container from "@/components/shared/container";
import { Tv } from "@/components/shared/view";
import Urbanist from "@/components/shared/fonts/urbanist";
import Btn from "@/components/shared/btn";
import { Sav } from "@/components/shared/safe-area-view";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { view } from "@/styles/view";
import { Ts } from "@/components/shared/scroll-view";
import { useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import { useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import CaptureScreen from "@/components/in/capture-screen";
import useShare from "@/hooks/use-media-share";
import { useRef } from "react";
import { burnt } from "@/components/shared/burnt";

export default function Ticket() {
    const { currentTicket } = useAppSelector((s: RootState) => s.ticket);
    const { ticketId } = useLocalSearchParams();
    const viewRef = useRef<number | React.ReactInstance | React.RefObject<unknown>>(null)
    const { handleShare } = useShare({ viewRef })



    return (
        <Sav className="flex-1 bg-white">
            <Container className="pt-[24px] flex-col gap-[24px]">
                <Tv className="w-full flex-1 flex-col gap-[24px]">
                    <CaptureScreen style={[view.wFull, view.hFull]} ref={viewRef as any}>
                        <Tv className="w-full flex-1 bg-white flex-col gap-[24px]">
                            <Ts>
                                {/* <Img
                            source={require("@/assets/images/in/tickets/qr-code.png")}
                            className="w-full h-[380px]"
                        /> */}
                                <Tv className="w-full h-[380px] p-2">
                                    <QRCode
                                        value={`${ticketId}`}
                                        size={380}
                                    />
                                </Tv>

                                <Tv className="w-full flex-col gap[24px] p-[24px]">
                                    {/* <Info label="Event" value="National Music Festival" /> */}
                                    <Info label="Event" value={currentTicket?.event?.name as string} />
                                    <Info label="Date and Hour" value={`${currentTicket?.event?.startDate} • ${currentTicket?.event?.time} - ${currentTicket?.event?.endDate}`} />
                                    <Info label="Event Location" value={currentTicket?.event?.location as string} />
                                    <Info label="Event Organizer" value={currentTicket?.event?.organizer?.userName as string} />
                                </Tv>
                            </Ts>
                        </Tv>
                    </CaptureScreen>
                </Tv>

                <Tv className="w-full pt-[10px] px-[10px] pb-[24px] bg-white">
                    <Pr onPress={() => handleShare({
                        onShared: () => {
                            burnt.toast({ title: 'Your ticket was shared' });
                        }
                    })} className="w-full h-[58px] flex-row items-center justify-center bg-[#73138C] rounded-full" style={[view.shadowLg]}>
                        <Urbanist className="text-white text-[16px] font-bold">
                            {/* Download Ticket */}
                            Share Ticket
                        </Urbanist>
                    </Pr>
                </Tv>
            </Container>
        </Sav>
    );
}

const Info = ({ label, value }: { label: string; value: string }) => (
    <Tv>
        <Urbanist className="text-[#616161] text-[12px]">{label}</Urbanist>
        <Urbanist className="text-[#212121] text-[18px] font-bold">
            {value}
        </Urbanist>
    </Tv>
);
