import { ai } from '@/gemini/config';
import { iTopic } from '@/types/topics';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const prompt = `Generate a list of trending event topics/categories.

Each topic should have:
- id: unique identifier
- title: topic name
- description: brief description of the topic
- category: event category (Music, Art, Health, Business, Banking, Reading)

Your response MUST be ONLY a JavaScript/JSON array. Do not include explanations or markdown. Return an empty array [] if no topics found.`;

        const result = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
        });

        let topics: iTopic[] = [];
        try {
            topics = JSON.parse(result.text as string);
            if (!Array.isArray(topics)) {
                topics = [];
            }
        } catch {
            topics = [];
        }

        // Save to database
        // TODO: await db.topics.createMany(topics);

        return NextResponse.json(
            {
                success: true,
                data: topics,
                count: topics.length
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error generating topics:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate topics' },
            { status: 500 }
        );
    }
}
