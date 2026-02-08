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
import { iUser } from '@/types/user';

const IMAGES = [
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
You are generating seed data for a social event post application.

Generate EXACTLY 10 post objects.

Return ONLY a valid JSON array.
No markdown.
No commentary text.

Each object MUST follow this exact shape:

{
  "authorName": "",
  "authorImg": "",
  "postText": string,
  "postImg": string | null,
  "postVid": null,
  "likes": number,
  "comments": number,
  "shares": number,
  "friendsLikes": string[],
  "author": null,
  "eventId": string,
  "event": object,
  "taggedPeopleIds": string[],
  "taggedPeople": [],
  "createdAt": string,
  "likesCount": number,
  "commentsCount": number,
  "sharesCount": number
}

Rules:
- Exactly 10 objects.
- No id field anywhere.
- postImg MUST be one of the provided images below.
- postVid must always be null.
- authorName, authorImg, author must be empty/null.
- taggedPeople must be empty array.
- All numeric fields must be numbers, not strings.
- createdAt must be ISO date strings in February 2026 or later.
- event must be realistic.
- Do NOT invent extra fields.

Use ONLY these images for postImg:

${IMAGES.join("\n")}
`;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    const raw = String(result.text || "")
      .replace(/```json|```/g, "")
      .trim();

    let posts: any[] = [];

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed) || parsed.length !== 10) {
        throw new Error("Invalid AI output");
      }

      posts = parsed.map(p => ({
        ...p,
        likes: Number(p.likes) || 0,
        comments: Number(p.comments) || 0,
        shares: Number(p.shares) || 0,
        likesCount: Number(p.likesCount) || 0,
        commentsCount: Number(p.commentsCount) || 0,
        sharesCount: Number(p.sharesCount) || 0,
        friendsLikes: Array.isArray(p.friendsLikes) ? p.friendsLikes : [],
        taggedPeopleIds: Array.isArray(p.taggedPeopleIds) ? p.taggedPeopleIds : [],
        taggedPeople: [],
        postVid: null,
      }));
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid AI JSON output", raw },
        { status: 400 }
      );
    }

    const usersSnap = await getDocs(collection(db, "user"));
    const users = usersSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as unknown as iUser[];

    if (!users.length) {
      return NextResponse.json(
        { success: false, error: "No users found" },
        { status: 400 }
      );
    }

    const savedPosts: any[] = [];
    const postsCollection = collection(db, "post");

    for (const post of posts) {
      const shuffledUsers = shuffle(users);
      const author = shuffledUsers[0];

      const enrichedPost = {
        ...post,
        postImg: post.postImg || IMAGES[Math.floor(Math.random() * IMAGES.length)],
        author,
        authorName: author?.userName,
        authorImg: author?.picture,
      };

      const docRef = await addDoc(postsCollection, {
        ...enrichedPost,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "post", docRef.id), {
        id: docRef.id,
      });

      savedPosts.push({
        id: docRef.id,
        ...enrichedPost,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: savedPosts,
        count: savedPosts.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding posts:", error);

    return NextResponse.json(
      { success: false, error: "Failed to seed posts" },
      { status: 500 }
    );
  }
}
