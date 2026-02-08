import { Tv } from "@/components/shared/view";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import Btn from "@/components/shared/btn";

type Props = {
  onCancel: () => void;
  onClose: () => void;
};

export default function CancelBooking({ onCancel, onClose }: Props) {
  return (
    <Tv className="w-full bg-white rounded-t-[32px]">
      <Container className="pt-[28px] pb-[36px]">

        {/* Title */}
        <Urbanist className="text-[26px] font-bold text-[#212121] text-center mb-[16px]">
          Cancel Booking
        </Urbanist>

        <Tv className="w-full h-[1px] bg-[#EAEAEA] mb-[32px]" />

        {/* Question */}
        <Urbanist className="text-[20px] font-semibold text-[#212121] text-center mb-[36px]">
          Are you sure you want to cancel{"\n"}this event?
        </Urbanist>

        {/* Buttons */}
        <Tv className="flex-row gap-[16px]">
          <Btn
            container={{
              onPress: onClose,
              className: "flex-1 bg-[#F3D1FF]",
            }}
            text={{
              children: "No, Don’t Cancel",
              className: "text-[#7B1FA2]",
            }}
          />

          <Btn
            container={{
              onPress: onCancel,
              className: "flex-1",
            }}
            text={{
              children: "Yes, Cancel",
            }}
          />
        </Tv>

      </Container>
    </Tv>
  );
}
