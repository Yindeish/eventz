import { iEvent } from "./event";
import { iUser } from "./user";

export interface iPost {
    authorName: string;
    authorImg: string;
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