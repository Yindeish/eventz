import { ai } from '@/gemini/config';
import { iTrending, iEvent } from '@/types/event';
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query as fsQuery, orderBy, limit as fsLimit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

export async function GET(request: NextRequest) {
    try {
        // Fetch latest 10 events from Firestore to provide context to the AI
        const eventsCollection = collection(db, 'event');
        // const eventsQuery = fsQuery(eventsCollection, orderBy('startTimeStamp', 'desc'), fsLimit(10));
        const eventsQuery = fsQuery(eventsCollection, orderBy('startTimeStamp', 'desc'));

        let latestEvents: iEvent[] = [];
        try {
            const snapshot = await getDocs(eventsQuery);
            latestEvents = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as iEvent[];
        } catch (err) {
            console.error('Error fetching latest events for trending generation:', err);
            latestEvents = [];
        }

        const prompt = `Generate a list of currently trending event topics based on the list provided in this context ALONE. Don't add your own idea.

    Each trending item should have:
    - id: unique identifier
    - title: trending topic title (STRICT: ONE word OR at most TWO words only — do NOT exceed two words; use only letters and a single space between words; no punctuation or punctuation characters)
    - description: brief description
    - category: event category (Music, Art, Health, Business, Banking, Reading)
    - eventCount: number of related events
    - events: events associated with the currently trending event topics. an individual event has. this interface 
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
        goings: any[],
        goingsIds: string[],
    }
    - eventsIds: ids of the events associated with the currently trending event topics

    Rules (STRICT):
    - The 'title' field MUST be exactly one word or two words separated by a single space. Examples: "Concert", "Street Food".
    - Do NOT include punctuation, symbols, or additional whitespace in the 'title' field.
    - Return only a pure JavaScript/JSON array (no surrounding object, no markdown, no commentary). If none, return an empty array [].

    Use these events as context: ${JSON.stringify(latestEvents)}`;

        const result = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
        });

        // Parse the response to ensure it's valid JSON
        let trending: iTrending[] = [];
        try {
            trending = JSON.parse(result.text as string);
            if (!Array.isArray(trending)) {
                trending = [];
            }
        } catch {
            trending = [];
        }

        // Save to Firestore `trending` collection
        const saved: any[] = [];
        try {
            const trendingCollection = collection(db, 'trending');
            for (const t of trending) {
                try {
                    const docRef = await addDoc(trendingCollection, {
                        ...t,
                        createdAt: serverTimestamp(),
                    });
                    saved.push({ ...t, id: docRef.id });
                } catch (err) {
                    console.error('Error saving trending item to Firestore:', err);
                }
            }
        } catch (err) {
            console.error('Error while saving trending items:', err);
        }

        return NextResponse.json(
            {
                success: true,
                data: saved.length ? saved : trending,
                count: (saved.length ? saved.length : trending.length),
                prompt
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error generating trending:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate trending items' },
            { status: 500 }
        );
    }
}
