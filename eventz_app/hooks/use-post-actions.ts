import { burnt } from "@/components/shared/burnt";
import { db } from "@/firebase-web/config/firebase";
import { collections } from "@/firebase-web/services/collections";
import { iUser } from "@/state/types/auth";
import { iPost } from "@/state/types/create-event";
import { doc, increment, updateDoc } from "firebase/firestore";


const usePostActions = ({ userId }: { userId: string }) => {

    function removeUndefined<T extends Record<string, any>>(obj: T): T {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined)
        ) as T;
    }


    async function toggleLike(postId: string, userId: string) {
        const existing = await collections.like.findOneByField("userId", userId);

        if (existing && existing.eventId === postId) {
            await collections.like.delete(existing.id);
            await updateDoc(doc(db, "post", postId), {
                likesCount: increment(-1),
            });
            burnt.toast({ title: 'Post unliked' })
            return false;
        }

        await collections.like.create({
            userId,
            eventId: postId,
        });

        await updateDoc(doc(db, "post", postId), {
            likesCount: increment(1),
        });

        burnt.toast({ title: 'Post liked' })
        return true;
    }

    async function toggleSave(postId: string, userId: string) {
        const existing = await collections.save.findOneByField("userId", userId);

        if (existing && existing.eventId === postId) {
            await collections.save.delete(existing.id);
            burnt.toast({ title: 'This post has been removed from your bookmarks' })
            return false;
        }

        await collections.save.create({
            userId,
            eventId: postId,
        });

        burnt.toast({ title: 'This post has been added to your bookmarks' })
        return true;
    }

    async function sharePost(postId: string, userId: string) {
        await collections.share.create({
            userId,
            eventId: postId,
        });

        await updateDoc(doc(db, "post", postId), {
            sharesCount: increment(1),
        });
        burnt.toast({ title: 'Post shared' })
    }

    async function repost(post: iPost, userId: string) {
        if (!post?.id) return;

        // const payload = removeUndefined<iPost>({
        //     authorId: userId,
        //     authorName: "",
        //     authorImg: "",
        //     postText: post.postText,
        //     postImg: post.postImg,
        //     postVid: post.postVid,
        //     likes: 0,
        //     comments: 0,
        //     shares: 0,
        //     friendsLikes: [],
        //     eventId: post.eventId ?? post.id, // ✅ fallback
        //     event: post.event,
        //     taggedPeopleIds: [],
        //     taggedPeople: [],
        //     createdAt: new Date(),
        //     likesCount: 0,
        //     commentsCount: 0,
        //     sharesCount: 0,
        //     repostedFrom: post.id, // optional
        // });

        try {
            const payload = removeUndefined<iPost>({
                authorImg: post?.authorImg as string,
                authorName: post?.authorName as string,
                comments: post?.comments,
                commentsCount: post?.commentsCount,
                createdAt: new Date(),
                event: post?.event,
                eventId: post?.eventId,
                friendsLikes: post?.friendsLikes,
                likes: 0,
                likesCount: 0,
                shares: 0,
                sharesCount: 0,
                taggedPeople: post?.taggedPeople,
                taggedPeopleIds: post?.taggedPeopleIds,
                author: post?.author as iUser,
                postImg: post?.postImg,
                postText: post?.postImg,
                postVid: post?.postVid,
            });

            console.log({payload})

            const reposted = await collections.post.create(payload);

            if (!reposted?.id) {
                burnt.toast({ title: 'Encountered an error' })
                return;
            }

            await updateDoc(doc(db, "post", reposted.id), {
                sharesCount: increment(1),
            });

            burnt.toast({ title: 'Post reposted' })
        } catch (error) {
            console.log({ error })
        }

    }


    // async function repost(post: any, userId: string) {
    //     const newPost = {
    //         ...post,
    //         eventId: post.eventId,
    //         postText: post.postText,
    //         postImg: post.postImg,
    //         postVid: post.postVid,
    //         likesCount: 0,
    //         commentsCount: 0,
    //         sharesCount: 0,
    //         friendsLikes: [],
    //         taggedPeople: [],
    //         taggedPeopleIds: [],
    //         createdAt: new Date(),
    //         repostedFrom: post.id,
    //         authorId: userId,
    //     };

    //     return collections.post.create(newPost);
    // }

    async function comment(
        postId: string,
        userId: string,
        text: string
    ) {
        if (!text.trim()) return;

        await collections.comment.create({
            authorId: userId as string,
            eventId: postId,
            text,
        });

        await updateDoc(doc(db, "post", postId), {
            commentsCount: increment(1),
        });

        burnt.toast({ title: 'Your comment is posted' })
    }



    return {
        like: (postId: string) => toggleLike(postId, userId),
        save: (postId: string) => toggleSave(postId, userId),
        share: (postId: string) => sharePost(postId, userId),
        repost: (post: any) => repost(post, userId),
        comment: (post: any, text: string) => comment(post, userId, text),
    };
}

export default usePostActions;