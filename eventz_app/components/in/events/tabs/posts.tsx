import { Tv } from "@/components/shared/view";
import { postsArr } from "@/constants/posts";
import { useState } from "react";
import { FlatList } from "react-native";
import Post, { iPost } from "../../post";
import { useSheetRef } from "@/components/shared/sheet";
import Kb from "@/components/shared/keyboard";
import SheetModal from "@/components/shared/sheet-modal";
import CommentsSheet from "../../home/comments-sheet";


const Posts = ({posts}:{posts: iPost[]}) => {
    const sheet = useSheetRef()

    const snapoints = {
        info: [158],
        tag: [385],
        comments: [385]
    };
    const [currentSnapoints, setCurrentSnappoints] = useState(snapoints.comments);
    const [sheets, setSheets] = useState({
        comment: false,
        tag: false,
        info: false,
    })



    return (
        <Tv className="flex-1 flex-col gap-[12px] bg-white">
            <Kb>
                <Tv className="flex-1">
                    <FlatList
                        data={posts}
                        renderItem={({ index, item: post }) => (
                            <Post sheet={sheet} post={post} key={index} />
                        )}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Sheets */}
                    <SheetModal
                        ref={sheet.ref}
                        snapPoints={currentSnapoints}
                        allowSwipeDown={true}
                        closeOnBackdropPress={true}
                    >
                        <CommentsSheet />
                    </SheetModal>
                    {/* Sheets */}
                </Tv>
            </Kb>
        </Tv>
    );
}

export default Posts;