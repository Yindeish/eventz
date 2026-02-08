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
import useAuth from "@/hooks/auth/useAuth";



export default function Profile() {
    const { user } = useAuth()

    const form = useFormik({
        initialValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            userName: user?.userName || '',
            dob: user?.dob || '',
            phone: user?.phone || '',
            gender: user?.gender || '',
            profileImage: user?.picture || '',
        },
        onSubmit: () => {


        }
    })

    return (
        <Tv className="flex-1 bg-white">
            <Kb>
                <Container className="py-8">

                    {/* Avatar */}
                    <Tv className="items-center mb-8">
                        <Tv
                            className="relative">
                            <Img
                                source={{ uri: form.values.profileImage }}
                                className={`w-36 h-36 border-[1px] ${(form.errors.profileImage && form.touched.profileImage) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-full `}
                            />
                        </Tv>
                    </Tv>

                    {/* Form */}
                    <Tv className="flex-col gap-[24px]">
                        {/* First Name */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] border-[#FAFAFA] rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                            >
                                <InputField
                                    value={form.values.firstName}
                                    editable={false}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="First Name" />
                            </Input>
                        </Tv>
                        {/* First Name */}

                        {/* Last Name */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] border-[#FAFAFA] rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                            >
                                <InputField
                                    value={form.values.lastName}
                                    editable={false}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Last Name" />
                            </Input>
                        </Tv>
                        {/* Last Name */}

                        {/* Username */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] border-[#FAFAFA] rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                            >
                                <InputField
                                    value={form.values.userName}
                                    editable={false}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Username" />
                            </Input>
                        </Tv>
                        {/* Username */}

                        {/* Date of Birth */}
                        <Pr
                            className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.dob && form.touched.dob) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Urbanist className="flex-1">
                                {form.values.dob}
                            </Urbanist>
                            <Calendar />
                        </Pr>
                        {/* Date of Birth */}

                        {/* Phone Number */}
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] border-[#FAFAFA] rounded-[16px]`}>
                            <Tv className="w-auto flex-row items-center gap-[8px]">
                                <Img
                                    source={require("@/assets/images/onboarding/profile/ngn.png")}
                                    className="w-[20px] h-[20px]"
                                />
                                <ChevronDown />
                            </Tv>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                            >
                                <InputField
                                    value={form.values.phone}
                                    editable={false}
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
                            editable={false}
                                <MenuItemLabel size="sm">Add account</MenuItemLabel>
                            </MenuItem>
                            <MenuItem key="female" textValue="Female">
                            editable={false}
                                <MenuItemLabel size="sm">Add account</MenuItemLabel>
                            </MenuItem>
                        </Menu> */}
                        <Tv
                            className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.gender && form.touched.gender) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Urbanist className="flex-1 border-none outline-none focus:border-none focus:outline-none px-[0px]">{form.values.gender}</Urbanist>
                            <CaretDown />
                        </Tv>
                        {/* Gender */}
                    </Tv>
                    {/* Form */}

                </Container>
            </Kb>
        </Tv>
    );
}
