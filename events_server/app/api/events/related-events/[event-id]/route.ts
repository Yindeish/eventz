import { ai } from '@/gemini/config';
import { iEvent } from '@/types/event';
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ 'event-id': string }> }
) {
    try {
        const { 'event-id': eventId } = await params;

        // Fetch reference event from Firestore
        let referenceEvent: iEvent | null = null;
        try {
            const eventDocRef = doc(db, 'event', eventId);
            const eventDocSnap = await getDoc(eventDocRef);
            if (eventDocSnap.exists()) {
                referenceEvent = { id: eventDocSnap.id, ...(eventDocSnap.data() as any) } as iEvent;
            }
        } catch (err) {
            console.error('Error fetching reference event from Firestore:', err);
        }

        // If reference event not found, return error
        if (!referenceEvent) {
            return NextResponse.json(
                { success: false, error: 'Reference event not found' },
                { status: 404 }
            );
        }

        // Fetch all events from Firestore
        let allEvents: iEvent[] = [];
        try {
            const eventsCollection = collection(db, 'event');
            const snapshot = await getDocs(eventsCollection);
            allEvents = snapshot.docs
                .map((d) => ({ id: d.id, ...(d.data() as any) }) as iEvent)
                .filter((e) => e.id !== eventId); // Exclude the reference event itself
        } catch (err) {
            console.error('Error fetching all events from Firestore:', err);
            allEvents = [];
        }

        console.log({ allEvents })


        const prompt = `Your task is to return a list of events that are similar to a given reference event.

Reference Event:
${JSON.stringify(referenceEvent)}

Available Events to Choose From:
${JSON.stringify(allEvents)}

Return a maximum of 10 related events.

⚠️ OUTPUT RULE (CRITICAL)
Your response MUST be ONLY a JavaScript/JSON array
DO NOT include explanations, comments, headings, markdown, or extra text
DO NOT wrap the array in an object
DO NOT describe your reasoning outside the array

If no relevant events exist, return an empty array: []

Any response that is not a raw array is invalid.`;

        const result = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
        });

        // Parse the response to ensure it's valid JSON array
        let relatedEvents: iEvent[] = [];
        try {
            const parsed = JSON.parse(result.text as string);
            if (Array.isArray(parsed)) {
                relatedEvents = parsed.slice(0, 10); // Limit to 4 events
            }
        } catch {
            relatedEvents = [];
        }

        return NextResponse.json(
            {
                prompt,
                success: true,
                data: relatedEvents,
                count: relatedEvents.length
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching related events:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch related events' },
            { status: 500 }
        );
    }
}
