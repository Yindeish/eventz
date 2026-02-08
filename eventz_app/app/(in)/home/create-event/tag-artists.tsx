import CreatEventSuccessful from "@/components/in/home/create-event/modals/create-event-successful";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Tv } from "@/components/shared/view";
import { Pr } from "@/components/shared/pressable";
import { Img } from "@/components/shared/img";
import { Input, InputField } from "@/components/ui/input";
import { useLocalSearchParams, router } from "expo-router";
import useSafeAreaView from "@/hooks/layout/use-safe-area-view";
import { view } from "@/styles/view";
import { useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Db } from "@/firebase-web/services/firestore.service";
import { iUser } from "@/state/types/auth";
import { burnt } from "@/components/shared/burnt";
import { Pr as Press } from "@/components/shared/pressable";
import { postsArr } from "@/constants/posts"; // fallback avatar list if needed
import WrapperDialog from "@/components/shared/wrapper-dialogue";
import Spinner from "@/components/shared/spinner";
import { useAppDispatch } from "@/state/hooks/useRtk";
import { setCreateEventState } from "@/state/slices/create-event";

const TagArtists = () => {
    const { insets } = useSafeAreaView();
    const { eventId } = useLocalSearchParams();
    const dispatch = useAppDispatch()

    const [allUsers, setAllUsers] = useState<(iUser & { id: string })[]>([]);
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [filtered, setFiltered] = useState<(iUser & { id: string })[]>([]);
    const [selected, setSelected] = useState<(iUser & { id: string })[]>([]);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [msg, setMsg] = useState('');

    // fetch all users once
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const users = await Db<iUser>("user").getAll();
                if (!mounted) return;
                // ensure each has id and consistent shape
                setAllUsers(users as (iUser & { id: string })[]);
            } catch (err) {
                console.log("fetch users error", err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // watch query and show/hide results when it starts with @
    useEffect(() => {
        const trimmed = query.trim();
        if (trimmed.length === 0) {
            setShowResults(false);
            setFiltered([]);
            return;
        }

        if (trimmed.startsWith("@")) {
            const q = trimmed.slice(1).toLowerCase();
            setShowResults(true);
            if (q.length === 0) {
                // show top N
                setFiltered(allUsers.slice(0, 20));
            } else {
                const matches = allUsers.filter((u) => {
                    return (
                        (u.userName && u.userName.toLowerCase().includes(q)) ||
                        (`${u.firstName} ${u.lastName}`.toLowerCase().includes(q)) ||
                        (u.firstName && u.firstName.toLowerCase().includes(q)) ||
                        (u.lastName && u.lastName.toLowerCase().includes(q))
                    );
                });
                setFiltered(matches.slice(0, 50));
            }
        } else {
            setShowResults(false);
            setFiltered([]);
        }
    }, [query, allUsers]);

    const toggleSelect = (user: iUser & { id: string }) => {
        const exists = selected.find((s) => s.id === user.id);
        if (exists) {
            setSelected((s) => s.filter((x) => x.id !== user.id));
        } else {
            setSelected((s) => [...s, user]);
        }
        setQuery(""); // optionally clear query after selecting
        setShowResults(false);
    };

    const removeSelected = (id: string) => {
        setSelected((s) => s.filter((x) => x.id !== id));
    };

    const handleContinue = async () => {
        if (!eventId) {
            burnt.toast({ title: "Event ID missing" });
            return;
        }

        if (selected.length === 0) {
            burnt.toast({ title: "Tag at least one artist or speaker" });
            return;
        }

        setLoading(true);
        try {
            const artistsIds = selected.map((s) => s.id);
            // Clean artists to omit undefined fields (Firestore doesn't allow undefined values)
            const artists = selected.map((s) => {
                const obj: any = { id: s.id };
                if (s.firstName) obj.firstName = s.firstName;
                if (s.lastName) obj.lastName = s.lastName;
                if (s.userName) obj.userName = s.userName;
                if (s.picture) obj.picture = s.picture;
                if (s.role) obj.role = s.role;
                if (s.uId) obj.uId = s.uId;
                return obj;
            });

            await Db("event").update(eventId as string, {
                artistsIds,
                artists,
            });

            setMsg("You have successfully tagged artists/speakers to your event.");
            setModalOpen(true);

            setTimeout(() => {
                router.push("/(in)/(tabs)");
                setModalOpen(false);
                dispatch(setCreateEventState({ key: 'gallery', value: [] }))
            }, 1500)

        } catch (err) {
            console.log("update event error", err);
            burnt.toast({ title: "Failed to tag artists. Try again." });
        } finally {
            setLoading(false);
        }

    };

    const renderUser = ({ item }: { item: iUser & { id: string } }) => {
        const isSelected = !!selected.find((s) => s.id === item.id);
        return (
            <Pr onPress={() => toggleSelect(item)} className="w-full h-[45px] px-4 flex-row items-center gap-3">
                <Img source={item.picture ? { uri: item.picture } : postsArr[0]?.postImg} className="w-[35px] h-[35px] rounded-full" />
                <Tv className="flex-1">
                    <Urbanist className="text-[12px] font-medium">{`${item.firstName} ${item.lastName}`}</Urbanist>
                    <Urbanist className="text-[#9E9E9E] text-[11px]">@{item.userName}</Urbanist>
                </Tv>
                {/* <Tv className="w-[70px] flex-row items-center justify-end"> */}
                <Urbanist className="text-[12px] text-[#73138C]">{isSelected ? "Selected" : "Tag"}</Urbanist>
                {/* </Tv> */}
            </Pr>
        );
    };

    const selectedChips = useMemo(
        () =>
            selected.map((s) => (
                <Tv key={s.id} className="flex-row items-center gap-2 bg-[#F3E8FF] px-3 py-2 rounded-full mr-2">
                    <Img source={s.picture ? { uri: s.picture } : postsArr[0]?.postImg} className="w-[28px] h-[28px] rounded-full" />
                    <Urbanist className="text-[#73138C] text-[12px]">{s.firstName}</Urbanist>
                    <Press onPress={() => removeSelected(s.id)} className="ml-2">
                        <Urbanist className="text-[#9E9E9E]">×</Urbanist>
                    </Press>
                </Tv>
            )),
        [selected]
    );

    return (
        <Tv className="flex-1 bg-white py-[24px]" style={[view.mb(insets.bottom)]}>
            <Container className="flex-col">
                <Tv className="w-full flex-col gap-[16px]">
                    <Urbanist className="text-[#212121] text-[12px] font-medium">To engage your audience, tag artists and speakers</Urbanist>

                    <Tv>
                        <Tv className={`w-full h-[60px] flex-row items-center gap-[12px] px-[12px] bg-[#FAFAFA] border-[1px] border-[#FAFAFA] rounded-[16px]`}>
                            <Tv className="w-auto">
                                {/* placeholder for Person icon if available */}
                                <Tv />
                            </Tv>
                            <Input className="flex-1 border-none outline-none focus:border-none focus:outline-none" style={[view.borderWidth(0)]}>
                                <InputField
                                    value={query}
                                    onChangeText={(t) => setQuery(t)}
                                    className="border-none outline-none focus:border-none focus:outline-none px-[0px]"
                                    placeholder="@ to tag artists"
                                />
                            </Input>
                        </Tv>

                        {/* selected chips */}
                        {selected.length > 0 && (
                            <Tv className="w-full flex-row flex-wrap mt-3">
                                {selectedChips}
                            </Tv>
                        )}

                        {/* results list */}
                        {showResults && filtered.length > 0 && (
                            <Tv className="w-full mt-3 rounded-[8px] border-[1px] border-[#EEE] bg-white" style={[{ maxHeight: 300 }]}>
                                <FlatList
                                    data={filtered}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderUser}
                                    keyboardShouldPersistTaps="handled"
                                    contentContainerClassName="flex-col gap-[3px]"
                                />
                            </Tv>
                        )}

                        {/* no results */}
                        {showResults && filtered.length === 0 && (
                            <Tv className="w-full mt-3 px-4 py-3 bg-white rounded-[8px] border-[1px] border-[#EEE]">
                                <Urbanist className="text-[#9E9E9E]">No artists found</Urbanist>
                            </Tv>
                        )}
                    </Tv>
                </Tv>

                <Tv className="flex-1" />

                <Tv className="w-full flex-row gap-[12px]">
                    <Pr
                        className="flex-1 bg-[#EEDDFF] py-3 rounded-[10px] items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <Urbanist className="text-[#73138C]">Skip</Urbanist>
                    </Pr>

                    <Pr
                        className="flex-1 bg-[#73138C] py-3 rounded-[10px] flex-row items-center justify-center"
                        onPress={() => !loading && handleContinue()}
                    >
                        {loading && (<Spinner style={[view.w(16), view.h(16)]} svgStyle={[view.w(16), view.h(16)]} />)}
                        <Urbanist className="text-white">{loading ? "Updating..." : "Continue"}</Urbanist>
                    </Pr>
                </Tv>
            </Container>

            {/* Modals */}
            <WrapperDialog isOpen={modalOpen} onClose={() => setModalOpen(false)} closeOnOverlayClick={false}>
                <CreatEventSuccessful msg={msg} onClose={() => setModalOpen(false)} />
            </WrapperDialog>
            {/* Modals */}
        </Tv>
    );
};

export default TagArtists;