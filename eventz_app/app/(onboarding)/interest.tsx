import React, { useState } from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

import Container from "@/components/shared/container";
import { Tv } from "@/components/shared/view";
import { Tt } from "@/components/shared/text";
import Btn from "@/components/shared/btn";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { text } from "@/styles/text";
import { eIntersts, iUser } from "@/state/types/auth";
import { burnt } from "@/components/shared/burnt";
import { Db } from "@/firebase-web/services/firestore.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import Spinner from "@/components/shared/spinner";
import { view } from "@/styles/view";
import useAuth from "@/hooks/auth/useAuth";
import { Auth } from "@/firebase-web/services/auth.service";
import { setAuthPersistState } from "@/state/slices/auth.persist";

// const INTERESTS = [
//     { id: "music", label: "Music", emoji: require('@/assets/images/onboarding/setup/interest/music.png') },
//     { id: "art", label: "Art", emoji: require('@/assets/images/onboarding/setup/interest/art.png') },
//     { id: "banking", label: "Banking", emoji: require('@/assets/images/onboarding/setup/interest/banking.png') },
//     { id: "reading", label: "Reading", emoji: require('@/assets/images/onboarding/setup/interest/reading.png') },
//     { id: "health", label: "Health", emoji: require('@/assets/images/onboarding/setup/interest/health.png') },
//     { id: "business", label: "Business", emoji: require('@/assets/images/onboarding/setup/interest/business.png') },
// ];
const interestIconMap: Record<eIntersts, any> = {
    [eIntersts.MUSIC]: require("@/assets/images/onboarding/setup/interest/music.png"),
    [eIntersts.ART]: require("@/assets/images/onboarding/setup/interest/art.png"),
    // [eIntersts.TECHNOLOGY]: require("@/assets/images/onboarding/setup/interest/technology.png"),
    // [eIntersts.SPORTS]: require("@/assets/images/onboarding/setup/interest/sports.png"),
    // [eIntersts.EDUCATION]: require("@/assets/images/onboarding/setup/interest/education.png"),
    [eIntersts.HEALTH]: require("@/assets/images/onboarding/setup/interest/health.png"),
    [eIntersts.BUSINESS]: require("@/assets/images/onboarding/setup/interest/business.png"),
    // [eIntersts.FOOD]: require("@/assets/images/onboarding/setup/interest/food.png"),
    // [eIntersts.TRAVEL]: require("@/assets/images/onboarding/setup/interest/travel.png"),
    // [eIntersts.FASHION]: require("@/assets/images/onboarding/setup/interest/fashion.png"),
    // [eIntersts.FILM]: require("@/assets/images/onboarding/setup/interest/film.png"),
    // [eIntersts.GAMING]: require("@/assets/images/onboarding/setup/interest/gaming.png"),
    // [eIntersts.LITERATURE]: require("@/assets/images/onboarding/setup/interest/literature.png"),
    // [eIntersts.SCIENCE]: require("@/assets/images/onboarding/setup/interest/science.png"),
    // [eIntersts.NATURE]: require("@/assets/images/onboarding/setup/interest/nature.png"),
    // [eIntersts.POLITICS]: require("@/assets/images/onboarding/setup/interest/politics.png"),
    // [eIntersts.RELIGION]: require("@/assets/images/onboarding/setup/interest/religion.png"),
    // [eIntersts.ENVIRONMENT]: require("@/assets/images/onboarding/setup/interest/environment.png"),
    // [eIntersts.PHOTOGRAPHY]: require("@/assets/images/onboarding/setup/interest/photography.png"),
    // [eIntersts.THEATER]: require("@/assets/images/onboarding/setup/interest/theater.png"),
    [eIntersts.BANKING]: require("@/assets/images/onboarding/setup/interest/banking.png"),
    [eIntersts.READING]: require("@/assets/images/onboarding/setup/interest/reading.png"),
};

export const INTERESTS = Object.values(eIntersts).map((interest) => ({
    id: interest,
    label: interest,
    emoji: interestIconMap[interest],
}));


export default function Interest() {
    const router = useRouter();
    const { signinEmail, role } = useAppSelector((s: RootState) => s.auth)
    const { login, setVisitedBefore, setUserToken } = useAuth();
    const dispatch = useAppDispatch();


    const [selected, setSelected] = useState<string[]>([]);
    const [addingInterests, setAddingInterests] = useState(false);

    const toggleInterest = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (Number(selected.length) < 3) {
            burnt.toast({ title: 'Please select at least 3 interests to continue.' });
            return;
        }

        try {
            setAddingInterests(true);

            const userDb = Db<Partial<iUser>>('user');

            const userExist = await userDb.findOneByField('email', signinEmail as string);

            if (!userExist) {
                burnt.toast({ title: 'Your account was not found. Please register first.' })
                return;
            }

            await userDb.update(userExist.id as string, {
                interests: selected.map((interest) => interest)
            })

            const user = await userDb.findOneByField('email', signinEmail as string) as iUser;

            const userLoggedin = await Auth.login(user?.email, user?.hashedPwd as string);

            login(user as iUser);
            setVisitedBefore(true);
            setUserToken(userLoggedin?.user?.refreshToken as string);

            // burnt.toast({ title: 'Profile setup completed successfully!' })

            login(user ? { ...user, profileSetup: true } as iUser : { ...userExist, profileSetup: true } as iUser)

            burnt.toast({ title: 'All done!' })
            setAddingInterests(false);

            setAddingInterests(false);
            router.replace("/(in)/(tabs)");
        } catch (error) {
            setAddingInterests(false);
            console.log('Error adding interests to user profile', error);
            burnt.toast({ title: 'An error occurred! Please try again.' });
        }
    }

    return (
        <Tv className="flex-1 bg-white">
            <Container className="pt-4">
                {/* Header */}
                <Tv className="mb-6">
                    <Urbanist
                        weight="400"
                        className="text-[14px] text-gray-400 leading-5"
                    >
                        Customize your event recommendation based on your preferences. You
                        can always do it later.
                    </Urbanist>
                </Tv>

                {/* Interests */}
                <Tv className="flex-row flex-wrap gap-4">
                    {INTERESTS.map((item) => {
                        const active = selected.includes(item.id);

                        return (
                            <Pressable
                                key={item.id}
                                onPress={() => toggleInterest(item.id)}
                                className={`px-5 py-3 rounded-full flex-row items-center border-[1px] ${active ? "bg-[#FCF1FF] border-[#9114B1]" : "bg-[#FEFCFF] border-[#FEFCFF]"
                                    }`}
                            >
                                <Img className="w-[24px] h-[24px]" source={item.emoji} />

                                <Urbanist
                                    weight="500"
                                    className={`text-[14px] ${active ? "text-[#9114B1]" : ""
                                        }`}
                                >
                                    {item.label}
                                </Urbanist>
                            </Pressable>
                        );
                    })}
                </Tv>

                {/* Footer Actions */}
                <Tv className="flex-row items-center gap-4 mt-[28px]">
                    {/* Skip */}
                    <Btn
                        container={{
                            onPress: () => router.replace("/(in)/(tabs)"),
                            className:
                                "flex-1 h-[46px] shadow-lg shadow-[#5A189A] bg-[#EEDDFF]",
                        }}
                        text={{
                            children: "Skip",
                            style: [text.color('#73138C')]
                        }}
                    />

                    {/* Continue */}
                    <Btn
                        leftIcon={addingInterests ? < Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                        container={{
                            onPress: () => !addingInterests && handleSubmit(),
                            className:
                                "flex-1 h-[46px] shadow-lg shadow-[#5A189A]",
                        }}
                        text={{
                            children: "Continue",
                        }}
                    />
                </Tv>
            </Container>
        </Tv>
    );
}
