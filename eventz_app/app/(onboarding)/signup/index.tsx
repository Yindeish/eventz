import RadioChecked from "@/components/onboarding/signup/svgs/radio-checked";
import Btn from "@/components/shared/btn";
import { burnt } from "@/components/shared/burnt";
import Container from "@/components/shared/container";
import { Img } from "@/components/shared/img";
import { Li } from "@/components/shared/link";
import { Pr } from "@/components/shared/pressable";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tt } from "@/components/shared/text";
import { Tv } from "@/components/shared/view";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogHeader
} from '@/components/ui/alert-dialog';
import { Auth } from "@/firebase-web/services/auth.service";
import useGoogleId from "@/hooks/clientIds/use-google-id";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { setAuthState } from "@/state/slices/auth";
import { RootState } from "@/state/state";
import { tRole } from "@/state/types/auth";
import { view } from "@/styles/view";
import { router } from "expo-router";
import { useState } from "react";


export type tMethod = 'google' | 'facebook' | 'apple' | 'password';

export default function Index() {
    const { role } = useAppSelector((s: RootState) => s.auth);
    const dispatch = useAppDispatch();

    const [signupMethod, setSignupMethod] = useState<tMethod | null>(null);
    const [modalVisible, setModalVisible] = useState(false)
    // const [option, setOption] = useState<tOption>('attendee');
    const [signinginUp, setSigninginUp] = useState(false);


    const openOptionModal = (method: tMethod) => {
        setSignupMethod(method);
        setModalVisible(true)
    }

    const selectOption = (option: tRole) => {
        dispatch(setAuthState({ key: 'role', value: option }))
    }

    const {
        getGoogleIdToken,
        gettingToken,
    } = useGoogleId({
        onSuccess: async (idToken) => {
            console.log({ idToken });
            await Auth.loginWithGoogle(idToken);
        },
        onFailure: (err) => {
            if (err?.type === 'dismiss') burnt.toast({ title: 'You cancelled Google authentication' })
            console.log({ err });
        },
    });

    const googleSignup = async () => {
        setSigninginUp(true);
        await getGoogleIdToken();
        setSigninginUp(false);
    };


    return (
        <Tv className="flex-1 bg-white">
            <Container className="flex-1 justify-around py-10">

                {/* Illustration */}
                <Tv className="items-center mt-6">
                    <Img
                        source={require("@/assets/images/onboarding/signup/get-you-started.png")}
                        className="w-[237px] h-[200px]"
                        resizeMode="contain"
                    />
                </Tv>

                {/* Title */}
                <Tt className="text-center text-[#212121] text-[28px] font-bold mt-6">
                    Let’s get you started
                </Tt>

                {/* Social buttons */}
                <Tv className="flex-col gap-[16px]">

                    {[
                        // { label: "Google", icon: require('@/assets/images/onboarding/google.png'), action: googleSignup, loading: signinginUp || gettingToken },
                        { label: "Google", icon: require('@/assets/images/onboarding/google.png'), action: () => openOptionModal('google'), loading: signinginUp || gettingToken },
                        { label: "Facebook", icon: require('@/assets/images/onboarding/facebook.png'), action: () => burnt.toast({ title: 'Coming soon!' }), loading: false },
                        { label: "Apple", icon: require('@/assets/images/onboarding/apple.png'), action: () => burnt.toast({ title: 'Coming soon!' }), loading: false },
                    ].map(({ icon, label: item, action, loading }, index) => (
                        <Pr
                            key={index}
                            onPress={action}
                            disabled={loading}
                            className="w-full h-[52px] bg-white rounded-xl flex-row items-center justify-center border-[1px] border-[#EEEEEE]"
                            style={[view.opacity(loading ? 0.5 : 1)]}
                        >
                            <Img
                                source={icon}
                                className="w-6 h-6 mr-3"
                            />
                            <Tt className="text-[15px] font-semibold text-black">
                                Continue with {item}
                            </Tt>
                        </Pr>
                    ))}

                    {/* Divider */}
                    <Tv className="flex-row items-center">
                        <Tv className="flex-1 h-[1px] bg-gray-700" />
                        <Tt className="text-gray-400 mx-3">or</Tt>
                        <Tv className="flex-1 h-[1px] bg-gray-700" />
                    </Tv>

                </Tv>

                {/* Primary CTA */}
                <Btn
                    container={{
                        onPress: () => openOptionModal('password'),
                        className: "h-[52px] rounded-[100px]"
                    }}
                    text={{ children: "Sign up with password", className: "text-[15px]" }}
                />

                {/* Footer */}
                <Tv className="flex-row justify-center mt-6">
                    <Tt className="text-gray-400">Have an account? </Tt>
                    <Li href="/(onboarding)/signin">
                        <Tt className="text-[#9D4EDD] font-semibold">Sign in</Tt>
                    </Li>
                </Tv>

            </Container>

            {/* Modals */}
            <AlertDialog isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent className="p-0 pt-0 rounded-[20px]">
                    <AlertDialogHeader>
                        <AlertDialogCloseButton />
                    </AlertDialogHeader>
                    <AlertDialogBody className="p-0" style={view.p0}>
                        <Tv className="w-full flex-col gap-[32px] bg-white pt-[24px] px-[23px] pb-[48px]">
                            <Tt className="text-center text-[#212121] text-[20px] font-bold mt-6">
                                How Would You Like To Join{'\n'} Easevent?
                            </Tt>

                            <Tv className="w-full flex-col gap-[20px]">
                                {[
                                    { label: 'Attendee', value: 'attendee' },
                                    { label: 'Event Organizer', value: 'event-organizer' },
                                ].map(({ label, value }, index) => (
                                    <Pr
                                        key={index}
                                        onPress={() => selectOption(value as tRole)}
                                        className="w-full h-[52px] bg-white rounded-xl flex-row items-center gap-[12px] px-[20px] border-[1px] border-[#EEEEEE]"
                                    >
                                        {(role === value) ? (<RadioChecked />) : (<Tv className="w-[18px] h-[18px] border-[2px] border-[#9E9E9E] bg-white rounded-full" />)}
                                        <Tt className={`text-[14px] font-semibold ${(role === value) ? 'text-[#212121] font-semibold' : 'text-[#9E9E9E]'}`}>
                                            {label}
                                        </Tt>
                                    </Pr>
                                ))}
                            </Tv>

                            <Btn
                                container={{
                                    onPress: () => {
                                        if (signupMethod == 'google') {
                                            googleSignup()
                                            return;
                                        }

                                        setModalVisible(false)
                                        router.push("/(onboarding)/signup/password")
                                    },
                                    className: "h-[52px] rounded-[100px]"
                                }}
                                text={{ children: "Continue", className: "text-[15px]" }}
                            />

                        </Tv>
                    </AlertDialogBody>
                    {/* <AlertDialogFooter /> */}
                </AlertDialogContent>
            </AlertDialog>
            {/* Modals */}
        </Tv>
    );
}
