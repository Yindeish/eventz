import { INTERESTS } from "@/app/(onboarding)/interest";
import GallerySheet from "@/components/in/home/sheets/gallery";
import AddGallery from "@/components/in/home/svgs/add-gallery";
import EndDate from "@/components/in/home/svgs/end-date";
import Participants from "@/components/in/home/svgs/participants";
import StartDate from "@/components/in/home/svgs/start-date";
import UploadImg from "@/components/in/home/svgs/upload-img";
import CaretDown from "@/components/onboarding/setup/svgs/caret-down";
import Location from "@/components/onboarding/setup/svgs/location";
import Btn from "@/components/shared/btn";
import { burnt } from "@/components/shared/burnt";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import Kb from "@/components/shared/keyboard";
import { Pr } from "@/components/shared/pressable";
import { Ts } from "@/components/shared/scroll-view";
import { useSheetRef } from "@/components/shared/sheet";
import SheetModal from "@/components/shared/sheet-modal";
import Spinner from "@/components/shared/spinner";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { postsArr } from "@/constants/posts";
import { useImagePicker } from "@/hooks/file/use-image-picker";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { useAppSelector } from "@/state/hooks/useRtk";
import { RootState } from "@/state/state";
import { view } from "@/styles/view";
import { Href, router } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { SelectList } from 'react-native-dropdown-select-list'
import { object, string } from "yup";
import DateTimePicker from '@react-native-community/datetimepicker';
import CloudinaryServices from "@/cloudinary/cloudinary.services";
import { Db } from "@/firebase-web/services/firestore.service";
import { iEvent } from "@/state/types/create-event";
import useAuth from "@/hooks/auth/useAuth";
import WrapperDialog from "@/components/shared/wrapper-dialogue";
import CreatEventSuccessful from "@/components/in/home/create-event/modals/create-event-successful";
import { iUser } from "@/state/types/auth";


const Index = () => {
    const { insets } = useSafeAreaView();
    const sheet = useSheetRef();
    const { pickImage, loading: pickingImg, image, error, clearImage } = useImagePicker();
    const { gallery } = useAppSelector((s: RootState) => s.createEvent);
    const { user } = useAuth()

    const snapoints = {
        gallery: [856]
    };
    const [currentSnapoints, setCurrentSnappoints] = useState(snapoints.gallery);
    const allSheetsClosed = {
        gallery: false,
    };
    const gallerySheetOpen = {
        gallery: true,
    };
    const tagSheetOpen = {
        gallery: false,
    };

    const [sheets, setSheets] = useState(allSheetsClosed)

    const allFeildsUnfocused = { eventName: false, category: false, start: false, end: false, location: false, description: false, participants: false };
    const [focused, setFocused] = useState({
        eventName: false,
        category: false,
        start: false,
        end: false,
        location: false,
        description: false,
        participants: false,
    })
    const [startDateModalOpen, setStartDateModalOpen] = useState(false)
    const [endDateModalOpen, setEndDateModalOpen] = useState(false)
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [msg, setMsg] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [improving, setImproving] = useState(false)

    const form = useFormik({
        initialValues: {
            eventName: '',
            category: '',
            start: '',
            time: '',
            end: '',
            location: '',
            description: '',
            participants: '',
            banner: ''
        },
        validationSchema: object({
            eventName: string().required("Event name is required"),
            category: string().required("Category is required"),
            start: string().required("Start date is required"),
            time: string(),
            end: string().required("End date is required"),
            location: string().required("Location is required"),
            description: string().required("Description is required"),
            participants: string().required("Participants are required"),
            banner: string().required("Banner is required"),
        }),
        onSubmit: async (values) => {
            if (gallery.length < 3) {
                burnt.toast({ title: 'Select at least 3 image for the gallery' });
                return;
            }

            try {
                setUploading(true);
                setUploadProgress(0);

                // Upload banner
                let bannerUrl = '';
                await CloudinaryServices.uploadImage({
                    imagePath: form.values.banner,
                    folderName: 'event-banners',
                    fnToRn: (url: string) => {
                        bannerUrl = url;
                    }
                });
                setUploadProgress(25);

                // Upload gallery
                const galleryUrls: string[] = [];
                const uploadPromises = gallery.map(async (galleryItem: any) => {
                    let url = '';
                    await CloudinaryServices.uploadImage({
                        imagePath: galleryItem.uri!,
                        folderName: 'event_galleries',
                        fnToRn: (uploadedUrl: string) => {
                            url = uploadedUrl;
                        }
                    });
                    galleryUrls.push(url);
                });
                await Promise.all(uploadPromises);
                setUploadProgress(75);

                // const startDate = form.values.start! as unknown as Date;
                // const endDate = form.values.end! as unknown as Date;
                const startDate = new Date(form.values.start!) as unknown as Date;
                const endDate = new Date(form.values.end!) as unknown as Date;

                // if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                //     throw new Error("Invalid start or end date");
                // }

                // Create event
                const eventDb = Db<Partial<iEvent>>('event');
                const newEvent = await eventDb.create({
                    name: form.values.eventName.trim(),
                    about: form.values.description.trim(),
                    banner: bannerUrl.trim(),
                    location: form.values.location.trim(),
                    participants: Number(form.values.participants),
                    category: form.values.category.trim(),
                    gallery: galleryUrls,
                    organizerId: user?.uId.trim(),
                    organizer: user as iUser,
                    startDate: form.values.start.trim(),
                    endDate: form.values.end.trim(),
                    // time: form.values.start.trim(),
                    // startDate: startDate.toISOString().split('T')[0],
                    // endDate: endDate.toISOString().split('T')[0],
                    time: form.values.time,
                    startTimeStamp: startDate.toISOString(),
                    endTimeStamp: endDate.toISOString(),
                });

                if (!newEvent?.id) {
                    burnt.toast({ title: 'There was an error during your event upload! Retry.' });
                    return;
                }

                await eventDb.update(newEvent.id, { id: newEvent.id });

                // setModalOpen(true);
                // setMsg('You have successfully tagged artists to your event.')

                // setTimeout(() => {
                //     setUploadProgress(100);
                //     // burnt.toast({ title: 'Your event is live!' });
                //     router.push({ pathname: '/(in)/home/create-event/add-ticketing', params: { eventId: newEvent.id } });
                //     setModalOpen(false);
                // }, 1500)
                setUploadProgress(100);
                burnt.toast({ title: 'Your event is live!' });
                router.push({ pathname: '/(in)/home/create-event/add-ticketing', params: { eventId: newEvent.id } });
            } catch (error) {
                setUploading(false);
                setUploadProgress(0);
                console.log('Event creation error', error);
                burnt.toast({ title: 'An error occurred while creating your event. Please try again.' });
            } finally {
                setUploading(false);
            }
        }
    });

    const onStartChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || form.values.start;
        form.setFieldValue('start', currentDate.toDateString());
        const time = currentDate?.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        form.setFieldValue('time', time)
        setStartDateModalOpen(false)
    };

    const improveShown = form.values.description.length > 5 && form.values.banner;

    const improveWithAi = async () => {
        if (improving) return;

        if (!form.values.description.trim()) {
            burnt.toast({ title: 'Write something first' })
            return;
        }

        if (!image?.uri) {
            burnt.toast({ title: 'Upload banner for a good result!' })
            return;
        }

        setImproving(true);

        try {
            const formData = new FormData();
            formData.append('desc', form.values.description.trim());

            if (image?.uri) {
                formData.append('image', {
                    uri: image.uri,
                    name: 'post-image.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            const res = await fetch(
                'https://eventz-server.vercel.app/api/posts/improve-with-ai',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    body: formData,
                }
            );

            if (!res.ok) {
                burnt.toast({ title: 'Encountered an error! Try again' });
                return;
            }

            const json = await res.json();

            console.log({ json })

            if (json?.error) {
                burnt.toast({ title: json?.error })
            }

            if (json?.data) {
                form.setFieldValue('description', json.data);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setImproving(false);
        }
    };

    const onEndChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || form.values.end;
        form.setFieldValue('end', currentDate.toDateString())
        setEndDateModalOpen(false)
    };

    useEffect(() => {
        if (image) {
            form.setFieldValue('banner', image?.uri || '')
        }
    }, [image])


    return (
        <Tv className="flex-1 pt-[28px] flex-col bg-white" style={[view.pb(insets.bottom)]}>
            <Kb>
                <Ts>
                    <Container className="h-auto flex-col gap-[20px]">
                        {/* Banner */}
                        <Pr onPress={pickImage} className="w-full h-[203px] relative">
                            <Img className="w-full h-[203px] rounded-[8px]" source={image?.uri ? { uri: image?.uri } : require('@/assets/images/in/home/event-upload-preview.png')} />
                            <Tv className="w-full h-full bg-[#00000045] flex-col items-center justify-end gap-[12px] pb-[30px] absolute top-0 left-0 z-2">
                                <UploadImg />
                                <Urbanist className="text-white text-[18px] font-bold">
                                    {image?.uri ? 'Change event banner' : 'Upload event banner'}
                                </Urbanist>
                                <Urbanist className="text-white text-[14px] font-medium">
                                    Not more than 20MB
                                </Urbanist>
                            </Tv>
                        </Pr>
                        {/* Banner */}

                        <Tv className="w-full flex-col gap-[16px]">
                            {/* Event Name */}
                            <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.eventName && form.touched.eventName) ? 'border-red-500' : focused.eventName ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                    onFocus={() => setFocused({ ...allFeildsUnfocused, eventName: true })}
                                    onBlur={() => setFocused(allFeildsUnfocused)}
                                >
                                    <InputField
                                        value={form.values.eventName}
                                        onChangeText={(text) => form.setFieldValue('eventName', text)}
                                        onBlur={() => form.handleBlur('eventName')}
                                        className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Event Name" />
                                </Input>
                            </Tv>
                            {/* Event Name */}

                            {/* Category */}
                            {/* <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.category && form.touched.category) ? 'border-red-500' : focused.category ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                onFocus={() => setFocused({ ...allFeildsUnfocused, category: true })}
                                onBlur={() => setFocused(allFeildsUnfocused)}
                            >
                                <InputField
                                    value={form.values.category}
                                    onChangeText={(text) => form.setFieldValue('category', text)}
                                    onBlur={() => form.handleBlur('category')}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Category" />
                            </Input>
                            <CaretDown />
                        </Tv> */}
                            <SelectList
                                setSelected={(val: string) => {
                                    // setSelected(val);
                                    form.setFieldValue('category', val);
                                }}
                                data={INTERESTS.map(({ id, label }) => ({ key: label, value: id }))}
                                save="value"
                                search={false}
                                placeholder="Category"
                                // onSelect={() => }
                                inputStyles={{ borderColor: (form.errors.category && form.touched.category) ? '#ef4444' : focused.category ? '#73138C' : '#FAFAFA' }}
                                boxStyles={{ borderColor: (form.errors.category && form.touched.category) ? '#ef4444' : focused.category ? '#73138C' : '#FAFAFA', backgroundColor: '#FAFAFA' }}
                            />
                            {/* Category */}

                            {/* Start */}
                            <Pr
                                onPress={() => setStartDateModalOpen(true)}
                                className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.start && form.touched.start) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                {startDateModalOpen && (<DateTimePicker
                                    value={form.values.start ? new Date(form.values.start) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onStartChange}
                                    className="hidden w-0 h-0"
                                />)}
                                <StartDate />
                                <Urbanist className="flex-1">
                                    {form.values.start != '' ? form.values.start : 'Start'}
                                </Urbanist>
                            </Pr>
                            {/* <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.start && form.touched.start) ? 'border-red-500' : focused.start ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <StartDate />
                                <Urbanist>Start</Urbanist>
                                <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                    onFocus={() => setFocused({ ...allFeildsUnfocused, start: true })}
                                    onBlur={() => setFocused(allFeildsUnfocused)}
                                >
                                    <InputField className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="" />
                                </Input>
                            </Tv> */}
                            {/* Start */}

                            {/* End */}
                            <Pr
                                onPress={() => setEndDateModalOpen(true)}
                                className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.end && form.touched.end) ? 'border-red-500' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                {endDateModalOpen && (<DateTimePicker
                                    value={form.values.end ? new Date(form.values.end) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onEndChange}
                                    className="hidden w-0 h-0"
                                />)}
                                <EndDate />
                                <Urbanist className="flex-1">
                                    {form.values.end != '' ? form.values.end : 'End'}
                                </Urbanist>
                            </Pr>
                            {/* <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.end && form.touched.end) ? 'border-red-500' : focused.end ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <EndDate />
                                <Urbanist>End</Urbanist>
                                <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                    onFocus={() => setFocused({ ...allFeildsUnfocused, end: true })}
                                    onBlur={() => setFocused(allFeildsUnfocused)}
                                >
                                    <InputField className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="" />
                                </Input>
                            </Tv> */}
                            {/* End */}

                            {/* Choose Location */}
                            <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.location && form.touched.location) ? 'border-red-500' : focused.location ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <Location color="#9E9E9E" />
                                <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                    onFocus={() => setFocused({ ...allFeildsUnfocused, location: true })}
                                    onBlur={() => setFocused(allFeildsUnfocused)}
                                >
                                    <InputField
                                        value={form.values.location}
                                        onChangeText={(text) => form.setFieldValue('location', text)}
                                        onBlur={() => form.handleBlur('location')}
                                        className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Choose Location" />
                                </Input>
                            </Tv>
                            {/* Choose Location */}

                            {/* Event Description */}
                            <Tv className={`w-full flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.description && form.touched.description) ? 'border-red-500' : focused.description ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <Textarea variant="default" className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                    onFocus={() => setFocused({ ...allFeildsUnfocused, description: true })}
                                    onBlur={() => setFocused(allFeildsUnfocused)}
                                >
                                    <TextareaInput
                                        value={form.values.description}
                                        onChangeText={(text) => form.setFieldValue('description', text)}
                                        onBlur={() => form.handleBlur('description')}
                                        className="border-none outline-none focus:border-none focus:outline-none px-[0px]" placeholder="Event Description" />
                                </Textarea>
                            </Tv>
                            {/* Event Description */}

                            {/* Improve with Ai */}
                            <Tv className="w-full flex-row items-center gap-2">
                                <Urbanist onPress={improveWithAi} className="text-[#73138C] text-[14px] font-bold py-2" style={[improveShown ? {} : view.opacity_0_5]}>
                                    Improve with Ai
                                </Urbanist>
                                {improving && (<Spinner svgColor="#73138C" style={[view.w(14), view.h(14)]} svgStyle={[view.w(14), view.h(14)]} />)}
                            </Tv>
                            {/* Improve with Ai */}

                            {/* Add Gallery(s) */}
                            {(gallery.length > 0) ? (
                                <Pr onPress={() => {
                                    sheet.open();
                                    setSheets(gallerySheetOpen)
                                }} className="w-full flex-row gap-[12px]">
                                    {gallery
                                        .slice(0, 3)
                                        .map((item, index) => (
                                            <Tv className="flex-1 h-[95px] relative" key={index}>
                                                <Img className="w-full h-full rounded-[20px]" source={{ uri: item?.url || item?.uri }} />
                                                {(index === 2 && (gallery.length > 3)) && (
                                                    <Tv className="w-full h-full flex-row items-center justify-center absolute top-0 left-0 z-2">
                                                        <Urbanist className="text-white text-[20px] font-bold">{Number(gallery.length) - 3}+</Urbanist>
                                                    </Tv>
                                                )}
                                            </Tv>
                                        ))}
                                </Pr>
                            ) : (<Pr onPress={() => {
                                sheet.open();
                                setSheets(gallerySheetOpen)
                            }} className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] border-[#FAFAFA] rounded-[16px]`}>
                                <AddGallery />

                                <Urbanist className="flex-1 text-[#9E9E9E] text-[14px]">Add Gallery(s)</Urbanist>
                            </Pr>)}
                            {/* Add Gallery(s) */}

                            {/* No of Participants */}
                            <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] border-[1px] ${(form.errors.participants && form.touched.participants) ? 'border-red-500' : focused.participants ? 'border-[#73138C]' : 'border-[#FAFAFA]'} rounded-[16px]`}>
                                <Participants />
                                <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}
                                    onFocus={() => setFocused({ ...allFeildsUnfocused, participants: true })}
                                    onBlur={() => setFocused(allFeildsUnfocused)}
                                >
                                    <InputField
                                        value={form.values.participants}
                                        onChangeText={(text) => form.setFieldValue('participants', text)}
                                        onBlur={() => form.handleBlur('participants')}
                                        className="border-none outline-none focus:border-none focus:outline-none px-[0px]" keyboardType="numeric" placeholder="No of Participants" />
                                </Input>
                            </Tv>
                            {/* No of Participants */}
                        </Tv>

                        {/* {false ? (
                        <Tv className="w-full flex-row gap-[12px]">
                            {[1, 2, 3].map((_, index) => (
                                <Tv className="flex-1 h-[95px] relative" key={index}>
                                    <Img className="w-full h-full rounded-[20px]" source={postsArr[1]?.postImg} />
                                    {(index === 2) && (
                                        <Tv className="w-full h-full flex-row items-center justify-center absolute top-0 left-0 z-2">
                                            <Urbanist className="text-white text-[20px] font-bold">20+</Urbanist>
                                        </Tv>
                                    )}
                                </Tv>
                            ))}
                        </Tv>
                    ) : (<Btn
                        container={{
                            className: 'bg-white border border-[#73138C]',
                            onPress: () => {
                                sheet.open();
                                setSheets(gallerySheetOpen)
                            }
                        }}
                        text={{
                            style: [text._73138C],
                            children: 'Add pre-event gallery'
                        }}
                    />)} */}

                        <Tv className="py-[40px] pb-[23px]">
                            {/* {uploading && (
                                <Progress value={uploadProgress} className="mb-4" />
                            )} */}
                            <Btn
                                leftIcon={uploading ? <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                                container={{
                                    disabled: uploading,
                                    onPress: () => {
                                        if (form.values.banner == '') {
                                            burnt.toast({ title: 'Banner is required!' });
                                            return;
                                        }
                                        !uploading && form.handleSubmit()
                                    }
                                }}
                                text={{
                                    children: uploading ? 'Creating Event...' : 'Create Event'
                                }}
                            />
                        </Tv>
                    </Container>
                </Ts>
            </Kb>

            {/* Modals */}
            <WrapperDialog isOpen={modalOpen} onClose={() => setModalOpen(false)} closeOnOverlayClick={false}>
                <CreatEventSuccessful msg={msg} onClose={() => setModalOpen(false)} />
            </WrapperDialog>
            {/* Modals */}

            {/* Sheets */}
            <SheetModal
                ref={sheet.ref}
                snapPoints={currentSnapoints}
                allowSwipeDown={true}
                closeOnBackdropPress={true}
                onDismiss={() => {
                    setSheets(allSheetsClosed)
                    setCurrentSnappoints(snapoints.gallery)
                }}
            >
                {sheets.gallery == true && <GallerySheet onClose={sheet.close} />}
            </SheetModal>
            {/* Sheets */}
        </Tv>
    );
}

export default Index;