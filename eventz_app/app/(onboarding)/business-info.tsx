import Calendar from "@/components/onboarding/setup/svgs/calendar";
import Edit from "@/components/onboarding/setup/svgs/edit";
import Btn from "@/components/shared/btn";
import Container from "@/components/shared/container";
import { Img } from "@/components/shared/img";
import Kb from "@/components/shared/keyboard";
import { Pr } from "@/components/shared/pressable";
import { Tt } from "@/components/shared/text";
import { Ti } from "@/components/shared/text-input";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import { view } from "@/styles/view";
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import ChevronDown from "@/components/onboarding/setup/svgs/chevron-down";
import Urbanist from "@/components/shared/fonts/urbanist";
import CaretDown from "@/components/onboarding/setup/svgs/caret-down";
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { useEffect, useState } from "react";
import { object, string } from 'yup';
import { useFormik } from "formik";
import usePopupMenu from "@/hooks/use-popup-menu";
import { DropMenu } from "@/components/shared/popup-menu";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import { useImagePicker } from "@/hooks/file/use-image-picker";
import CloudinaryServices from "@/cloudinary/cloudinary.services";
import { burnt } from "@/components/shared/burnt";
import { Db } from "@/firebase-web/services/firestore.service";
import { iUser } from "@/state/types/auth";
import { setAuthPersistState } from "@/state/slices/auth.persist";
import Spinner from "@/components/shared/spinner";



export default function BusinessInfo() {
    const router = useRouter();
    const { anchorLayout, anchorRef, hideMenu, menuVisible, setAnchorLayout, showMenu, openMenu } = usePopupMenu();
    const { pickImage, loading: pickingImg, image, error, clearImage } = useImagePicker();
    const { signinEmail, role } = useAppSelector((s: RootState) => s.auth)
    const dispatch = useAppDispatch();

    const [settingUp, setSettingUp] = useState(false)
    const allFeildsUnfocused = { companyName: false, companyType: false, phone: false, about: false, website: false };
    const [focused, setFocused] = useState(allFeildsUnfocused)

    const form = useFormik({
        initialValues: {
            companyName: '',
            companyType: '',
            about: '',
            phone: '',
            website: '',
            businessImage: image?.uri || '',
        },
        validationSchema: object({
            companyName: string()
                .required("Company name is required")
                .min(3, "Must be at least 3 letters"),
            companyType: string()
                .required("Company type is required")
                .min(3, "Must be at least 3 letters"),
            phone: string().required("Phone number is required")
                .min(10, "Must be at least 10 letters"),
            website: string(),
            about: string().required("Brief bio is required")
                .min(10, "Must be at least 10 letters"),
            businessImage: string().required("Profile image is required"),
        }),
        onSubmit: () => {
            try {
                setSettingUp(true);

                CloudinaryServices.uploadImage({
                    fnToRn: async (url) => {
                        form.setFieldValue('businessImage', url)
                        burnt.toast({ title: 'Your business image was uploaded! Finishing up...' })

                        const userDb = Db<Partial<iUser>>('user');

                        const userExist = await userDb.findOneByField('email', signinEmail as string);

                        if (!userExist) {
                            burnt.toast({ title: 'Your account was not found. Please register first.' })
                            return;
                        }

                        await userDb.update(userExist.id as string, {
                            business: {
                                about: form.values.about.trim(),
                                companyName: form.values.companyName.trim(),
                                companyType: form.values.companyType.trim(),
                                phone: form.values.phone.trim(),
                                website: form.values.website.trim(),
                                image: url.trim(),
                            },
                        })
                        dispatch(setAuthPersistState({ key: 'businessProfileSetup', value: true }))

                        burnt.toast({ title: 'Profile done! Lastly pick up your interests' })
                        setSettingUp(false);

                        router.push('/(onboarding)/interest')
                    }, folderName: 'business_images', imagePath: image?.uri as string
                })
            } catch (error) {
                setSettingUp(false);
                console.log('Business setup error', error);
                burnt.toast({ title: 'An error occurred while setting up your business. Please try again.' })
            }

        }
    })

    const selectImg = () => {
        pickImage()
    }

    useEffect(() => {
        if (image) {
            form.setFieldValue('businessImage', image?.uri || '')
        }
    }, [image])

    return (
        <Tv className="flex-1 bg-white">
            <Kb>
                <Container className="py-8 bg-red-700">

                    {/* Avatar */}
                    <Tv className="items-center mb-8">
                        <Pr
                            onPress={selectImg}
                            className="relative">
                            <Img
                                source={image ? { uri: image?.uri } : require("@/assets/images/onboarding/profile/avatar.png")}
                                className={`w-36 h-36 border-[1px] ${(form.errors.businessImage && form.touched.businessImage) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-full `}
                            />
                            <Tv className="absolute bottom-1 right-1 bg-[#5A189A] w-9 h-9 rounded-xl items-center justify-center">
                                {(pickingImg) ? (<Spinner style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} svgColor="white" />) : <Edit color="white" />}
                            </Tv>
                        </Pr>
                    </Tv>

                    {/* Form */}
                    <Tv className="flex-col gap-[24px]">
                        {/* Organization/Company Name */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.companyName && form.touched.companyName) ? 'border-red-500' : focused.companyName ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, companyName: true, })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <InputField
                                    value={form.values.companyName}
                                    onChangeText={(text) => form.setFieldValue('companyName', text)}
                                    onBlur={() => form.handleBlur('companyName')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Organization/Company Name" />
                            </Input>
                        </Tv>
                        {/* Organization/Company Name */}

                        {/* Organization type */}
                        <Tv ref={anchorRef} className={`w-auto relative`}>
                            <Pr
                                onPress={openMenu}
                                className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.companyType && form.touched.companyType) ? 'border-red-500' : focused.companyType ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <Urbanist className="flex-1 border-none outline-none focus:border-none focus:outline-none px-[0px]">Organization type</Urbanist>
                                <CaretDown />
                            </Pr>

                            <DropMenu
                                visible={menuVisible}
                                anchorLayout={anchorLayout}
                                onClose={() => hideMenu()}
                                containerClassName="right-[0px] absolute w-[65%] py-[0px] p-[7px] bg-[#F6F8FA]"
                                containerStyle={[{ left: anchorLayout?.x }]}
                            >
                                {[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                ].map(({ label, value }, index) => (
                                    <Pr
                                        onPress={() => {
                                            hideMenu();
                                            form.setFieldValue('gender', value)
                                        }}
                                        className={`w-full h-auto bg-white py-[10px] px-[9px] border-b-[0.5px] border-b-[#E6E6E6]`} key={index}>
                                        <Tt className={`text-[#101011] text-[12px]`}>{label}</Tt>
                                    </Pr>
                                ))}
                            </DropMenu>
                        </Tv>
                        {/* Organization type */}

                        {/* Website (Optional) */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.website && form.touched.website) ? 'border-red-500' : focused.website ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, website: true, })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <InputField
                                    value={form.values.website}
                                    onChangeText={(text) => form.setFieldValue('website', text)}
                                    onBlur={() => form.handleBlur('website')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Website (Optional)" />
                            </Input>
                        </Tv>
                        {/* Website (Optional) */}

                        {/* Phone Number */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.phone && form.touched.phone) ? 'border-red-500' : focused.phone ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Tv className="w-auto flex-row items-center gap-[8px]">
                                <Img
                                    source={require("@/assets/images/onboarding/profile/ngn.png")}
                                    className="w-[20px] h-[20px]"
                                />
                                <ChevronDown />
                            </Tv>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, phone: true, })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <InputField
                                    value={form.values.phone}
                                    onChangeText={(text) => form.setFieldValue('phone', text)}
                                    onBlur={() => form.handleBlur('phone')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]"
                                    keyboardType="numeric"
                                    placeholder="+234 000 000 000" />
                            </Input>
                        </Tv>
                        {/* Phone Number */}

                        <Tv className={`w-full flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.about && form.touched.about) ? 'border-red-500' : focused.about ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Textarea
                                size="md"
                                isReadOnly={false}
                                isInvalid={false}
                                isDisabled={false}
                                className="w-full bg-[#FAFAFA] rounded-[16px] border-none"
                                style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, about: true, })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <TextareaInput
                                    value={form.values.about}
                                    onChangeText={(text) => form.setFieldValue('about', text)}
                                    onBlur={() => form.handleBlur('about')}
                                    className="p-[20px]" placeholder="Brief Bio About You..." />
                            </Textarea>
                        </Tv>

                        {/* Button */}
                        <Btn
                            leftIcon={settingUp ? < Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                            container={{
                                onPress: () => !settingUp && form.handleSubmit(),
                            }}
                            text={{ children: "Continue" }}
                        />
                    </Tv>
                    {/* Form */}

                </Container>
            </Kb>
        </Tv>
    );
}
