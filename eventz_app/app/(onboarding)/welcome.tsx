import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Tv } from "@/components/shared/view";
import useAuth from "@/hooks/auth/useAuth";
import { router } from "expo-router";
import { useEffect } from "react";

const Welcome = () => {

    useEffect(() => {
        setTimeout(() => {
            router.replace('/(onboarding)/walk-through')
        }, 750)
    })


    return (
        <Tv className="flex-1 relative">
            <Img className="flex-1" source={require('@/assets/images/onboarding/welcome.png')} />

            <Tv className="w-full h-full flex-col items-center justify-end gap-[28px] px-[24px] pb-[48px] absolute top-0 left-0 z-10">
                <Urbanist weight="700" className="text-white text-center text-[48px]">Welcome to Easevent! 👋</Urbanist>
                <Urbanist weight="500" className="text-white text-center text-[18px]">
                    The best social event discovering and online ticketing application in this century.
                </Urbanist>
            </Tv>
        </Tv>
    );
}

export default Welcome;