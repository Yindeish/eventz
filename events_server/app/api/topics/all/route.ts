import { iTopic } from '@/types/topics';
import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with real database call
const mockTopics: iTopic[] = [
  {
    id: 'topic-1',
    title: 'Live Music',
    description: 'Concerts, festivals, and live music performances',
    category: 'Music'
  },
  {
    id: 'topic-2',
    title: 'Contemporary Art',
    description: 'Modern art exhibitions and installations',
    category: 'Art'
  },
  {
    id: 'topic-3',
    title: 'Health & Wellness',
    description: 'Fitness, meditation, and wellness events',
    category: 'Health'
  },
  {
    id: 'topic-4',
    title: 'Business Growth',
    description: 'Networking and professional development',
    category: 'Business'
  }
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with real database query
    // const topics = await db.topics.findAll();

    return NextResponse.json(
      {
        success: true,
        data: mockTopics,
        count: mockTopics.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
