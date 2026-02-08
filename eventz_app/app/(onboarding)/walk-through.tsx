import Btn from "@/components/shared/btn";
import { Img } from "@/components/shared/img";
import { Sav } from "@/components/shared/safe-area-view";
import { Tt } from "@/components/shared/text";
import { Tv } from "@/components/shared/view";
import { img } from "@/styles/img";
import { view } from "@/styles/view";
import { router } from "expo-router";
import { useRef, useState } from "react";
import PagerView from 'react-native-pager-view';

const WalkThrough = () => {
    const pagerRef = useRef<null | PagerView>(null)

    const onboardingData = [
        {
            title: "Grab all events now only in your hands",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
            image: require("@/assets/images/onboarding/walk-through/slide-1.png"),
        },
        {
            title: "Easy payment & fast event ticketing",
            description: "Experience seamless and secure payment processing with real-time ticket delivery.",
            image: require("@/assets/images/onboarding/walk-through/slide-2.png"),
        },
        {
            title: "Share photos and reactions from events",
            description: "Keep track of all your tickets, bookings, and upcoming events effortlessly.",
            image: require("@/assets/images/onboarding/walk-through/slide-3.png"),
        },
    ]

    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < (onboardingData.length - 1)) {
            setCurrentStep(currentStep + 1)
            pagerRef?.current?.setPage(currentStep + 1)
        } else {
            router.push("/signup")
        }
    }

    return (
        <Sav className="flex-1 bg-[#fafafa]">
            <Tv className="flex-1 items-center justify-between">
                {/* Image Section with decorative circles */}
                <Tv className="flex-1 items-center justify-center w-full relative">
                    <PagerView
                        ref={pagerRef}
                        style={[view.wFull, view.hFull]}
                        initialPage={currentStep}
                        onPageSelected={({ nativeEvent: { position } }) => {
                            setCurrentStep(position)
                        }}>
                        {onboardingData.map(({ description, image, title }, index) => (
                            <Tv className="flex-1 w-full h-full pt-[24px] px-[24px]" key={index}>
                                <Img className="flex-1 w-full h-full" style={[img.object('contain')]} source={image} />
                            </Tv>
                        ))}
                    </PagerView>
                </Tv>

                {/* Content Section */}
                <Tv className="w-full bg-white items-center gap-[16px] shadow-sm rounded-tr-[60px] rounded-tl-[60px] pt-[36px] pb-[48px] px-[24px] mt-[-30px]">
                    <Tt className="text-[28px] font-bold text-[#5A189A] text-center leading-[36px]">{onboardingData[currentStep]?.title}</Tt>

                    <Tt className="text-[14px] text-[#64748B] text-center leading-[22px] px-[8px]">{onboardingData[currentStep]?.description}</Tt>

                    {/* Pagination Dots */}
                    <Tv className="flex-row gap-[8px] items-center justify-center mt-[24px]">
                        {Array.from({ length: onboardingData.length }).map((_, index) => (
                            <Tv
                                className={`h-[8px] rounded-full ${index === currentStep ? "w-[32px] bg-[#5A189A]" : "w-[8px] bg-[#E2E8F0]"
                                    }`} key={index} />
                        ))}
                    </Tv>

                    {/* Next Button */}
                    <Btn
                        container={{
                            onPress: handleNext,
                            className: "mt-[24px] h-[56px] rounded-[28px]",
                        }}
                        text={{
                            children: currentStep === (onboardingData.length - 1) ? "Get Started" : "Next",
                            className: "text-[16px]",
                        }}
                    />
                </Tv>
            </Tv>
        </Sav >
    );
}

export default WalkThrough;