import { ai } from '@/gemini/config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const desc = formData.get('desc');
    const image = formData.get('image') as File | null;

    if (!desc || typeof desc !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Post description is required' },
        { status: 400 }
      );
    }

    let imagePart = null;

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());

      imagePart = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: image.type,
        },
      };
    }

    /**
     * STRICT + CONCISE PROMPT
     */
    const textPrompt = `
You are a professional social media editor.

TASK:
Improve the given post text to be clearer, more natural, and engaging.

RULES (STRICT):
- Preserve the original meaning
- Do NOT introduce new ideas
- Do NOT repeat the same idea differently
- Do NOT be promotional or salesy
- Do NOT use emojis, hashtags, markdown, or line breaks
- Keep it concise and human
- If an image is provided, align tone subtly without describing the image

OUTPUT RULE (CRITICAL):
- Output MUST be plain text only
- Do NOT wrap in quotes
- Do NOT add explanations
- Return ONLY the improved post text

Original Post:
${desc}
`;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      // model: 'gemini-3-pro-fast',
      contents: imagePart
        ? [{ role: 'user', parts: [imagePart, { text: textPrompt }] }]
        : [{ role: 'user', parts: [{ text: textPrompt }] }],
    });

    const improvedText = result.text?.trim() ?? '';

    return NextResponse.json(
      {
        success: true,
        data: improvedText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error improving post text:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to improve post text', err: error },
      { status: 500 }
    );
  }
}
