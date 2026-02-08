import { iUser } from "./user";


// export type tTicketType = 'Free' | 'Paid' | 'Donation';
export type tTicketType = 'free' | 'paid';
export type tTicketStatus = 'paid' | 'pending' | 'completed' | 'cancelled';

export interface iTopic {
    id: string,
    title: string,
    description: string,
    category: iEvent['category'],
}

export interface iFeed {
    id: string,
    headline: string,
    summary: string,
    events: iEvent[]
}

export interface iTrending {
    id: string,
    title: string,
    description: string,
    category: iEvent['category'],
    eventCount: number,
    eventsIds: string[],
    events: iEvent[]
}

export interface iLike {
    userId: string,
    user: iUser,
    eventId: string,
    event: iEvent,
}

export interface iCommentLike {
    userId: string,
    user: iUser,
    eventId: string,
    event: iEvent,
}

export interface iShare {
    userId: string,
    user: iUser,
    eventId: string,
    event: iEvent,
}

export interface iSave {
    userId: string,
    user: iUser,
    eventId: string,
    event: iEvent,
}

export interface iGoing {
    userId: string,
    user: iUser,
    eventId: string,
    event: iEvent,
}

export interface iComment {
    author: iUser,
    authorId: string,
    text: string,
    eventId: string
    event: iEvent,
}

export interface iGallery {
    id: number
    uri?: string,
    url?: string
};

export interface iTicket {
    id: string,
    eventId: string,
    event: iEvent,
    userId: string,
    user: iUser,
    // type: 'Free' | 'Paid' | 'Donation',
    type: tTicketType,
    status: tTicketStatus,
    price: number,
    quantity?: number,
}

export interface iEvent {
    id: string
    name: string,
    location: string,
    participants: number,
    startDate: string,
    endDate: string,
    time: string,
    startTimeStamp: string,
    endTimeStamp: string,
    category: string,
    about: string,
    banner: string;
    gallery: string[],
    organizerId: string,
    organizer?: iUser,
    artistsIds: string[],
    artists?: iUser[],
    ticket: {
        type: tTicketType,
        economyPrice: number,
        vipPrice: number,
    },
    ticketsIds?: string[],
    tickets?: iTicket[],
    commentsIds?: string[],
    comments?: any[],
    likesIds?: string[],
    likes?: iUser[],
    sharesCount: number,
    likesCount: number,
    commentsCount: number,
    goingsCount: number,
    goings: iUser[],
    goingsIds: string[],
}

