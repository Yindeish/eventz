import CaretDown from "@/components/onboarding/setup/svgs/caret-down";
import ChevronDown from "@/components/onboarding/setup/svgs/chevron-down";
import Btn from "@/components/shared/btn";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import { Switch } from '@/components/ui/switch';
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { iTicket } from "@/state/types/create-event";
import { view } from "@/styles/view";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { object, string, number } from "yup";
import { Db } from "@/firebase-web/services/firestore.service";
import { iEvent } from "@/state/types/create-event";
import { burnt } from "@/components/shared/burnt";
import { SwitchChangeEvent } from "react-native";
import Spinner from "@/components/shared/spinner";
import WrapperDialog from "@/components/shared/wrapper-dialogue";
import CreatEventSuccessful from "@/components/in/home/create-event/modals/create-event-successful";

const AddTicketing = () => {
    const { insets } = useSafeAreaView();
    const { eventId } = useLocalSearchParams();

    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const form = useFormik({
        initialValues: {
            economyPrice: '',
            vipPrice: '',
        },
        validationSchema: object({
            economyPrice: isPaid ? number().required("Economy price is required").min(0, "Price must be positive") : string(),
            vipPrice: string(), // Optional
        }),
        onSubmit: async (values) => {
            if (!eventId) {
                burnt.toast({ title: 'Event ID missing' });
                return;
            }

            if (isPaid) {
                burnt.toast({ title: 'Paid events are not suported yet!' })
                return;
            }

            setLoading(true);
            try {
                const eventTicket = {
                    type: isPaid ? 'paid' : 'free',
                    economyPrice: isPaid ? parseFloat(values.economyPrice) : 0,
                    vipPrice: isPaid && values.vipPrice ? parseFloat(values.vipPrice) : 0,
                } as iEvent['ticket'];

                const eventDb = Db<Partial<iEvent>>('event');
                await eventDb.update(eventId as string, { ticket: eventTicket });

                // setModalOpen(true);
                // setMsg('Ticketing updated successfully!');

                // setTimeout(() => {
                //     // burnt.toast({ title: 'Ticketing updated successfully!' });
                //     router.push({ pathname: '/(in)/home/create-event/tag-artists', params: { eventId: eventId as string } });
                //     setModalOpen(false);
                // }, 1500)
                burnt.toast({ title: 'Ticketing updated successfully!' });
                router.push({ pathname: '/(in)/home/create-event/tag-artists', params: { eventId: eventId as string } });
            } catch (error) {
                console.log('Update event error', error);
                burnt.toast({ title: 'Failed to update ticketing. Please try again.' });
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        if (isPaid) {
            burnt.toast({ title: 'Paid events are not suported yet!' });
            return;
        }
    }, [isPaid])

    return (
        <Tv className="flex-1 bg-white pt-[24px] flex-col gap-[20px]" style={[view.mb(insets.bottom)]}>
            <Container className="flex-col gap-[10px]" style={[view.hAuto]}>
                <Urbanist className="text-[#212121] text-[12px] font-medium">Select Option</Urbanist>

                <Tv className="w-full flex-row items-center justify-between">
                    <Urbanist className="text-[16px] font-medium">
                        Free Ticketing
                    </Urbanist>

                    <Switch
                        size="md"
                        isDisabled={false}
                        value={!isPaid}
                        onChange={(val) => setIsPaid(!isPaid)}
                        trackColor={{ false: '#78788029', true: '#34C759' }}
                        thumbColor="#fafafa"
                        ios_backgroundColor="#d4d4d4"
                    />
                </Tv>

                {/* <Tv className="w-full flex-row items-center justify-between">
                    <Urbanist className="text-[16px] font-medium">
                        Paid Ticketing
                    </Urbanist>

                    <Switch
                        value={isPaid}
                        onChange={(val) => setIsPaid(!isPaid)}
                        size="md"
                        isDisabled={false}
                        trackColor={{ false: '#78788029', true: '#34C759' }}
                        thumbColor="#fafafa"
                        ios_backgroundColor="#d4d4d4"
                    />
                </Tv> */}
            </Container>

            {/* Divider */}
            <Tv className="w-full h-[1px] bg-[#EEEEEE]" />
            {/* Divider */}

            <Container className="flex-1 flex-col gap-[16px] pb-[24px]" style={[view.flex_1]}>
                {isPaid && (
                    <>
                        {/* Economy Price */}
                        <Tv className="w-full flex-col gap-[10px]">
                            <Urbanist className="text-[#616161] text-[14px] font-medium">Economy Price</Urbanist>

                            <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px]`}>
                                <Tv className="w-auto flex-row items-center gap-[8px]">
                                    <Img
                                        source={require("@/assets/images/onboarding/profile/ngn.png")}
                                        className="w-[20px] h-[20px]"
                                    />
                                    <ChevronDown />
                                </Tv>
                                <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}>
                                    <InputField
                                        value={form.values.economyPrice}
                                        onChangeText={(text) => form.setFieldValue('economyPrice', text)}
                                        onBlur={() => form.handleBlur('economyPrice')}
                                        className="border-none outline-none focus:border-none focus:outline-none px-[0px]"
                                        keyboardType="numeric"
                                        placeholder="Price e.g ₦5,000"
                                    />
                                </Input>
                            </Tv>
                            {form.errors.economyPrice && form.touched.economyPrice && (
                                <Urbanist className="text-red-500 text-[12px]">{form.errors.economyPrice}</Urbanist>
                            )}
                        </Tv>
                        {/* Economy Price */}

                        {/* VIP Price (optional) */}
                        <Tv className="w-full flex-col gap-[10px]">
                            <Urbanist className="text-[#616161] text-[14px] font-medium">VIP Price (Optional)</Urbanist>

                            <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px]`}>
                                <Tv className="w-auto flex-row items-center gap-[8px]">
                                    <Img
                                        source={require("@/assets/images/onboarding/profile/ngn.png")}
                                        className="w-[20px] h-[20px]"
                                    />
                                    <ChevronDown />
                                </Tv>
                                <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}>
                                    <InputField
                                        value={form.values.vipPrice}
                                        onChangeText={(text) => form.setFieldValue('vipPrice', text)}
                                        onBlur={() => form.handleBlur('vipPrice')}
                                        className="border-none outline-none focus:border-none focus:outline-none px-[0px]"
                                        keyboardType="numeric"
                                        placeholder="Price e.g ₦15,000"
                                    />
                                </Input>
                            </Tv>
                            {form.errors.vipPrice && form.touched.vipPrice && (
                                <Urbanist className="text-red-500 text-[12px]">{form.errors.vipPrice}</Urbanist>
                            )}
                        </Tv>
                        {/* VIP Price (optional) */}
                    </>
                )}

                <Tv className="flex-1" />

                <Btn
                    leftIcon={loading ? <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                    container={{
                        onPress: () => !loading && form.handleSubmit()
                    }}
                    text={{
                        children: loading ? 'Updating...' : 'Confirm Ticketing'
                    }}
                />
            </Container>

            {/* Modals */}
            <WrapperDialog isOpen={modalOpen} onClose={() => setModalOpen(false)} closeOnOverlayClick={false}>
                <CreatEventSuccessful msg={msg} onClose={() => setModalOpen(false)} />
            </WrapperDialog>
            {/* Modals */}
        </Tv>
    );
}

export default AddTicketing;