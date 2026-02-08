import CloudinaryServices from "@/cloudinary/cloudinary.services";
import TrendingEvent from "@/components/in/events/trending-event";
import Edit from "@/components/in/home/create-post/svgs/edit";
import Event from "@/components/in/home/create-post/svgs/event";
import ImagePlus from "@/components/in/home/create-post/svgs/image-plus";
import Poll from "@/components/in/home/create-post/svgs/poll";
import Video from "@/components/in/home/create-post/svgs/video";
import Search from "@/components/in/svgs/search";
import Btn from "@/components/shared/btn";
import { burnt } from "@/components/shared/burnt";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import { Pr } from "@/components/shared/pressable";
import { useSheetRef } from "@/components/shared/sheet";
import SheetModal from "@/components/shared/sheet-modal";
import Spinner from "@/components/shared/spinner";
import { Tv } from "@/components/shared/view";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { postsArr } from "@/constants/posts";
import { collections } from "@/firebase-web/services/collections";
import useAuth from "@/hooks/auth/useAuth";
import { PickedImage, useImagePicker } from "@/hooks/file/use-image-picker";
import useUriToBlob from "@/hooks/file/use-uri-to-blob";
import { PickedVideo, useVideoPicker } from "@/hooks/file/use-video-picker";
import { iUser } from "@/state/types/auth";
import { iEvent } from "@/state/types/create-event";
import { view } from "@/styles/view";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { object, string } from "yup";

const Index = () => {
    const sheet = useSheetRef();
    const sheetPeople = useSheetRef();
    const { user } = useAuth()
    const { pickImage, pickReturnImage, image, clearImage } = useImagePicker();
    const { pickVideo, video, clearVideo } = useVideoPicker();
    const textareaRef = useRef<any>(null);
    const { uriToBlob } = useUriToBlob()

    const [taggedEvent, setTaggedEvent] = useState<(iEvent & { id: string }) | null>(null);
    const [improving, setImproving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [allEvents, setAllEvents] = useState<(iEvent & { id: string })[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<(iEvent & { id: string })[]>([]);
    const [eventSearchQuery, setEventSearchQuery] = useState('');
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [users, setUsers] = useState<(iUser & { id: string })[]>([])
    const [filteredUsers, setFilteredUsers] = useState<(iUser & { id: string })[]>([])
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [img, setImg] = useState<PickedImage | null>(null)
    const [vid, setVid] = useState<PickedVideo | null>(null)
    // const [video, setVideo] = useState<string | null>(null);
    const [eventTagged, setEventTagged] = useState(false);
    const [taggedPeople, setTaggedPeople] = useState<(iUser & { id: string })[]>([]);

    const allClosed = {
        tag: false,
        usersTag: false
    }
    const [open, setOpen] = useState(allClosed);

    // helper: remove undefined fields recursively (keeps nulls and arrays)
    const removeUndefined = (value: any): any => {
        if (value === undefined) return undefined;
        if (value === null) return null;
        if (Array.isArray(value)) return value.map(removeUndefined);
        if (typeof value !== 'object') return value;

        return Object.entries(value).reduce((acc: any, [key, v]) => {
            const cleaned = removeUndefined(v);
            if (cleaned !== undefined) acc[key] = cleaned;
            return acc;
        }, {});
    };

    const uploadImg = async () => await CloudinaryServices.uploadImage({
        imagePath: form.values.postImg as string || img?.uri as string,
        folderName: 'post-images',
        fnToRn: (url: string) => {
            form.setFieldValue('postImg', url);
        }
    })
        .catch((err) => {
            console.log({ err })
            burnt.toast({ title: 'Error in uploading image' })
            throw err;
        });

    const uploadVid = async () => await CloudinaryServices.uploadVideo({
        videoPath: form.values.postVideo as string || video?.uri as string,
        folderName: 'post-videos',
        fnToRn: (url: string) => {
            form.setFieldValue('postVideo', url);
        }
    }).catch((err) => {
        console.log({ err })
        burnt.toast({ title: 'Error in uploading video' })
        throw err;
    });


    const createPost = async () => {
        if (!user?.uId) {
            burnt.toast({ title: 'User not authenticated' });
            return;
        }

        // if (imgs.length === 0 && !video) {
        //     burnt.toast({ title: 'Add at least one image or video' });
        //     return;
        // }

        if (!form.values.postText.trim()) {
            burnt.toast({ title: 'Add a description to your post' });
            return;
        }

        if (!taggedEvent?.id) {
            burnt.toast({ title: 'Tag an event for your post' });
            return;
        }
        if (!taggedPeople[0]?.id) {
            burnt.toast({ title: 'Tag someone for your post' });
            return;
        }


        setCreating(true);
        try {

            if (img && form.values.postImg.includes('file://')) {
                burnt.toast({ title: 'Invalid image format. Reuploading..' })
                await uploadImg()
            }
            if (video && form.values.postVideo.includes('file://')) {
                burnt.toast({ title: 'Invalid video format. Reuploading..' })
                await uploadImg()
            }

            console.log({ 'form.values.postVideo': form.values.postVideo })

            // Create post in Firestore
            // Prepare payload and remove any undefined fields (Firestore rejects undefined)
            const payload: any = {
                postText: form.values.postText?.trim() || null,
                postImg: form.values.postImg || null,
                postVid: form.values.postVideo || null,
                authorImg: user?.picture || null,
                authorName: user?.userName || null,
                author: user
                    ? {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: user.userName,
                        picture: user.picture,
                        role: user.role,
                        uId: user.uId,
                    }
                    : null,
                eventId: taggedEvent?.id || null,
                event: taggedEvent
                    ? {
                        id: taggedEvent.id,
                        name: taggedEvent.name,
                        banner: taggedEvent.banner,
                    }
                    : null,
                taggedPeopleIds: taggedPeople.length ? taggedPeople.map(p => p.id) : [],
                taggedPeople: taggedPeople.length ? taggedPeople : [],
                createdAt: new Date().toISOString(),
                likesCount: 0,
                commentsCount: 0,
                sharesCount: 0,
            };

            const cleanedPayload = removeUndefined(payload);

            const newPost = await collections.post.create(cleanedPayload);

            if (!newPost?.id) {
                burnt.toast({ title: 'Error creating post' });
                return;
            }

            burnt.toast({ title: 'Your post is now live!' });
            form.resetForm();
            setImg(null);
            // setVideo(null);
            clearVideo()
            setTaggedEvent(null);
            setTaggedPeople([]);
            clearImage();

            router.replace('/(in)/(tabs)');
        } catch (err) {
            console.log('create post error', err);
            burnt.toast({ title: 'Failed to create post. Try again.' });
        } finally {
            setCreating(false);
        }
    }

    const selectImage = async () => {
        // await pickImage()
        const image = await pickReturnImage();
        if (image?.uri) {
            setImg(image)
            form.setFieldValue('postImg', image?.uri);
            // clearImage(); not yet as we might use it in improve post with Ai
        }
    }

    const selectVideo = async () => {
        await pickVideo();
        if (video?.uri) {
            form.setFieldValue('postVideo', video?.uri);
            // setVideo(video.uri);
            clearVideo();
        }
    }

    const handleEventSearch = (query: string) => {
        setEventSearchQuery(query);
        if (!query.trim()) {
            setFilteredEvents(allEvents);
            return;
        }

        const filtered = allEvents.filter(
            (e) =>
                e.name?.toLowerCase().includes(query.toLowerCase()) ||
                e.location?.toLowerCase().includes(query.toLowerCase()) ||
                e.category?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    const handleUserSearch = (query: string) => {
        setUserSearchQuery(query);
        if (!query.trim()) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(
            (u) =>
                u.userName?.toLowerCase().includes(query.toLowerCase()) ||
                u.firstName?.toLowerCase().includes(query.toLowerCase()) ||
                u.lastName?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {
            const allEventsData = await collections.event.getSome(20);

            // Sort by createdAt (newest first)
            const sorted = (allEventsData || [])
                .sort((a: any, b: any) => {
                    const aTime = new Date(a.createdAt || a.startTimeStamp || 0).getTime();
                    const bTime = new Date(b.createdAt || b.startTimeStamp || 0).getTime();
                    return bTime - aTime;
                });

            const normalized = sorted.map((e: any) => ({
                id: e.id,
                name: e.name || 'Untitled',
                location: e.location || '',
                banner: e.banner || '',
                startDate: e.startDate || '',
                time: e.time || '',
                endDate: e.endDate || '',
                category: e.category || '',
                about: e.about || '',
                participants: e.participants || 0,
                gallery: e.gallery || [],
                organizerId: e.organizerId || '',
                organizer: e.organizer || undefined,
                artistsIds: e.artistsIds || [],
                artists: e.artists || [],
                ticketsIds: e.ticketsIds || [],
                tickets: e.tickets || [],
                commentsIds: e.commentsIds || [],
                comments: e.comments || [],
                likesIds: e.likesIds || [],
                likes: e.likes || [],
                sharesCount: e.sharesCount || 0,
                likesCount: e.likesCount || 0,
                commentsCount: e.commentsCount || 0,
                goingsCount: e.goingsCount || 0,
                goings: e.goings || [],
                goingsIds: e.goingsIds || [],
            })) as (iEvent & { id: string })[];

            setAllEvents(normalized);
            setFilteredEvents(normalized);
        } catch (err) {
            console.log('fetch events error', err);
            burnt.toast({ title: 'Failed to load events' });
        } finally {
            setLoadingEvents(false);
        }
    }

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            // Prefer using getSome (if available) to limit payload; fallback to getAll()
            // const usersData = typeof collections.user.getSome === 'function'
            //     ? await collections.user.getSome(50) // fetch latest 50 users
            //     : await collections.user.getAll();
            // const usersData = await collections.user.getSome(20);
            const usersData = await collections.user.getAll();

            const normalized = (usersData || []).map((u: any) => ({
                id: u.id,
                email: u.email || '',
                firstName: u.firstName || '',
                lastName: u.lastName || '',
                userName: u.userName || `${(u.firstName || '').toLowerCase()}${(u.lastName || '').charAt(0) || ''}`,
                gender: u.gender || '',
                hashedPwd: u.hashedPwd || '',
                phone: u.phone || '',
                picture: u.picture || '',
                role: u.role || 'attendee',
                uId: u.uId || '',
                dob: u.dob || '',
                deviceToken: u.deviceToken || '',
                business: u.business || undefined,
                interests: u.interests || [],
                profileSetup: Boolean(u.profileSetup),
                businessSetup: Boolean(u.businessSetup),
                eventsIds: u.eventsIds || [],
                followersIds: u.followersIds || [],
                followingsIds: u.followingsIds || [],
            })) as (iUser & { id: string })[];

            setUsers(normalized);
            setFilteredUsers(normalized);
        } catch (err) {
            console.log('fetch users error', err);
            burnt.toast({ title: 'Failed to load users' });
        } finally {
            setLoadingUsers(false);
        }
    }

    const tagSomeone = (person: iUser & { id: string }) => {
        const exists = taggedPeople.find(p => p.id === person.id);
        if (exists) {
            setTaggedPeople(taggedPeople.filter(p => p.id !== person.id));
        } else {
            setTaggedPeople([...taggedPeople, person]);
        }
        setUserSearchQuery('');
    }

    const tagEvent = (event: iEvent & { id: string }) => {
        setTaggedEvent(event);
        setEventTagged(true);
        handleEventSearch('');
        sheet.close();
    }

    const removeTaggedPerson = (personId: string) => {
        setTaggedPeople(taggedPeople.filter(p => p.id !== personId));
    }

    const form = useFormik({
        initialValues: {
            postText: '',
            postImg: '',
            postVideo: '',
            eventId: ''
        },
        validationSchema: object({
            // postText: string().required('Post text is required'),
            postText: string(),
            postImg: string(),
            postVideo: string(),
            eventId: string(),
        }),
        onSubmit: async () => {
            if (!form.values.postText.trim()) {
                burnt.toast({ title: 'You need to add a description' })
                return;
            }
            if (!eventTagged) {
                burnt.toast({ title: 'You need to tag an event' })
                return;
            }
            if ((!img && !video)) {
                burnt.toast({ title: 'You need to select an image or a video' })
                return;
            }
            if (!taggedPeople[0]?.id) {
                burnt.toast({ title: 'Tag someone for your post' });
                return;
            }
            setCreating(true)
            if (img && form.values.postImg.includes('file://')) {
                await uploadImg()
            }

            // if (video && form.values.postVideo.includes('file://')) {
            if (video) {
                await uploadVid()
            }

            console.log({ 'form.values.postVideo': form.values.postVideo })

            await createPost();
        }
    })

    const improveShown = form.values.postText.length > 5 && form.values.postImg;

    const improveWithAi = async () => {
        if (improving) return;

        if (!form.values.postText.trim()) {
            burnt.toast({ title: 'Write somthing first' })
            return;
        }

        if (!form.values.postImg) {
            burnt.toast({ title: 'Upload image for a good result!' })
            return;
        }

        setImproving(true);


        try {
            const formData = new FormData();
            formData.append('desc', form.values.postText.trim());

            if (img?.uri) {
                formData.append('image', {
                    uri: img.uri,
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
            // if (!res.ok) {
            //     const t = await res.text();
            //     console.log('Server error:', t);
            //     throw new Error('Server failed');
            // }

            const json = await res.json();

            console.log({ json })

            if (json?.error) {
                burnt.toast({ title: json?.error })
            }

            if (json?.data) {
                form.setFieldValue('postText', json.data);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setImproving(false);
        }
    };


    useEffect(() => {
        (async () => {
            await fetchEvents();
            fetchUsers();
        })()
    }, []);


    return (
        <Tv className="flex-1 flex-col gap-[20px] bg-white pt-[24px] pb-[40px]">
            <Tv className="w-full h-auto pb-[20px] border-b-[1px] border-b-[#D5D5D5]">
                <Container className="h-auto flex-col gap-[20px]" style={[view.hAuto]}>
                    <Tv className="flex-row gap-[20px]">
                        <Img className="w-[40px] h-[40px] rounded-full" source={{ uri: user?.picture }} />
                        <Tv className="flex-1">
                            <Urbanist className="text-[#212121] text-[14px] font-medium">
                                {user?.userName}
                            </Urbanist>
                        </Tv>
                    </Tv>

                    <Tv>
                        <Textarea
                            size="md"
                            isReadOnly={false}
                            isInvalid={false}
                            isDisabled={false}
                            className="w-full min-h-[80px] bg-white rounded-[12px]"
                            style={[view.borderWidth(0)]}
                        >
                            <TextareaInput
                                ref={textareaRef}
                                placeholder="What's on your mind?"
                                className="bg-[#FAFAFA] text-[14px]"
                                value={form.values.postText}
                                onChangeText={(text) => form.setFieldValue('postText', text)}
                            />
                        </Textarea>

                        {/* Improve with Ai */}
                        <Tv className="w-full flex-row items-center gap-2 py-2">
                            <Urbanist onPress={improveWithAi} className="text-[#73138C] text-[14px] font-bold" style={[improveShown ? {} : view.opacity_0_5]}>
                                Improve with Ai
                            </Urbanist>
                            {improving && (<Spinner svgColor="#73138C" style={[view.w(14), view.h(14)]} svgStyle={[view.w(14), view.h(14)]} />)}
                        </Tv>
                        {/* Improve with Ai */}
                    </Tv>

                    {/* Images */}
                    {(img || form.values.postImg) && (
                        <Tv className="w-full flex-col items-center gap-[12px]">
                            <Tv className="relative">
                                <Img className="w-[244px] h-[285px] rounded-[8px]" source={{ uri: img?.uri || form.values.postImg }} />
                            </Tv>
                        </Tv>
                    )}

                    {/* Video */}
                    {(video || form.values.postVideo) && (
                        <Tv className="w-full flex-col gap-[8px]">
                            <Tv className="relative">
                                <Img className="w-full h-[200px] rounded-[8px]" source={{ uri: video?.uri }} />
                                <Pr
                                    // onPress={() => setVideo(null)}
                                    onPress={() => form.setFieldValue('postVideo', null)}
                                    className="absolute top-2 right-2 bg-[rgba(0,0,0,0.5)] rounded-full w-[28px] h-[28px] items-center justify-center"
                                >
                                    <Urbanist className="text-white text-[16px]">×</Urbanist>
                                </Pr>
                            </Tv>
                            <Urbanist className="text-[#9E9E9E] text-[11px]">Video selected</Urbanist>
                        </Tv>
                    )}

                    {/* Tagged Event */}
                    {eventTagged && taggedEvent && (
                        <Tv className="w-full flex-row justify-between items-center p-[12px] bg-[#F3E8FF] rounded-[12px]">
                            <Tv className="flex-row gap-[12px] items-center flex-1">
                                <Img className="w-[44px] h-[44px] rounded-[8px]" source={{ uri: taggedEvent?.banner }} />
                                <Tv className="flex-1">
                                    <Urbanist className="text-[#212121] text-[13px] font-semibold">
                                        {taggedEvent?.name}
                                    </Urbanist>
                                    <Urbanist className="text-[#9E9E9E] text-[11px]">
                                        {taggedEvent?.location}
                                    </Urbanist>
                                </Tv>
                            </Tv>
                            <Pr onPress={() => setEventTagged(false)}>
                                <Urbanist className="text-[#73138C] text-[18px]">×</Urbanist>
                            </Pr>
                        </Tv>
                    )}

                    {/* Tagged People */}
                    {taggedPeople.length > 0 && (
                        <Tv className="w-full flex-col gap-[8px]">
                            <Urbanist className="text-[#212121] text-[12px] font-semibold">Tagged: {taggedPeople.length}</Urbanist>
                            <Tv className="flex-row flex-wrap gap-[8px]">
                                {taggedPeople.map((person) => (
                                    <Tv key={person.id} className="flex-row items-center gap-[6px] bg-[#E8D5F2] px-[10px] py-[6px] rounded-full">
                                        <Img className="w-[24px] h-[24px] rounded-full" source={{ uri: person.picture }} />
                                        <Urbanist className="text-[#73138C] text-[11px]">{person.firstName}</Urbanist>
                                        <Pr onPress={() => removeTaggedPerson(person.id)}>
                                            <Urbanist className="text-[#9E9E9E] text-[14px]">×</Urbanist>
                                        </Pr>
                                    </Tv>
                                ))}
                            </Tv>
                        </Tv>
                    )}

                    {/* Post Actions */}
                    <Tv className="w-auto flex-row gap-[14px] items-center">
                        {[
                            {
                                icon: <ImagePlus />,
                                action: selectImage,
                                disabled: !!video
                            },
                            {
                                icon: <Video />,
                                action: selectVideo,
                                disabled: !!img
                            },
                            {
                                icon: <Event />,
                                action: async () => {
                                    if (allEvents.length == 0) {
                                        await fetchEvents()
                                    }

                                    sheet.open();
                                    setOpen({ ...allClosed, tag: true })
                                },
                            },
                            {
                                icon: <Poll />,
                                action: async () => {
                                    if (users.length == 0) {
                                        await fetchUsers()
                                    }
                                    // sheet.open()
                                    // setOpen({ ...allClosed, usersTag: true })
                                    sheetPeople.open()
                                },
                            },
                        ].map(({ action, icon, disabled }, index) => (
                            <Pr
                                onPress={action}
                                disabled={disabled}
                                className={`w-[22px] h-[22px] ${disabled ? 'opacity-40' : ''}`}
                                key={index}
                            >
                                {icon}
                            </Pr>
                        ))}
                    </Tv>
                </Container>
            </Tv>

            {/* Buttons */}
            <Container className="h-auto flex-row">
                {/* <Btn
                    leftIcon={improving ? <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                    container={{
                        // onPress: () => !improving && improvePost(),
                        onPress: () => !improving && improveWithAi(),
                        className: 'px-3',
                        style: [view.wAuto]
                    }}
                    text={{
                        children: improving ? 'Improving...' : 'Improve with AI',
                        className: 'text-[10px]'
                    }}
                /> */}
                <Btn
                    leftIcon={creating ? <Spinner svgColor="white" style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} /> : <></>}
                    container={{
                        onPress: () => !creating && form.handleSubmit(),
                        className: 'flex-1',
                    }}
                    text={{
                        children: creating ? 'Posting...' : 'Create Post'
                    }}
                />
            </Container>

            {/* Event Tag Sheet */}
            <SheetModal
                ref={sheet.ref}
                snapPoints={[856]}
                allowSwipeDown={true}
                closeOnBackdropPress={true}
            >
                <Tv className="w-full flex-col items-center gap-[20px] rounded-tr-[20px] rounded-tl-[20px] px-[20px] bg-white pb-[40px]">
                    <Urbanist className="text-[#212121] text-[24px] font-bold">Tag Event</Urbanist>

                    <Tv className={`w-full h-[50px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px]`}>
                        <Search />
                        <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}>
                            <InputField
                                className="border-none outline-none focus:border-none focus:outline-none px-[0px]"
                                placeholder="Search events..."
                                value={eventSearchQuery}
                                onChangeText={handleEventSearch}
                            />
                        </Input>
                    </Tv>

                    <FlatList
                        data={filteredEvents}
                        renderItem={({ index, item }) => (
                            <TrendingEvent
                                onPress={() => tagEvent(item)}
                                event={item}
                                key={index}
                            />
                        )}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[view.flexCol, view.gap(10)]}
                        style={[view.wAuto, view.hAuto, view.minH(500), view.maxH(700), view.bg_transparent]}
                        ListEmptyComponent={
                            <Tv className="w-full py-[40px] items-center justify-center">
                                <Urbanist className="text-[#9E9E9E]">No events found</Urbanist>
                            </Tv>
                        }
                    />
                </Tv>
            </SheetModal>

            {/* People Tag Sheet */}
            <SheetModal
                ref={sheetPeople.ref}
                snapPoints={[600]}
                allowSwipeDown={true}
                closeOnBackdropPress={true}
            >
                <Tv className="w-full flex-col gap-[20px] rounded-tr-[20px] rounded-tl-[20px] px-[20px] bg-white pb-[40px]">
                    <Urbanist className="text-[#212121] text-[24px] font-bold">Tag People</Urbanist>

                    <Tv className={`w-full h-[50px] flex-row items-center gap-[12px] px-[20px] bg-[#FAFAFA] rounded-[16px]`}>
                        <Search />
                        <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}>
                            <InputField
                                className="border-none outline-none focus:border-none focus:outline-none px-[0px]"
                                placeholder="Search people..."
                                value={userSearchQuery}
                                onChangeText={handleUserSearch}
                            />
                        </Input>
                    </Tv>

                    <FlatList
                        data={filteredUsers}
                        renderItem={({ item }) => {
                            const isTagged = taggedPeople.some(p => p.id === item.id);
                            return (
                                <Pr
                                    onPress={() => tagSomeone(item)}
                                    className="w-full flex-row gap-[12px] items-center pb-[12px] border-b-[0.5px] border-b-[#EEEEEE]"
                                    key={item.id}
                                >
                                    <Img className="w-[36px] h-[36px] rounded-full" source={{ uri: item?.picture }} />
                                    <Tv className="flex-1">
                                        <Urbanist className="text-[#212121] text-[13px] font-medium">
                                            {item?.firstName} {item?.lastName}
                                        </Urbanist>
                                        <Urbanist className="text-[#9E9E9E] text-[11px]">@{item?.userName}</Urbanist>
                                    </Tv>
                                    <Urbanist className={`text-[12px] font-medium ${isTagged ? 'text-[#73138C]' : 'text-[#9E9E9E]'}`}>
                                        {isTagged ? '✓ Tagged' : 'Tag'}
                                    </Urbanist>
                                </Pr>
                            );
                        }}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerClassName="flex-col gap-[10px]"
                        style={[view.hAuto, view.maxH(400)]}
                        ListEmptyComponent={
                            <Tv className="w-full py-[40px] items-center justify-center">
                                <Urbanist className="text-[#9E9E9E]">No people found</Urbanist>
                            </Tv>
                        }
                    />
                </Tv>
            </SheetModal>
        </Tv>
    );
}
export default Index;