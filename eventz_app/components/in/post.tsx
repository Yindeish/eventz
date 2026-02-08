import Urbanist from "../shared/fonts/urbanist";
import { Img } from "../shared/img";
import { Pr } from "../shared/pressable";
import { Tv } from "../shared/view";
import Bookmark from "./home/svgs/bookmark";
import Love from "./home/svgs/love";
import Message from "./home/svgs/message";
import Options from "./home/svgs/options";
import Send from "./home/svgs/send";
import Share from "./home/svgs/share";
import { img } from "@/styles/img";
import { useSheetRef } from "../shared/sheet";
import { ImageSourcePropType } from "react-native";
import { iUser } from "@/state/types/auth";
import { iEvent } from "@/state/types/create-event";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useMemo, useRef, useState } from "react";
import useDay from "@/hooks/use-day";
import usePostActions from "@/hooks/use-post-actions";
import useAuth from "@/hooks/auth/useAuth";
import useShare from "@/hooks/use-media-share";
import CaptureScreen from "./capture-screen";

export interface iPost {
    id: string,
    authorName: string;
    authorImg: string | ImageSourcePropType | undefined;
    postText?: string;
    postImg?: string;
    postVid?: string;
    likes: number;
    comments: number;
    shares: number;
    friendsLikes: string[];
    author?: iUser;
    eventId: string;
    event: iEvent;
    taggedPeopleIds: string[];
    taggedPeople: iUser[];
    createdAt: Date | string;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
}


export interface iPostSheetProps {
    post: iPost;
    sheet?: ReturnType<typeof useSheetRef>;
    likeAction?: () => void;
    commentAction?: () => void;
    shareAction?: () => void;
    saveAction?: () => void;
    sendAction?: () => void;
}

const Post = ({
    post,
    sheet,
    commentAction = () => sheet?.open(),
    likeAction = () => sheet?.open(),
    saveAction = () => sheet?.open(),
    shareAction = () => sheet?.open(),
    sendAction = () => sheet?.open(),
}: iPostSheetProps) => {
    const hasImage = !!post?.postImg;
    const hasVideo = !!post?.postVid;
    const { formatTime } = useDay();
    const { user } = useAuth()
    const { like, repost, save, share } = usePostActions({ userId: user?.id as string });

    const viewRef = useRef<number | React.ReactInstance | React.RefObject<unknown>>(null);
    const { handleShare, sharing } = useShare({ viewRef })

    const player = useMemo(() => {
        if (!hasVideo) return null;

        return useVideoPlayer(post.postVid!, (p) => {
            p.loop = true;
        });
    }, [post?.postVid]);

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Number(post?.likesCount));
    const [shared, setShared] = useState(false);
    const [reposted, setReposted] = useState(false);
    const [saved, setSaved] = useState(false);
    const [repostCount, setRepostCount] = useState(Number(post?.sharesCount));

    useEffect(() => {
        if (!player) return;

        player.play();
        return () => {
            player.pause();
        };
    }, [player]);

    return (
        <CaptureScreen ref={viewRef as any}>
            <Tv className="w-full h-auto bg-white flex-row gap-[19px] pt-[12px] px-[24px] pb-[18px] border-t-[0.5px] border-t-[#BDBDBD]">
                {/* Avatar */}
                <Tv className="w-[32px] h-[32px] relative">
                    <Img source={{ uri: post?.authorImg as string }} className="w-[32px] h-[32px] rounded-full" />
                    <Tv className="w-[8px] h-[8px] bg-[#490F89] border-[1.6px] border-white rounded-full absolute bottom-0 right-0 z-[3]" />
                </Tv>

                <Tv className="flex-1 flex-col gap-[12px]">
                    {/* Header */}
                    <Tv className="w-full flex-row items-center justify-between">
                        <Tv className="w-auto flex-row gap-[4px]">
                            <Urbanist className="text-[#212121] text-[14px] font-semibold">
                                {post.authorName}
                            </Urbanist>
                            <Urbanist className="text-[#757575] text-[12px] font-medium">
                                · {formatTime(post?.createdAt)}
                            </Urbanist>
                        </Tv>

                        {/* <Pr onPress={() => sheet?.open()} className="pl-1.5 py-1"> */}
                        <Pr className="pl-1.5 py-1">
                            <Options />
                        </Pr>
                    </Tv>

                    {/* Text */}
                    {!!post?.postText && (
                        <Tv>
                            <Urbanist className="text-[14px] font-medium">
                                {post.postText}
                            </Urbanist>
                        </Tv>
                    )}

                    {/* Image */}
                    {hasImage && !hasVideo && (
                        <Tv className="w-full h-[374px] relative">
                            <Img source={{ uri: post.postImg }} className="w-full h-full rounded-[8px]" />
                        </Tv>
                    )}

                    {/* Video */}
                    {hasVideo && !hasImage && player && (
                        <Tv className="w-full h-[374px] relative">
                            <VideoView
                                className="w-full h-full rounded-[8px]"
                                player={player}
                                allowsFullscreen
                                allowsPictureInPicture
                            />
                        </Tv>
                    )}

                    {/* Actions */}
                    <Tv className="w-full flex-row items-center gap-[24px]">
                        {[
                            {
                                icon: <Love color={liked ? '#F54336' : 'gray'} />, action: () => {
                                    if (liked) {
                                        like(post?.id as string);
                                        setLiked(false);
                                        setLikeCount(likeCount - 1)
                                    } else {
                                        like(post?.id as string);
                                        setLiked(true);
                                        setLikeCount(likeCount + 1)
                                    }
                                    // likeAction();
                                },
                                // value: post.likesCount
                                value: likeCount
                            },
                            {
                                icon: <Message />, action: commentAction, value: post.commentsCount
                            },
                            {
                                icon: <Share />, action: async () => {
                                    // share(post?.id as string);
                                    // shareAction();
                                    if (reposted) {
                                        setReposted(false);
                                        setRepostCount(repostCount - 1)
                                    } else {
                                        repost(post?.id as string);
                                        setReposted(true);
                                        setRepostCount(repostCount + 1)
                                    }
                                    // shareAction();
                                },
                                // value: post.sharesCount
                                value: Number(repostCount)
                            },
                        ].map(({ icon, value, action }, index) => (
                            <Pr key={index} onPress={action} className="w-auto flex-row items-center gap-[4px]">
                                {icon}
                                <Urbanist className="text-[#616161] text-[12px] font-normal">
                                    {value}
                                </Urbanist>
                            </Pr>
                        ))}

                        {[
                            {
                                icon: <Send color={shared ? '#73138C' : 'gray'} />, action: () => {
                                    // share(post?.id as string);
                                    // sendAction()
                                    if (shared) {
                                        share(post?.id as string);
                                        setShared(false);
                                        // share(post?.id as string);
                                        // setShared(false);
                                    } else {
                                        handleShare({
                                            onShared: () => {
                                                share(post?.id as string);
                                                setShared(true);
                                            }
                                        })
                                    }
                                }
                            },
                            {
                                icon: <Bookmark color={saved ? "#73138C" : "#616161"} />, action: () => {
                                    // save(post?.id as string);
                                    // saveAction()
                                    if (saved) {
                                        save(post?.id as string);
                                        setSaved(false);
                                    } else {
                                        save(post?.id as string);
                                        setSaved(true);
                                    }
                                }
                            },
                        ].map(({ icon, action }, index) => (
                            <Pr key={index} onPress={action} className="w-auto">
                                {icon}
                            </Pr>
                        ))}
                    </Tv>

                    {/* Likes */}
                    <Tv className="w-full flex-row items-center gap-[6px]">
                        <Tv className="w-auto flex-row">
                            {post.friendsLikes?.slice(0, 5).map((imgItem, index) => (
                                <Img
                                    key={index}
                                    source={{ uri: imgItem }}
                                    style={[img.mr(-4)]}
                                    className="w-[16px] h-[16px] rounded-full bg-[#D9D9D9]"
                                />
                            ))}
                        </Tv>

                        <Urbanist className="text-[8px] font-normal">
                            {/* {post.likesCount} likes */}
                            {likeCount} likes
                        </Urbanist>
                    </Tv>
                </Tv>
            </Tv>
        </CaptureScreen>
    );
};

export default Post;
