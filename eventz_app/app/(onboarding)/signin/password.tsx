import EyeClosed from "@/components/onboarding/signup/svgs/eye-closed";
import EyeOpen from "@/components/onboarding/signup/svgs/eye-open";
import Lock from "@/components/onboarding/signup/svgs/lock";
import Mail from "@/components/onboarding/signup/svgs/mail";
import RememberChecked from "@/components/onboarding/signup/svgs/remember-checked";
import Btn from "@/components/shared/btn";
import { burnt } from "@/components/shared/burnt";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import Kb from "@/components/shared/keyboard";
import { Li } from "@/components/shared/link";
import { Pr } from "@/components/shared/pressable";
import Spinner from "@/components/shared/spinner";
import BackArrow from "@/components/shared/svgs/back-arrow";
import { Tt } from "@/components/shared/text";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import { Auth } from "@/firebase-web/services/auth.service";
import { Db } from "@/firebase-web/services/firestore.service";
import useAuth from "@/hooks/auth/useAuth";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { setAuthState } from "@/state/slices/auth";
import { setAuthPersistState } from "@/state/slices/auth.persist";
import { RootState } from "@/state/state";
import { iUser } from "@/state/types/auth";
import { view } from "@/styles/view";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import { object, string } from "yup";


const Password = () => {
    const { login } = useAuth()
    const dispatch = useAppDispatch();

    const [rememberMe, setRememberMe] = useState(false);
    const [focused, setFocused] = useState({
        email: false,
        password: false
    })
    const [pwdShown, setPwdShown] = useState(false)
    const [signingin, setSigningin] = useState(false)

    const form = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: object({
            email: string()
                .required("Email is required")
                .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    "Invalid Email address"
                ),
            password: string()
                .required("Password is required")
        }),
        onSubmit: async ({ email, password }) => {
            setSigningin(true)

            try {
                const userDb = Db<Partial<iUser>>('user');

                const userExist = await userDb.findOneByField('email', email);

                if (!userExist) {
                    burnt.toast({ title: 'Your account was not found! Check your gmail' })
                    return;
                }

                const passwordMatch = userExist?.hashedPwd === password;

                if (!passwordMatch) {
                    burnt.toast({ title: 'Incorrect password! Try again.' })
                    return;
                }

                const signedin = await Auth.login(email, password);

                if (!signedin?.user) {
                    burnt.toast({ title: 'Error in signing in! Try again.' })
                    return;
                }

                if ((userExist?.profileSetup && Boolean(userExist.profileSetup) == false) || userExist?.profileSetup == undefined) {
                    burnt.toast({ title: 'Please complete your profile setup' });
                    router.replace('/(onboarding)/profile')
                    return;
                }
                if ((userExist?.role && userExist.role === 'organizer') && ((userExist?.businessSetup && Boolean(userExist.businessSetup) === false)) || (userExist?.businessSetup == undefined) && (userExist?.role && userExist.role === 'organizer')) {
                    burnt.toast({ title: 'Please complete your business profile setup' });
                    router.replace('/(onboarding)/business-info')
                    return;
                }

                if (userExist?.interests == undefined || (userExist?.interests && userExist.interests.length < 3)) {
                    burnt.toast({ title: 'Please select your interests to continue' });
                    dispatch(setAuthState({ key: 'signinEmail', value: email }));
                    router.replace('/(onboarding)/interest')
                    return;
                }

                burnt.toast({ title: 'Successfully signed in!' });

                dispatch(setAuthPersistState({ key: 'visitedBefore', value: true }));
                dispatch(setAuthPersistState({ key: 'userToken', value: (signedin?.user as any)?.accessToken || '' }))
                form.resetForm();

                login(userExist as iUser);
                router.replace('/(in)/(tabs)');


            } catch (error) {
                console.log('errror_msg', (error as any)?.message)
            } finally {
                setSigningin(false)
            }

        }
    })

    return (
        <Tv className="flex-1 bg-white">
            <Kb className="w-full h-full">
                <Container className="w-full h-full min-h-full justify-around py-10">

                    {/* Illustration */}
                    <Tv className="items-center mt-6">
                        <Img
                            source={require("@/assets/images/icons/android.png")}
                            className="w-[77px] h-[100px]"
                            resizeMode="contain"
                        />
                    </Tv>

                    {/* Title */}
                    <Tt className="text-center text-[#212121] text-[28px] font-bold mt-6">
                        Login to Your Account
                    </Tt>

                    {/* Form */}
                    <Tv className="flex-col gap-[24px]">
                        {/* Feilds */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.email && form.touched.email) ? 'border-red-500' : focused.email ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Mail color={(form.values.email == '') ? '#9E9E9E' : '#212121'} />
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ email: true, password: false })}
                                onBlur={() => setFocused({ email: false, password: false })}
                            >
                                <InputField
                                    value={form.values.email}
                                    // onChangeText={() => form.handleChange('email')}
                                    onChangeText={(text) => {
                                        form.setFieldValue('email', text)
                                        dispatch(setAuthState({ key: 'signinEmail', value: text }))
                                    }}
                                    onBlur={() => form.handleBlur('email')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Email" />
                            </Input>
                        </Tv>

                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.password && form.touched.password) ? 'border-red-500' : focused.password ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Lock color={(form.values.password == '') ? '#9E9E9E' : '#212121'} />
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ email: false, password: true })}
                                onBlur={() => setFocused({ email: false, password: false })}
                            >
                                <InputField
                                    value={form.values.password}
                                    onChangeText={(text) => form.setFieldValue('password', text)}
                                    onBlur={() => form.handleBlur('password')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Password"
                                    type={pwdShown ? 'text' : 'password'}
                                />
                            </Input>
                            <Pr onPress={() => setPwdShown(!pwdShown)} className="h-full flex-row items-center px-[3px]">
                                {pwdShown && (<EyeClosed color={form.values.password == '' ? '#9E9E9E' : '#212121'} />)}
                                {!pwdShown && (<EyeOpen color={form.values.password == '' ? '#9E9E9E' : '#212121'} />)}
                            </Pr>
                        </Tv>
                        {/* Feilds */}

                        {/* Remember me */}
                        <Tv className="w-full flex-row items-center justify-center gap-[12px]">
                            <Pr onPress={() => setRememberMe(!rememberMe)}>
                                {rememberMe ? (<RememberChecked />) : (<Tv className="w-[24px] h-[24px] bg-white border-[4px] border-[#73138C] rounded-[8px]" />)}
                            </Pr>

                            <Urbanist onPress={() => setRememberMe(!rememberMe)} weight="600" className="font-semibold text-[#212121] text-[18px]">Remember me</Urbanist>
                        </Tv>
                        {/* Remember me */}

                        {/* Primary CTA */}
                        <Btn
                            leftIcon={signingin ? < Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                            container={{
                                onPress: () => !signingin && form.handleSubmit(),
                                className: "h-[52px] rounded-[100px]"
                            }}
                            text={{ children: "Sign in", className: "text-[15px]" }}
                        />

                        <Urbanist weight="600" className="font-semibold text-center text-[#73138C] text-[16px]">Forgot the password?</Urbanist>
                    </Tv>
                    {/* Form */}

                    <Tv className="w-full flex-col gap-[20px]">
                        {/* Divider */}
                        <Tv className="flex-row items-center">
                            <Tv className="flex-1 h-[1px] bg-gray-700" />
                            <Tt className="text-gray-400 mx-3">or continue with</Tt>
                            <Tv className="flex-1 h-[1px] bg-gray-700" />
                        </Tv>

                        {/* Social buttons */}
                        <Tv className="flex flex-row justify-around gap-[20px] px-[38px]">

                            {[
                                { label: "Facebook", icon: require('@/assets/images/onboarding/facebook.png') },
                                { label: "Google", icon: require('@/assets/images/onboarding/google.png') },
                                { label: "Apple", icon: require('@/assets/images/onboarding/apple.png') },
                            ].map(({ icon, label: item }, index) => (
                                <Pr
                                    key={index}
                                    onPress={() => burnt.toast({ title: 'Coming soon!' })}
                                    className="flex-1 h-[52px] bg-white rounded-xl flex-row items-center justify-center border-[1px] border-[#EEEEEE]"
                                >
                                    <Img
                                        source={icon}
                                        className="w-6 h-6"
                                    />
                                </Pr>
                            ))}

                        </Tv>
                    </Tv>

                    {/* Footer */}
                    <Tv className="flex-row justify-center mt-6">
                        <Tt className="text-gray-400">Don't have an account? </Tt>
                        <Li href="/(onboarding)/signup">
                            <Tt className="text-[#9D4EDD] font-semibold">Sign up</Tt>
                        </Li>
                    </Tv>

                </Container>
            </Kb>
        </Tv>
    );
}

export default Password;