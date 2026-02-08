import Urbanist from "@/components/shared/fonts/urbanist";
import { Img } from "@/components/shared/img";
import Kb from "@/components/shared/keyboard";
import { Pr } from "@/components/shared/pressable";
import { Tv } from "@/components/shared/view";
import { postsArr } from "@/constants/posts";
import { view } from "@/styles/view";
import { FlatList, ImageSourcePropType } from "react-native";
import Love from "./svgs/love";
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { iPost } from "../post";
import { Ref, useEffect, useState } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useSheetRef } from "@/components/shared/sheet";
import { Ti } from "@/components/shared/text-input";
import Emoji from "./svgs/emoji";
import { collections } from "@/firebase-web/services/collections";
import { iComment } from "@/state/types/create-event";
import usePostActions from "@/hooks/use-post-actions";
import useAuth from "@/hooks/auth/useAuth";
import Send from "./svgs/send";
// import { useSheetRef } from "@/components/shared/sheet";



const CommentsSheet = ({ post }: { post: iPost }) => {
    const { user } = useAuth()
    const { like, comment } = usePostActions({ userId: user?.id as string })

    const [comments, setComments] = useState<iComment[]>([]);
    const [liked, setLiked] = useState(false);
    const [msg, setMsg] = useState('');

    // const getPost = async () => {
    //     try {
    //         const postDetails = await collections.post.getById(postId);

    //     } catch (error) {
    //         console.log({error})
    //     }
    // }
    const getComments = async () => {
        try {
            const postComments = await collections.comment.findByField('eventId', post?.id);

            setComments(postComments as iComment[]);
        } catch (error) {
            console.log({ error })
        }
    }

    useEffect(() => {
        getComments()
    }, [])

    return (
        <Tv className="w-full min-h-[385px]">
            {/* <Kb> */}
            <Tv className="flex-1 flex-col gap-[24px] p-[24px] px-[0px]">
                <Urbanist className="text-[24px] font-bold text-[#212121] text-center">Comments</Urbanist>

                <FlatList
                    data={comments}
                    renderItem={(({ index, item }) => (
                        <Tv className="w-full flex-row gap-[20px]" key={index}>
                            {/* User Avatar */}
                            <Tv className="w-[32px] h-[32px] relative">
                                <Img source={{ uri: item?.author?.picture }} className="w-[32px] h-[32px] rounded-full" />
                                {/* User Active */}
                                <Tv className="w-[8px] h-[8px] bg-[#490F89] border-[1.6px] border-white rounded-full absolute bottom-0 right-0 z-[3]" />
                                {/* User Active */}
                            </Tv>
                            {/* User Avatar */}

                            <Tv className="flex-1 flex-col gap-[4px]">
                                <Tv className="w-auto flex-row gap-[4px]">
                                    <Urbanist className="text-[#212121] text-[14px] font-semibold">{item?.author?.userName}</Urbanist>
                                    {/* <Urbanist className="text-[#212121] text-[14px] font-semibold">-</Urbanist>
                                    <Urbanist className="text-[#757575] text-[12px] font-medium">{item?.}</Urbanist> */}
                                </Tv>

                                <Urbanist className="text-[#757575] text-[12px] font-medium">
                                    {item?.text}
                                </Urbanist>
                            </Tv>

                            <Pr onPress={() => setLiked(!liked)} className="w-auto" key={index}>
                                <Love color={liked ? '#F54336' : 'gray'} />
                            </Pr>
                        </Tv>
                    ))}
                    contentContainerStyle={[view.flexCol, view.gap(24), view.px(24)]}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    style={[view.wFull]}
                />

                <Tv className="w-full h-fit flex-row items-center gap-[12px] p-[24px] border-t border-t-[#EEEEEE]">
                    <Img source={postsArr[0]?.authorImg as ImageSourcePropType} className="w-[32px] h-[32px] rounded-full" />
                    <Tv className="flex-1 h-[56px] flex-row items-center gap-[12px] px-[20px] rounded-[16px] bg-[#FAFAFA]">
                        <Ti
                            value={msg}
                            onChangeText={(text) => setMsg(text)}
                            className="flex-1 border-none outline-none" />
                        {/* <Emoji /> */}
                        <Pr onPress={async () => {
                            await comment(post, msg);
                            getComments()
                        }}>
                            <Send />
                        </Pr>
                    </Tv>
                </Tv>
            </Tv>
            {/* </Kb> */}
        </Tv>
    );
}
// const CommentsSheet = () => {
//     return (
//         <BottomSheetScrollView
//             contentContainerStyle={{ flexGrow: 1, padding: 24 }}
//             keyboardDismissMode="interactive"
//             keyboardShouldPersistTaps="handled"
//         >
//             <Urbanist className="text-[24px] font-bold text-[#212121] text-center mb-[24px]">
//                 Comments
//             </Urbanist>

//             <BottomSheetFlatList
//                 data={postsArr.concat(postsArr).concat(postsArr)}
//                 keyExtractor={(_: iPost, i: number) => i.toString()}
//                 renderItem={({ item }: { item: iPost }) => (
//                     <Tv className="w-full flex-row gap-[20px] mb-[24px]">
//                         {/* Avatar */}
//                         <Tv className="w-[32px] h-[32px] relative">
//                             <Img
//                                 source={item.authorImg as ImageSourcePropType}
//                                 className="w-[32px] h-[32px] rounded-full"
//                             />
//                             <Tv className="w-[8px] h-[8px] bg-[#490F89] border-[1.6px] border-white rounded-full absolute bottom-0 right-0" />
//                         </Tv>

//                         {/* Content */}
//                         <Tv className="flex-1">
//                             <Tv className="flex-row gap-[4px]">
//                                 <Urbanist className="text-[#212121] text-[14px] font-semibold">
//                                     {item.authorName}
//                                 </Urbanist>
//                                 <Urbanist className="text-[#757575] text-[12px] font-medium">
//                                     · 14h
//                                 </Urbanist>
//                             </Tv>

//                             <Urbanist className="text-[#757575] text-[12px] font-medium">
//                                 {item.postText}
//                             </Urbanist>
//                         </Tv>

//                         <Pr>
//                             <Love />
//                         </Pr>
//                     </Tv>
//                 )}
//                 showsVerticalScrollIndicator={false}
//             />

//             <Tv className="h-[100px]" />
//         </BottomSheetScrollView>
//     );
// }
// const CommentsSheet = ({ currentSnapoints, sheet}: { currentSnapoints: number[], sheet: ReturnType<typeof useSheetRef> }) => {
//     return (
//         <BottomSheet
//             ref={sheet.ref as Ref<BottomSheetMethods>}
//             snapPoints={currentSnapoints}
//             enablePanDownToClose
//             keyboardBehavior="interactive"
//             keyboardBlurBehavior="restore"
//         >
//             <BottomSheetScrollView
//                 contentContainerStyle={{ flexGrow: 1, padding: 24 }}
//                 keyboardDismissMode="interactive"
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <Urbanist className="text-[24px] font-bold text-[#212121] text-center mb-[24px]">
//                     Comments
//                 </Urbanist>

//                 <BottomSheetFlatList
//                     data={postsArr}
//                     keyExtractor={(_: iPost, i: number) => i.toString()}
//                     renderItem={({ item }: { item: iPost }) => (
//                         <Tv className="w-full flex-row gap-[20px] mb-[24px]">
//                             {/* Avatar */}
//                             <Tv className="w-[32px] h-[32px] relative">
//                                 <Img
//                                     source={item.authorImg as ImageSourcePropType}
//                                     className="w-[32px] h-[32px] rounded-full"
//                                 />
//                                 <Tv className="w-[8px] h-[8px] bg-[#490F89] border-[1.6px] border-white rounded-full absolute bottom-0 right-0" />
//                             </Tv>

//                             {/* Content */}
//                             <Tv className="flex-1">
//                                 <Tv className="flex-row gap-[4px]">
//                                     <Urbanist className="text-[#212121] text-[14px] font-semibold">
//                                         {item.authorName}
//                                     </Urbanist>
//                                     <Urbanist className="text-[#757575] text-[12px] font-medium">
//                                         · 14h
//                                     </Urbanist>
//                                 </Tv>

//                                 <Urbanist className="text-[#757575] text-[12px] font-medium">
//                                     {item.postText}
//                                 </Urbanist>
//                             </Tv>

//                             <Pr>
//                                 <Love />
//                             </Pr>
//                         </Tv>
//                     )}
//                     showsVerticalScrollIndicator={false}
//                 />

//                 <Tv className="h-[100px]" />
//             </BottomSheetScrollView>
//         </BottomSheet>
//     );
// }

export default CommentsSheet;