import { iComment, iCommentLike, iEvent, iFeed, iGoing, iLike, iSave, iShare, iTicket, iTrending } from "@/state/types/create-event";
import { Db } from "./firestore.service";
import { iUser } from "@/state/types/auth";
import { iPost } from "@/components/in/post";


export const collections = {
    user: Db<Partial<iUser>>('user'),
    event: Db<Partial<iEvent>>('event'),
    post: Db<Partial<iPost>>('post'),
    trending: Db<Partial<iTrending>>('trending'),
    feeds: Db<Partial<iFeed>>('feeds'),
    comment: Db<Partial<iComment>>('comment'),
    commentlike: Db<Partial<iCommentLike>>('commentlike'),
    community: Db<Partial<iEvent>>('community'),
    going: Db<Partial<iGoing>>('going'),
    like: Db<Partial<iLike>>('like'),
    message: Db<Partial<iEvent>>('message'),
    save: Db<Partial<iSave>>('save'),
    share: Db<Partial<iShare>>('share'),
    ticket: Db<Partial<iTicket>>('ticket'),
}