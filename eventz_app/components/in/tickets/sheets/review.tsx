import { useState } from "react";
import { Tv } from "@/components/shared/view";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import Btn from "@/components/shared/btn";
import { Ti } from "@/components/shared/text-input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { view } from "@/styles/view";
import StarFilled from "../svg/star-filled";
import Star from "../svg/star";

const stars = [1, 2, 3, 4, 5];

type Props = {
    onSubmit: () => void;
    onClose: () => void;
};

export default function Review({ onSubmit, onClose }: Props) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    return (
        <Tv className="flex-1 bg-white">
            <Container className="pt-[32px] pb-[40px]">

                {/* Header */}
                <Urbanist className="text-[26px] font-bold text-[#212121] text-center mb-[16px]">
                    Leave a Review
                </Urbanist>

                <Tv className="w-full h-[1px] bg-[#EAEAEA] mb-[32px]" />

                {/* Question */}
                <Urbanist className="text-[18px] font-semibold text-[#212121] text-center mb-[24px]">
                    How was your experience with{"\n"}Art & Painting Training?
                </Urbanist>

                {/* Stars */}
                <Tv className="flex-row justify-center gap-[16px] mb-[28px]">
                    {stars.map((s) => (
                        <Pr key={s} onPress={() => setRating(s)}>

                            {(rating >= s) ? (<StarFilled />) : (<Star />)}
                        </Pr>
                    ))}
                </Tv>

                <Tv className="w-full h-[1px] bg-[#EAEAEA] mb-[24px]" />

                {/* Write Review */}
                <Urbanist className="text-[18px] font-bold text-[#212121] mb-[12px]">
                    Write Your Review
                </Urbanist>

                <Tv className="w-full bg-[#F7F7F7] rounded-[16px] p-[16px] mb-[28px]">
                    <Textarea
                        size="md"
                        isReadOnly={false}
                        isInvalid={false}
                        isDisabled={false}
                        className="w-full bg-[#FAFAFA] rounded-[16px] border-none"
                        style={[view.borderWidth(0)]}
                    >
                        <TextareaInput className="p-[20px]" placeholder="Brief Bio About You..." />
                    </Textarea>
                </Tv>

                <Tv className="w-full h-[1px] bg-[#EAEAEA] mb-[32px]" />

                {/* Buttons */}
                <Tv className="flex-row gap-[16px]">
                    <Btn
                        container={{
                            onPress: onClose,
                            className: "flex-1 bg-[#F3D1FF]",
                        }}
                        text={{
                            children: "Maybe Later",
                            className: "text-[#7B1FA2]",
                        }}
                    />

                    <Btn
                        container={{
                            onPress: onSubmit,
                            className: "flex-1",
                        }}
                        text={{
                            children: "Submit",
                        }}
                    />
                </Tv>
            </Container>
        </Tv>
    );
}
