import Container from "@/components/shared/container";
import { Tv } from "@/components/shared/view";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import { Ti } from "@/components/shared/text-input";
import Btn from "@/components/shared/btn";
import { Sav } from "@/components/shared/safe-area-view";
import { view } from "@/styles/view";
import WrapperDialog from "@/components/shared/wrapper-dialogue";
import CancelBookingSuccessful from "@/components/in/tickets/modals/cancel-booking-successful";
import { useState } from "react";
import RadioChecked from "@/components/onboarding/signup/svgs/radio-checked";
import RadioUnchecked from "@/components/onboarding/signup/svgs/radio-unchecked";
import VoteChecked from "@/components/in/home/svgs/vote-checked";
import CheckRounded from "@/components/onboarding/setup/svgs/check-rounded";
import { router } from "expo-router";

const reasons = [
    "I have another event, so it collides",
    "I'm sick, can't come",
    "I have an urgent need",
    "I have no transportation to come",
    "I have no friends to come",
    "I want to book another event",
    "I just want to cancel",
].map((reason, index) => ({ reason, id: index + 1 }));

export default function CancelScreen() {
    const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);


    return (
        <Tv className="flex-1 bg-white">
            <Container className="pt-[24px] flex-col gap-[24px]">

                <Urbanist className="text-[#212121] text-[18px] font-medium">
                    Please select the reason for cancellation:
                </Urbanist>

                {/* Divider */}
                <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
                {/* Divider */}

                <Tv className="gap-4">
                    {reasons.map(({ id, reason }, index) => (
                        <Pr onPress={() => setSelectedReasonId(id)} key={index} className="flex-row items-center gap-4">
                            <Tv className="w-[24px] h-[24px] flex-row items-center justify-center rounded-full border-[3px] border-[#73138C]">
                                {(id === selectedReasonId) && (<Tv className="w-[14px] h-[14px] rounded-full bg-[#73138C]" />)}
                            </Tv>
                            <Urbanist className="text-[#212121] text-[18px] font-semibold">{reason}</Urbanist>
                        </Pr>
                    ))}
                </Tv>

                <Urbanist className="text-[#212121] text-[18px] font-semibold">Others</Urbanist>

                <Ti
                    placeholder="Others reason..."
                    className="bg-[#FAFAFA] rounded-xl px-4 py-3 mb-10"
                />

                <Tv className="flex-1" />

                <Tv className="w-full pt-[10px] pb-[24px] bg-white">
                    <Btn
                        container={{
                            onPress: () => setModalOpen(true)
                        }}
                        text={{
                            children: 'Submit'
                        }}
                    />
                </Tv>

            </Container>

            {/* Modals */}
            <WrapperDialog isOpen={modalOpen} onClose={() => setModalOpen(false)} closeOnOverlayClick={false}>
                <CancelBookingSuccessful onClose={() => {
                    setModalOpen(false);
                    router.replace('/(in)/(tabs)/tickets')
                }} />
            </WrapperDialog>
            {/* Modals */}
        </Tv>
    );
}
