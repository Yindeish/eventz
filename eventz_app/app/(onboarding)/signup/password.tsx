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
import { EyeIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Auth } from "@/firebase-web/services/auth.service";
import { Db } from "@/firebase-web/services/firestore.service";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { setAuthState } from "@/state/slices/auth";
import { setAuthPersistState } from "@/state/slices/auth.persist";
import { RootState } from "@/state/state";
import { iUser } from "@/state/types/auth";
import { view } from "@/styles/view";
import { router } from "expo-router";
import { useFormik } from 'formik';
import { useState } from "react";
import { object, string } from 'yup';


const Password = () => {
    const { role } = useAppSelector((s: RootState) => s.auth);
    const dispatch = useAppDispatch();

    const [rememberMe, setRememberMe] = useState(false);
    const [focused, setFocused] = useState({
        email: false,
        password: false
    })
    const [pwdShown, setPwdShown] = useState(false)
    const [signingUp, setSigningup] = useState(false)

    const form = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: object({
            email: string()
                .required("Email is required")
                .min(6)
                .max(30)
                .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    "Invalid Email address"
                ),
            password: string()
                .required("Password is required")
                .min(6, "Password must be at leat 6 digits")
                .max(25, "Max digits exceeded"),
        }),
        onSubmit: async ({ email, password }) => {
            setSigningup(true)

            try {
                const userDb = Db<Partial<iUser>>('user');

                const userExist = await userDb.findOneByField('email', email);

                if (userExist) {
                    burnt.toast({ title: 'Email is taken! User another one.' })
                    return;
                }

                const signedUp = await Auth.register(email, password);

                if (!signedUp?.user) {
                    burnt.toast({ title: 'Error in signing up! Try again.' })
                    return;
                }

                const userCreated = await userDb.create({
                    email: email.trim(), hashedPwd: password.trim(),
                    uId: signedUp.user?.uid, role
                })

                if (!userCreated?.id) {
                    burnt.toast({ title: 'Error in signing up! Try again.' })
                    return;
                }

                await userDb.update(userCreated.id, { id: userCreated.id });

                burnt.toast({ title: 'Successfully signed up! Set up your profile' })
                form.resetForm();

                dispatch(setAuthPersistState({ key: 'visitedBefore', value: true }))
                setSigningup(false)
                router.replace('/(onboarding)/profile')

            } catch (error) {
                console.log('errror_msg', (error as any)?.message)
                setSigningup(false)
            } finally {
                setSigningup(false)
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
                        Create New Account
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
                        {/* <Tv className="w-full flex-row items-center justify-center gap-[12px]">
                            <Pr onPress={() => setRememberMe(!rememberMe)}>
                                {rememberMe ? (<RememberChecked />) : (<Tv className="w-[24px] h-[24px] bg-white border-[4px] border-[#73138C] rounded-[8px]" />)}
                            </Pr>

                            <Urbanist onPress={() => setRememberMe(!rememberMe)} weight="600" className="font-semibold text-[#212121] text-[18px]">Remember me</Urbanist>
                        </Tv> */}
                        {/* Remember me */}

                        {/* Primary CTA */}
                        <Btn
                            leftIcon={signingUp ? < Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                            container={{
                                onPress: () => !signingUp && form.handleSubmit(),
                                className: "h-[52px] rounded-[100px]"
                            }}
                            text={{ children: "Sign up", className: "text-[15px]" }}
                        />
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
                        <Tt className="text-gray-400">Already have an account? </Tt>
                        <Li href="/(onboarding)/signin">
                            <Tt className="text-[#9D4EDD] font-semibold">Sign in</Tt>
                        </Li>
                    </Tv>

                </Container>
            </Kb>
        </Tv>
    );
}

export default Password;