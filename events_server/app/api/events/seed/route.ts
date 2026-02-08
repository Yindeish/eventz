import { ai } from '@/gemini/config';
import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/firebase';

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1761839257664-ecba169506c1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
  "https://plus.unsplash.com/premium_photo-1769380789060-6244d5835d8e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1769607590916-70161e6020db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1767961932888-6bd98b732200?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1768562821733-be6788db0666?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1768727043774-04a8a3849331?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1761850648640-2ee5870ee883?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1769002240965-7cc4b129d81a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1769109002317-da4a97d94907?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
];

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export async function GET(request: NextRequest) {
  try {
    const prompt = `
You are generating seed data for an event application.

Generate EXACTLY 10 event objects.

Each event MUST follow this exact JSON shape and types.
DO NOT include an "id" field.
DO NOT USE THIS SITE, https://example.com, FOR IMAGE as the images are not available for view. You can use unsplash instead or just use pick any of these images below for both gallery images and banners images:

"https://images.unsplash.com/photo-1761839257664-ecba169506c1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"

"https://plus.unsplash.com/premium_photo-1769380789060-6244d5835d8e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"

"https://images.unsplash.com/photo-1769607590916-70161e6020db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"

"https://images.unsplash.com/photo-1767961932888-6bd98b732200?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8"

"https://images.unsplash.com/photo-1768562821733-be6788db0666?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D"

"https://images.unsplash.com/photo-1768727043774-04a8a3849331?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D"

"https://images.unsplash.com/photo-1761850648640-2ee5870ee883?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D"

"https://images.unsplash.com/photo-1769002240965-7cc4b129d81a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D"

"https://images.unsplash.com/photo-1769109002317-da4a97d94907?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",


{
  "name": "Event name string",
  "location": "City, Country",
  "participants": 0,
  "startDate": "YYYY-MM-DD (must be Feb 2026 or later)",
  "endDate": "YYYY-MM-DD (>= startDate)",
  "time": "HH:MM (24h format)",
  "startTimeStamp": "ISO8601 timestamp string",
  "endTimeStamp": "ISO8601 timestamp string",
  "category": "Music | Business | Art | Health | Banking | Reading",
  "about": "Short description string",
  "banner": "https://images.unsplash.com/photo-1768471126957-df36ac318dc1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",
  "gallery": [],
  "organizerId": "",
  "organizer": null,
  "artistsIds": [],
  "artists": [],
  "ticket": {
    "type": "Free",
    "economyPrice": 0,
    "vipPrice": 0
  },
  "ticketsIds": [],
  "tickets": [],
  "commentsIds": [],
  "comments": [],
  "likesIds": [],
  "likes": [],
  "sharesCount": 0,
  "likesCount": 0,
  "commentsCount": 0,
  "goingsCount": 0,
  "goings": [],
  "goingsIds": []
}

Rules:
- Return ONLY a valid JSON array.
- Exactly 10 objects.
- No markdown.
- No commentary text.
- No id field anywhere.
- All dates must be in February 2026 or later.
- banner must always be exactly the same URL shown above.
- gallery must be an empty array.
- organizer, artists, organizerId, artistsIds must be empty/null because the server will fill them.
`;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    const raw = (result.text as string).replace(/```json|```/g, '').trim();

    let events: any[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length !== 10) {
        throw new Error('Invalid AI output');
      }
      events = parsed;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid AI JSON output', raw },
        { status: 400 }
      );
    }

    // ✅ Fetch users
    const usersSnap = await getDocs(collection(db, 'user'));
    const users = usersSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    if (!users.length) {
      return NextResponse.json(
        { success: false, error: 'No users found' },
        { status: 400 }
      );
    }

    const savedEvents: any[] = [];
    const eventsCollection = collection(db, 'event');

    for (const event of events) {
      const shuffledUsers = shuffle(users);

      const organizer = shuffledUsers[0];

      const artistCount = Math.floor(Math.random() * 2) + 1;
      const artists = shuffledUsers.slice(1, 1 + artistCount);

      const galleryCount = Math.floor(Math.random() * 3) + 1;
      const gallery = shuffle(GALLERY_IMAGES).slice(0, galleryCount);

      const enrichedEvent = {
        ...event,
        organizerId: organizer.id,
        organizer,
        artistsIds: artists.map(a => a.id),
        artists,
        gallery,
      };

      const docRef = await addDoc(eventsCollection, {
        ...enrichedEvent,
        createdAt: serverTimestamp(),
      });

      // ✅ write back firestore id
      await updateDoc(doc(db, 'event', docRef.id), {
        id: docRef.id,
      });

      savedEvents.push({
        id: docRef.id,
        ...enrichedEvent,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: savedEvents,
        count: savedEvents.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error seeding events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed events' },
      { status: 500 }
    );
  }
}
