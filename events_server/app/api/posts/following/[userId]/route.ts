import { ai } from '@/gemini/config';
import { iPost } from '@/types/post';
import { iUser } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

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

    // 2. Fetch all posts
    const postsSnap = await getDocs(collection(db, 'post'));
    const allPosts: iPost[] = postsSnap.docs.map(
      (d) => ({ id: d.id, ...(d.data() as any) }) as iPost
    );

    // 3. Filter posts created by followed users
    const followedPosts = allPosts.filter((post) =>
      followingsIds.includes(post?.author?.id as string)
    );

    if (followedPosts.length === 0) {
      return NextResponse.json(
        { success: true, data: [], count: 0 },
        { status: 200 }
      );
    }

    // 4. STRICT AI PROMPT (ranking only)
    const prompt = `
You are given a list of posts.
Return the most relevant posts for a user's feed.

RULES (STRICT):
- Use ONLY the provided posts
- Do NOT invent or modify data
- Prefer newer and more engaging posts
- Return a maximum of 10 posts

OUTPUT RULE (CRITICAL):
- Output MUST be a raw JSON array
- Do NOT wrap in an object
- Do NOT add explanations, comments, or markdown
- If no posts are suitable, return []

Posts:
${JSON.stringify(followedPosts)}
`;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    // 5. Safe parsing
    let feedPosts: iPost[] = [];
    try {
      const parsed = JSON.parse(result.text as string);
      if (Array.isArray(parsed)) {
        feedPosts = parsed.slice(0, 10);
      }
    } catch {
      // Fallback: newest first
      feedPosts = followedPosts
        .sort((a, b) => (b.createdAt as string)?.localeCompare(a.createdAt as string))
        .slice(0, 10);
    }

    return NextResponse.json(
      {
        success: true,
        data: feedPosts,
        count: feedPosts.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating posts feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate feed' },
      { status: 500 }
    );
  }
}
