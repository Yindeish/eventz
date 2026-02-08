import { iFeed } from '@/types/feed';
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query as fsQuery, orderBy, limit as fsLimit } from 'firebase/firestore';
import { db } from '@/firebase';


export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.max(1, Math.min(100, parseInt(limitParam, 10) || 20)) : 20;

    const feedsCollection = collection(db, 'feeds');
    const feedsQuery = fsQuery(feedsCollection, orderBy('createdAt', 'desc'), fsLimit(limit));

    const snapshot = await getDocs(feedsQuery);
    const feeds: iFeed[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    return NextResponse.json(
      {
        success: true,
        data: feeds,
        count: feeds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feeds' },
      { status: 500 }
    );
  }
}
