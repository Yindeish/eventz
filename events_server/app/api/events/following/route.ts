import { ai } from '@/gemini/config';
import { iEvent } from '@/types/event';
import { iUser } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const userId = params?.userId as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    // 1. Fetch user
    const userSnap = await getDoc(doc(db, 'user', userId));
    if (!userSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = { id: userSnap.id, ...(userSnap.data() as any) } as iUser;
    const followingsIds = user.followingsIds || [];

    if (followingsIds.length === 0) {
      return NextResponse.json(
        { success: true, data: [], count: 0 },
        { status: 200 }
      );
    }

    // 2. Fetch all events
    const eventsSnap = await getDocs(collection(db, 'event'));
    const allEvents: iEvent[] = eventsSnap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as any) }) as iEvent
    );

    // 3. Filter events created by followed users
    const followedEvents = allEvents.filter((event) =>
      followingsIds.includes(event.organizerId)
    );

    if (followedEvents.length === 0) {
      return NextResponse.json(
        { success: true, data: [], count: 0 },
        { status: 200 }
      );
    }

    // 4. STRICT AI PROMPT (ranking only)
    const prompt = `
You are given a list of events.
Return the most relevant events for a user's feed.

RULES (STRICT):
- Use ONLY the provided events
- Do NOT invent or modify data
- Prefer newer and more engaging events
- Return a maximum of 20 events

OUTPUT RULE (CRITICAL):
- Output MUST be a raw JSON array
- Do NOT wrap in an object
- Do NOT add text, explanations, or markdown
- If no events are suitable, return []

Events:
${JSON.stringify(followedEvents)}
`;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    // 5. Safe parsing
    let feedEvents: iEvent[] = [];

    try {
      const raw = String(result.text || "").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        feedEvents = parsed.slice(0, 10);
      }
    } catch {
      feedEvents = followedEvents.slice(0, 10);
    }

    return NextResponse.json(
      {
        success: true,
        data: feedEvents,
        count: feedEvents.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating following feed:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to generate feed' },
      { status: 500 }
    );
  }
}
