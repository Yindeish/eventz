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
import { router, useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import ChevronDown from "@/components/onboarding/setup/svgs/chevron-down";
import Urbanist from "@/components/shared/fonts/urbanist";
import CaretDown from "@/components/onboarding/setup/svgs/caret-down";
import { useEffect, useState } from "react";
import { object, string } from 'yup';
import { useFormik } from "formik";
import usePopupMenu from "@/hooks/use-popup-menu";
import { DropMenu } from "@/components/shared/popup-menu";
import { useImagePicker } from "@/hooks/file/use-image-picker";
import Spinner from "@/components/shared/spinner";
import CloudinaryServices from "@/cloudinary/cloudinary.services";
import { burnt } from "@/components/shared/burnt";
import { Db } from "@/firebase-web/services/firestore.service";
import { iUser } from "@/state/types/auth";
import { useAppDispatch, useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import { setAuthState } from "@/state/slices/auth";
import { setAuthPersistState } from "@/state/slices/auth.persist";



export default function Profile() {
    const { anchorLayout, anchorRef, hideMenu, menuVisible, setAnchorLayout, showMenu, openMenu } = usePopupMenu();
    const { pickImage, loading: pickingImg, image, error, clearImage } = useImagePicker();
    const { signinEmail, role } = useAppSelector((s: RootState) => s.auth)
    const dispatch = useAppDispatch();

    const [dateModalOpen, setDateModalOpen] = useState(false)
    const allFeildsUnfocused = { firstName: false, lastName: false, phone: false, userName: false };
    const [focused, setFocused] = useState(allFeildsUnfocused)
    const [settingUp, setSettingUp] = useState(false)

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || form.values.dob;
        form.setFieldValue('dob', currentDate.toDateString())
        setDateModalOpen(false)
    };

    const form = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            userName: '',
            dob: '',
            phone: '',
            gender: '',
            profileImage: image?.uri || '',
        },
        validationSchema: object({
            firstName: string()
                .required("First name is required")
                .min(3, "Must be at least 3 letters"),
            lastName: string()
                .required("Last name is required")
                .min(3, "Must be at least 3 letters"),
            userName: string()
                .required("Last name is required")
                .min(3, "Must be at least 3 letters"),
            dob: string().required("Date of birth is required"),
            phone: string().required("Phone number is required"),
            gender: string().required("Gender is required"),
            profileImage: string().required("Profile image is required"),
        }),
        onSubmit: () => {
            try {
                setSettingUp(true);

                CloudinaryServices.uploadImage({
                    fnToRn: async (url) => {
                        form.setFieldValue('profileImage', url)
                        burnt.toast({ title: 'Your profile images was uploaded! Finishing up...' })

                        const userDb = Db<Partial<iUser>>('user');

                        const userExist = await userDb.findOneByField('email', signinEmail as string);

                        if (!userExist) {
                            burnt.toast({ title: 'Your account was not found. Please register first.' })
                            return;
                        }

                        await userDb.update(userExist.id as string, {
                            firstName: form.values.firstName.trim(),
                            lastName: form.values.lastName.trim(),
                            userName: form.values.userName.trim(),
                            dob: form.values.dob.trim(),
                            phone: form.values.phone.trim(),
                            picture: url.trim(),
                            profileSetup: true,
                        })
                        // login(user ? { ...user, profileSetup: true } as iUser : { ...userExist, profileSetup: true } as iUser)
                        dispatch(setAuthPersistState({ key: 'profileSetup', value: true }))

                        // burnt.toast({ title: 'Profile setup completed successfully!' })
                        burnt.toast({ title: 'Profile done! Lastly pick up your interests' })
                        setSettingUp(false);

                        if ((userExist?.role && userExist.role === 'organizer') || userExist?.role === 'organizer') router.replace('/(onboarding)/business-info');
                        else router.push('/(onboarding)/interest')
                    }, folderName: 'profile_images', imagePath: image?.uri as string
                })
            } catch (error) {
                setSettingUp(false);
                console.log('Profile setup error', error);
                burnt.toast({ title: 'An error occurred while setting up your profile. Please try again.' })
            }

        }
    })

    const selectImg = () => {
        pickImage()
    }

    useEffect(() => {
        if (image) {
            form.setFieldValue('profileImage', image?.uri || '')
        }
    }, [image])

    return (
        <Tv className="flex-1 bg-white">
            <Kb>
                <Container className="py-8">

                    {/* Avatar */}
                    <Tv className="items-center mb-8">
                        <Pr
                            onPress={selectImg}
                            className="relative">
                            <Img
                                source={image ? { uri: image?.uri } : require("@/assets/images/onboarding/profile/avatar.png")}
                                className={`w-36 h-36 border-[1px] ${(form.errors.profileImage && form.touched.profileImage) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-full `}
                            />
                            <Tv className="absolute bottom-1 right-1 bg-[#5A189A] w-9 h-9 rounded-xl items-center justify-center">
                                {(pickingImg) ? (<Spinner style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} svgColor="white" />) : <Edit color="white" />}
                            </Tv>
                        </Pr>
                    </Tv>

                    {/* Form */}
                    <Tv className="flex-col gap-[24px]">
                        {/* First Name */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.firstName && form.touched.firstName) ? 'border-red-500' : focused.firstName ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, firstName: true })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <InputField
                                    value={form.values.firstName}
                                    onChangeText={(text) => form.setFieldValue('firstName', text)}
                                    onBlur={() => form.handleBlur('firstName')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="First Name" />
                            </Input>
                        </Tv>
                        {/* First Name */}

                        {/* Last Name */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.lastName && form.touched.lastName) ? 'border-red-500' : focused.lastName ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, lastName: true, })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <InputField
                                    value={form.values.lastName}
                                    onChangeText={(text) => form.setFieldValue('lastName', text)}
                                    onBlur={() => form.handleBlur('lastName')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Last Name" />
                            </Input>
                        </Tv>
                        {/* Last Name */}

                        {/* Username */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.userName && form.touched.userName) ? 'border-red-500' : focused.userName ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, userName: true, })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <InputField
                                    value={form.values.userName}
                                    onChangeText={(text) => form.setFieldValue('userName', text)}
                                    onBlur={() => form.handleBlur('userName')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Username" />
                            </Input>
                        </Tv>
                        {/* Username */}

                        {/* Date of Birth */}
                        <Pr
                            onPress={() => setDateModalOpen(true)}
                            className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.dob && form.touched.dob) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            {dateModalOpen && (<DateTimePicker
                                value={form.values.dob ? new Date(form.values.dob) : new Date()}
                                mode="date"
                                display="default"
                                onChange={onChange}
                                className="hidden w-0 h-0"
                            />)}
                            <Urbanist className="flex-1">
                                {form.values.dob != '' ? form.values.dob : 'Date of Birth'}
                            </Urbanist>
                            <Calendar />
                        </Pr>
                        {/* Date of Birth */}

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

                        {/* Gender */}
                        {/* <Menu
                            placement="bottom left"
                            offset={0}
                            disabledKeys={['Settings']}
                            isOpen={genderMenuOpen}
                            // onOpen={() => setGenderMenuOpen(true)}
                            // onClose={() => setGenderMenuOpen(false)}
                            trigger={({ ...triggerProps }) => (
                                <Pr
                                    onPress={() =>setGenderMenuOpen(true)}
                                    className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px]`} {...triggerProps}>
                                    <Urbanist className="flex-1 border-none outline-none focus:border-none focus:outline-none px-[0px]">Gender</Urbanist>
                                    <CaretDown />
                                </Pr>
                            )} className="w-full">
                            <MenuItem key="male" textValue="Male">
                                <MenuItemLabel size="sm">Add account</MenuItemLabel>
                            </MenuItem>
                            <MenuItem key="female" textValue="Female">
                                <MenuItemLabel size="sm">Add account</MenuItemLabel>
                            </MenuItem>
                        </Menu> */}
                        <Tv ref={anchorRef} className={`w-auto relative`}>
                            <Pr
                                onPress={openMenu}
                                className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.gender && form.touched.gender) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <Urbanist className="flex-1 border-none outline-none focus:border-none focus:outline-none px-[0px]">{form.values.gender != '' ? form.values.gender : 'Gender'}</Urbanist>
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
                        {/* Gender */}

                        {/* Button */}
                        <Btn
                            leftIcon={settingUp ? <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                            container={{
                                onPress: () => !settingUp && form.handleSubmit(),
                                // className: `${isComplete ? "" : "opacity-40"}`
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
