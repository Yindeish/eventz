import Post, { iPost } from "@/components/in/post";
import PostSvg from "@/components/in/home/svgs/post";
import Container from "@/components/shared/container";
import Urbanist from "@/components/shared/fonts/urbanist";
import { Pr } from "@/components/shared/pressable";
import { useSheetRef } from "@/components/shared/sheet";
import SheetModal from "@/components/shared/sheet-modal";
import { Tv } from "@/components/shared/view";
import { useState } from "react";
import { FlatList } from "react-native";
import Event from "@/components/in/svgs/tabs/event";
import { postsArr } from "@/constants/posts";
import CommentsSheet from "./comments-sheet";
import { RefreshControl } from "react-native";

const Following = ({ posts, loading, onRefresh }: { posts: iPost[], loading: boolean, onRefresh: () => void }) => {
    const sheet = useSheetRef();

    const allSheetsClosed = {
        comment: false,
        tag: false,
        info: false,
    };
    const commentSheetOpen = {
        comment: true,
        tag: false,
        info: false,
    };
    const tagSheetOpen = {
        comment: true,
        tag: false,
        info: false,
    };
    const infoSheetOpen = {
        comment: true,
        tag: false,
        info: false,
    };

    const [sheets, setSheets] = useState(allSheetsClosed)
    const snapoints = {
        info: [158],
        tag: [385],
        comments: [385]
    };
    const [currentSnapoints, setCurrentSnappoints] = useState(snapoints.comments);
    const [currentPost, setCurretPost] = useState<iPost | null>(null);

    return (
        <Tv className="flex-1 flex-col gap-[12px] bg-white">
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                }
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

export default Following;