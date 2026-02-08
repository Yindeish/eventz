import { iTrending } from '@/types/event';
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query as fsQuery, orderBy, limit as fsLimit } from 'firebase/firestore';
import { db } from '@/firebase';

export async function GET(request: NextRequest) {
  try {
    // Fetch latest 10 trending items from Firestore ordered newest -> oldest
    const trendingCollection = collection(db, 'trending');
    const trendingQuery = fsQuery(trendingCollection, orderBy('createdAt', 'desc'), fsLimit(10));

    let trending: iTrending[] = [];
    try {
      const snapshot = await getDocs(trendingQuery);
      trending = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    } catch (err) {
      console.error('Error fetching trending from Firestore:', err);
      // Return empty array if query fails
      trending = [];
    }

    return NextResponse.json(
      {
        success: true,
        data: trending,
        count: trending.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching trending:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending items' },
      { status: 500 }
    );
  }
}
