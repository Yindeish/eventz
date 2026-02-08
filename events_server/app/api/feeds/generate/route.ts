import { ai } from '@/gemini/config';
import { iEvent } from '@/types/event';
import { iFeed } from '@/types/feed';
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, query as fsQuery, orderBy, limit as fsLimit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export async function GET(request: NextRequest) {
    try {
        // Fetch latest 10 events from Firestore
        const eventsCollection = collection(db, 'event');
        // const eventsQuery = fsQuery(eventsCollection, orderBy('startTimeStamp', 'desc'), fsLimit(10));
        const eventsQuery = fsQuery(eventsCollection, orderBy('startTimeStamp', 'desc'));

        let latestEvents: iEvent[] = [];
        try {
            const snapshot = await getDocs(eventsQuery);
            latestEvents = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as iEvent[];
        } catch (err) {
            console.error('Error fetching latest events from Firestore:', err);
            latestEvents = [];
        }

        const prompt = `Your task is to get the trending events, not more than 3 and from the latest events, and generate a feed based on this interface:

        interface iEvent {
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
            goings: any[],
            goingsIds: string[],
        }

interface iFeed {
  id: string,
  headline: string,
  summary: string,
  events: iEvent[]
}

⚠️ OUTPUT RULE (CRITICAL)
Your response MUST be ONLY a JavaScript/JSON array
DO NOT include explanations, comments, headings, markdown, or extra text
DO NOT wrap the array in an object
DO NOT describe your reasoning outside the array
DO NOT RETURN events of ther structures other than the iEvent interface
ONLY GENERATE BASED on THE LIST OF EVENTS GIVEN IN THIS PROMPT

If no relevant events exist, return an empty array: []

Any response that is not a raw array is invalid.

Use these events as context: ${JSON.stringify(latestEvents)}`;

        const result = await ai.models.generateContent({
            // model: "gemini-3-pro-preview",
            model: "gemini-3-pro-preview",
            contents: prompt,
        });

        let feeds: iFeed[] = [];
        try {
            feeds = JSON.parse(result.text as string);
            if (!Array.isArray(feeds)) {
                feeds = [];
            }
        } catch {
            feeds = [];
        }

        // Save feeds to Firestore
        const savedFeeds = [];
        const feedsCollection = collection(db, 'feeds');

        for (const feed of feeds) {
            try {
                const docRef = await addDoc(feedsCollection, {
                    ...feed,
                    createdAt: serverTimestamp(),
                });
                savedFeeds.push({
                    ...feed,
                    id: docRef.id,
                });
            } catch (error) {
                console.error('Error saving feed to Firestore:', error);
            }
        }

        return NextResponse.json(
            {
                success: true,
                data: savedFeeds,
                count: savedFeeds.length,
                message: 'Feeds generated and saved to Firestore',
                prompt
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error generating feeds:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate feeds' },
            { status: 500 }
        );
    }
}
