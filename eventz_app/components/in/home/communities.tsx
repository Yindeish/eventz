import Post, { iPost } from "@/components/in/post";
import PostSvg from "@/components/in/home/svgs/post";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import { useSheetRef } from "@/components/shared/sheet";
import SheetModal from "@/components/shared/sheet-modal";
import { Tv } from "@/components/shared/view";
import { Ref, useRef, useState } from "react";
import { FlatList, ImageSourcePropType, RefreshControl } from "react-native";
import Event from "@/components/in/svgs/tabs/event";
import { postsArr } from "@/constants/posts";
import { Ts } from "@/components/shared/scroll-view";
import ChevronRightStretchThin from "./svgs/chevron-right-stretch-thin";
import { Img } from "@/components/shared/img";
import { view } from "@/styles/view";
import { router } from "expo-router";
import CommentsSheet from "./comments-sheet";
import CreateEventPost from "./sheets/create-event-post";


type tFlatlist = React.Ref<FlatList<{ authorImg: any; authorName: string; }>>;

const Communities = ({ posts, loading, onRefresh }: { posts: iPost[], loading: boolean, onRefresh: () => void }) => {
    const sheet = useSheetRef();
    const communitiesContainerRef = useRef<tFlatlist | null>(null);
    const scrollIndex = useRef(0);

    const allSheetsClosed = {
        comment: false,
    };
    const commentSheetOpen = {
        comment: true,
    };
    const [sheets, setSheets] = useState(allSheetsClosed);
    const snapoints = {
        info: [158],
        tag: [385],
        comments: [385]
    };
    const [currentSnapoints, setCurrentSnappoints] = useState(snapoints.comments);
    const [communities,] = useState(postsArr.concat(postsArr.concat(postsArr)).map(({ postImg, postText }) => ({ authorImg: postImg, authorName: postText.slice(0, 7) })))
    const paddedCommunitiesSize = communities.slice(0, 7).length;
    const [currentPost, setCurretPost] = useState<iPost | null>(null);


    const handleNext = () => {
        const flatList = communitiesContainerRef?.current as tFlatlist;
        if (!flatList) return;

        const nextIndex = scrollIndex.current + 1;

        if (nextIndex >= communities.length) {
            scrollIndex.current = 0;
            (flatList as any)?.scrollToIndex({
                index: 0,
                animated: true,
            });
            return;
        }
        scrollIndex.current = nextIndex;

        (flatList as any)?.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.5,
        });
    }
    // const handleNext = () => {
    //     const flatList = communitiesContainerRef?.current as tFlatlist;
    //     if (!flatList) return;

    //     const nextIndex = scrollIndex.current + 1;

    //     if (nextIndex >= paddedCommunitiesSize) {
    //         scrollIndex.current = 0;
    //         router.push('/(in)/home/communities')
    //         return;
    //     }
    //     scrollIndex.current = nextIndex;

    //     (flatList as any)?.scrollToIndex({
    //         index: nextIndex,
    //         animated: true,
    //         viewPosition: 0.5,
    //     });
    // }

    return (
        <Tv className="flex-1 flex-col gap-[12px] bg-white">
            {/* Communties Snippet */}
            <Tv className="w-full h-fit flex-row gap-[12px] py-[12px] px-[24px]">
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                    }
                    ref={communitiesContainerRef as tFlatlist}
                    data={communities}
                    renderItem={({ index, item: community }) => (
                        <Pr className="h-auto flex-col items-center gap-[6px]" key={index}>
                            <Img className="w-[38px] h-[38px] rounded-full" source={community?.authorImg as ImageSourcePropType} />

                            <Urbanist className="text-[#757575] text-[10px] font-semibold">{community?.authorName}</Urbanist>
                        </Pr>
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[view.flexRow, view.gap(10)]}
                    style={[view.wAuto, view.hFull]}
                />
                <Pr
                    onPress={handleNext}
                    className="w-[55px] h-[55px] flex items-center justify-center rounded-full bg-white border border-[#F5F5F5]">
                    <ChevronRightStretchThin />
                </Pr>
            </Tv>
            {/* Communties Snippet */}

            <FlatList
                data={posts}
                renderItem={({ index, item: post }) => (
                    <Post sheet={sheet} post={post}
                        commentAction={() => {
                            setCurretPost(post);
                            sheet.open()
                            setSheets(commentSheetOpen);
                            setCurrentSnappoints(snapoints.comments)
                        }}
                        key={index} />
                )}
                showsVerticalScrollIndicator={false}
            />

            {/* Sheets */}
            <SheetModal
                ref={sheet.ref}
                snapPoints={[211]}
                allowSwipeDown={true}
                closeOnBackdropPress={true}
                onDismiss={() => {
                    setSheets(allSheetsClosed)
                    setCurrentSnappoints(snapoints.comments)
                }}
            >
                {sheets.comment == true && <CommentsSheet post={currentPost as iPost} />}

            </SheetModal>
            {/* Sheets */}
        </Tv>
    );
}

export default Communities;